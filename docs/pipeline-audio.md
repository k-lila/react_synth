# Pipeline de áudio — do ponto 0 ao AudioBuffer

Mapa do caminho completo da geração de som no `harenator`, da "receita" (estado
Redux) até o `AudioBuffer` que toca nos alto-falantes.

## Visão geral

O áudio **não é gerado quadro a quadro**. Para cada nota tocável (oitavas 3–4) é
**pré-renderizado um buffer PCM de um ciclo inteiro**; tocar uma tecla apenas dá
**loop** nesse buffer. Tudo re-renderiza quando a slice `recipe` muda. Motivação e
trade-offs dessa escolha: **[ADR-0001](adr/0001-pcm-pre-renderizado-em-loop.md)**.

```
PONTO 0 ─ RECEITA (Redux: store/reducers/recipe.ts)
  SynthRecipe = { pitch, gain, scale, waves[] }
  cada wave = { type:sin|square|saw|tri, gain, phase, amplitudes[], phases[] }
        │
        ├──────────────────────────────┬───────────────────────────────┐
        ▼                              ▼                               ▼
  ╔══ A. QUAIS NOTAS ══╗      ╔══ B. TAMANHO DO BUFFER ══╗     (recipe.waves = o timbre)
  ║ scalegenerator.ts  ║      ║ minbuffersize.ts         ║
  ║  razões das escalas║      ║  acha nº de ciclos inteiros║
  ║  chromatic=12-TET  ║      ║  que cabem num buffer →    ║
  ║  natural/pitagoric ║      ║  loop sem clique           ║
  ║  = razões justas   ║      ║ {buffersize, num}          ║
  ║        │           ║      ║        │                   ║
  ║ keyboard.ts        ║      ║ useMinBufferSizeMap.ts     ║
  ║  ancora em pitch   ║      ║  Map<freq → {buffersize,num}>║
  ║  (Lá=440), gera     ║     ║  p/ cada freq (oitavas 3–4)║
  ║  oitavas em Hz     ║      ╚════════════│═══════════════╝
  ║ useKeyboard.ts     ║                   │
  ║  keyboard[t][oit][n]║                  │
  ╚═════════│══════════╝                  │
            └──────────────┬──────────────┘
                           ▼
  ╔══════════ C. SÍNTESE / PCM ─ hooks/useSynth.ts (useMemo) ══════════╗
  ║ p/ cada nota das oitavas 3–4 (naturais + acidentes):              ║
  ║   fundamental.setMinBufferSize(buffersize, num)                    ║
  ║   generateNote(recipe.waves, fundamental):                        ║
  ║     p/ cada wave da receita → classes/fundamentalwave.ts          ║
  ║       setIntensities(amplitudes) · setPhases(phases)              ║
  ║       createContext(type) → wavelist = parciais                   ║
  ║          parcial i usa mult. de freq (i+1)  ← série harmônica     ║
  ║          sin / square(sign) / saw / tri                           ║
  ║       getWave(gain, phase):                                       ║
  ║          soma os parciais amostra-a-amostra (Fourier)            ║
  ║          desloca fase global (rotaciona buffer) · × wave.gain     ║
  ║     soma todas as waves amostra-a-amostra                        ║
  ║     normaliza: ÷ (amplitude_pico/2)  → ~[-1, 1]                   ║
  ║                                                                   ║
  ║ Saída: naturalKeys[][]  ·  unnaturalKeys[][][]  (PCM por nota)    ║
  ╚════════════════════════════════│══════════════════════════════════╝
                                   ▼
           containers/harenator → PianoKeyboard → PianoKey (props.wavedata = 1 PCM)
                                   │
  ╔═══════════ D. REPRODUÇÃO ─ hooks/usePlayStop.ts ═══════════════════╗
  ║ createBuffer(1ch, wave.length-1, sampleRate)  ← o AudioBuffer      ║
  ║ preenche canal: nowBuffering[i] = wave[i] * 0.5 * gain             ║
  ║ play():  source = createBufferSource()                            ║
  ║          source.loop = true ; source.buffer = AudioBuffer          ║
  ║          GainNode com rampa de attack (0→gain)                    ║
  ║          source → gainNode → audioCtx.destination ; source.start() ║
  ║ stop():  rampa de release (gain→0) ; stop()+disconnect            ║
  ╚═══════════════════════════════════════════════════════════════════╝
                                   ▲
        Gatilho: tecla (mouse/QWERTY) → keyboardkeys (Redux)
                 → PianoKey useEffect → play() / stop()
```

## As 4 etapas em palavras

**A — Quais frequências existem** (`scalegenerator.ts` → `keyboard.ts` → `useKeyboard`)
`ScaleGenerator` produz as *razões* de cada escala (cromática = temperamento igual
`2^(1/12)`; natural/pitagórica = razões justas com 3 e 5). `Keyboard` ancora essas
razões no `pitch` (Lá=440) e expande em oitavas, gerando frequências absolutas em
Hz: `keyboard[tipo][oitava][nota]`.

**B — Tamanho do buffer** (`minbuffersize.ts` → `useMinBufferSizeMap`)
Para uma dada frequência, acha quantos ciclos inteiros cabem num buffer de tamanho
redondo (`{buffersize, num}`), garantindo que o loop emende sem clique.
Pré-computado num `Map` para todas as notas tocáveis.

**C — Síntese (gera o PCM)** (`useSynth` + `fundamentalwave.ts`) — *o coração*
Dentro de um `useMemo`, para cada nota das oitavas 3–4: configura o buffer daquela
frequência e chama `generateNote`. Para cada `wave` da receita, `FundamentalWave`
monta os parciais (o parcial `i` tem multiplicador de frequência `i+1` — a série
harmônica), `getWave` **soma os parciais amostra-a-amostra** (síntese de Fourier),
aplica fase global e ganho. Soma todas as waves, **normaliza** pelo pico. Resultado:
um array PCM por nota (`naturalKeys` / `unnaturalKeys`).

**D — Reprodução** (`usePlayStop` em cada `PianoKey`)
O array PCM da nota vira um `AudioBuffer` (mono, `sampleRate`), preenchido com
`wave[i] * 0.5 * gain`. Ao tocar: um `AudioBufferSourceNode` com `loop = true` →
`GainNode` (rampa linear de attack/release) → `audioCtx.destination`. Pressionar a
tecla atualiza `keyboardkeys` no Redux, e um `useEffect` dispara `play()`/`stop()`.

O fluxo é unidirecional: **`recipe` (Redux) → `classes/` (síntese) → `hooks/`
(PCM + áudio) → UI**.
