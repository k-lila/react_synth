# Pipeline de áudio — da receita ao oscilador

Mapa do caminho completo da geração de som no `harenator`, da "receita" (estado
Redux) até o `OscillatorNode` que toca nos alto-falantes.

## Visão geral

O áudio **não é gerado quadro a quadro** nem pré-renderizado em PCM. A `recipe` é
compilada **uma vez** num `PeriodicWave` (espectro de Fourier — parciais arbitrários
com fases independentes); esse timbre **independe da nota**. Tocar uma tecla apenas cria
um `OscillatorNode` leve e descartável, configura-o com o `PeriodicWave` e varia a
frequência. Tudo recompila o timbre quando `recipe.waves` muda. Motivação e trade-offs
dessa escolha: **[ADR-0001](adr/0001-sintese-por-oscilador-nativo.md)**.

```
PONTO 0 ─ RECEITA (Redux: store/reducers/recipe.ts)
  SynthRecipe = { pitch, gain, scale, octaves[], waves[] }
  cada wave = { type:sin|square|saw|tri, gain, phase, amplitudes[], phases[] }
        │
        ├──────────────────────────────────┬───────────────────────────────────┐
        ▼                                  ▼                                    ▼
  ╔══ A. QUAIS NOTAS ══╗          (recipe.waves = o timbre)          (recipe.gain = volume)
  ║ scalegenerator.ts  ║                    │
  ║  razões das escalas║                    ▼
  ║  chromatic=12-TET  ║          ╔══════════ B. TIMBRE ─ classes/hareom.ts ══════════╗
  ║  natural/pitagoric ║          ║ p/ cada wave da receita (HareOm):                 ║
  ║  = razões justas   ║          ║   parcial i → harmônico (i+1)×fundamental         ║
  ║        │           ║          ║   tipo expandido em série de Fourier band-limited ║
  ║ keyboard.ts        ║          ║     sin  → só o harmônico 1                       ║
  ║  ancora em pitch   ║          ║     square→ ímpares, 4/πk                         ║
  ║  (Lá=440), gera     ║         ║     saw   → todos, 2/πk (alterna sinal)           ║
  ║  oitavas em Hz     ║          ║     tri   → ímpares, 8/π²k²                       ║
  ║ useKeyboard.ts     ║          ║   fase global ×n, fase do parcial ×k             ║
  ║  keyboard[t][oit][n]║         ║   acumula em real[]/imag[]                        ║
  ║        │           ║          ║                                                   ║
  ║ useKeyboardLayout  ║          ║ hooks/useHareSynth.ts (useMemo em recipe.waves):  ║
  ║  achata a faixa    ║          ║   SOMA os coeficientes de todas as waves          ║
  ║  recipe.octaves →  ║          ║   audioCtx.createPeriodicWave(real, imag)         ║
  ║  frequências (Hz)  ║          ╚════════════════════════│══════════════════════════╝
  ╚═════════│══════════╝                                   │ 1 PeriodicWave (todo o timbre)
            │ naturalFrequencies / unnaturalFrequencies    │
            └──────────────────────┬────────────────────────┘
                                   ▼
           containers/harenator → PianoKeyboard → PianoKey (props.frequency, play, stop)
                                   │
  ╔═══════════ C. REPRODUÇÃO ─ classes/haresom.ts (1 voz por keyid) ═══════════════════╗
  ║ play(frequency):                                                                   ║
  ║   osc = createOscillator() ; osc.setPeriodicWave(wave) ; osc.frequency = frequency ║
  ║   gainNode com rampa de attack (0 → gain) ; gain = recipe.gain * 0.5              ║
  ║   osc → gainNode → audioCtx.destination ; osc.start()                            ║
  ║ stop():  rampa de release (gain → 0) ; osc.stop() ; descarta no onended           ║
  ╚═══════════════════════════════════════════════════════════════════════════════════╝
                                   ▲
        Gatilho: tecla (mouse/QWERTY) → keyboardkeys (Redux)
                 → PianoKey useEffect → play(frequency, id) / stop(id)
```

## As etapas em palavras

**A — Quais frequências existem** (`scalegenerator.ts` → `keyboard.ts` → `useKeyboard`
→ `useKeyboardLayout`)
`ScaleGenerator` produz as *razões* de cada escala (cromática = temperamento igual
`2^(1/12)`; natural/pitagórica = razões justas com 3 e 5). `Keyboard` ancora essas
razões no `pitch` (Lá=440) e expande em oitavas, gerando frequências absolutas em
Hz: `keyboard[tipo][oitava][nota]`. `useKeyboardLayout` achata a faixa `recipe.octaves`
em duas listas planas — `naturalFrequencies` e `unnaturalFrequencies` — paralelas por
índice à renderização do teclado. Esta etapa diz apenas **quais** notas existem,
independente da rota de síntese.

**B — Timbre (compila o `PeriodicWave`)** (`hareom.ts` + `useHareSynth`) — *o coração*
Cada `wave` da receita é compilada por um `HareOm` nos coeficientes de Fourier
(`real`/`imag`): o parcial `i` vira o harmônico `(i+1)×fundamental` e o `type` é expandido
em sua **série band-limited** (sem aliasing — `square`/`saw`/`tri` saem mais limpos que os
geradores naïve). A fase global desloca o harmônico `n` por `n·phase`; a fase do parcial,
por `k·phases[i]`. Dentro de um `useMemo` (recompila só quando `recipe.waves` muda),
`useHareSynth` **soma os coeficientes de todas as waves** num só espectro e chama
`audioCtx.createPeriodicWave(real, imag)`. Resultado: **um único `PeriodicWave`** que serve
qualquer nota — o oscilador só varia a frequência. O `PeriodicWave` normaliza o pico para
~1, então o volume absoluto vem do `GainNode` de cada voz (etapa C), não do espectro.

**C — Reprodução** (`haresom.ts`, uma voz por `keyid`, orquestrada por `useHareSynth`)
Cada tecla pressionada instancia uma `HareSom` monofônica (descartada no `stop`);
**polifonia = uma voz por `keyid`**, num `Map` em `useHareSynth`. `play(frequency)` cria um
`OscillatorNode` dedicado, aplica o `PeriodicWave` e a frequência, sobe o attack
(`GainNode`, rampa linear de 0 a `recipe.gain * 0.5`) e liga ao `destination`. `stop()`
desce o release e agenda `osc.stop()`, desconectando no `onended`. O oscilador é de uso
único. Pressionar a tecla atualiza `keyboardkeys` no Redux, e um `useEffect` na tecla
dispara `play(frequency, id)` / `stop(id)`.

> Mudar `recipe.waves` (timbre) ou `recipe.gain` (volume) **altera a nota já soando**:
> `useHareSynth` propaga o `PeriodicWave` recompilado / o novo ganho às vozes ativas
> (modulação ao vivo — **[ADR-0003](adr/0003-modulacao-ao-vivo.md)**). E o `AudioContext` pode
> nascer `suspended` (autoplay policy), retomando no primeiro gesto do usuário.

O fluxo é unidirecional: **`recipe` (Redux) → `classes/` (síntese) → `hooks/`
(timbre + áudio) → UI**.

> `FundamentalWave` **não** participa deste pipeline: é o motor de **visualização** das
> ondas no editor (sample rate de tela), fora do caminho de áudio.
