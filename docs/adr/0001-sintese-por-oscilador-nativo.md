# ADR-0001: Síntese por oscilador nativo (`PeriodicWave`)

## Status

Aceito

## Contexto

O `harenator` é um sintetizador aditivo: o som é definido pela slice `recipe`
(`pitch`, `gain`, `scale`, `octaves`, `waves[]` com amplitudes/fases dos parciais).
A partir dessa receita, cada tecla tocável precisa virar áudio audível pela Web Audio
API. A questão estrutural é **como** materializar o áudio.

Forças em jogo:

- O som de uma tecla é **periódico** e o timbre é **estático enquanto a `recipe` não
  muda** — a síntese (soma de parciais com fases independentes) é cara o bastante para
  não querer recalculá-la a cada bloco de áudio.
- O timbre **independe da frequência da nota**: a mesma forma de onda serve qualquer
  altura, mudando só a fundamental do oscilador.
- `square`/`saw`/`tri` ingênuos (gerados por amostra sem limite de banda) produzem
  *aliasing* audível; a série de Fourier band-limited resolve isso na origem.
- O conjunto de notas tocáveis pode crescer (faixa `octaves` configurável), então
  qualquer custo que escale com o número de notas é um risco de pico de CPU.

A Web Audio expõe `BaseAudioContext.createPeriodicWave(real, imag)`, que descreve
**qualquer** espectro de Fourier — exatamente parciais arbitrários com fases
independentes, que é o que a síntese aditiva do projeto produz. Um `PeriodicWave`
compilado uma vez pode alimentar um `OscillatorNode` leve em qualquer frequência.

## Decisão

Adotamos a **síntese por oscilador nativo** (`OscillatorNode` + `PeriodicWave`) como
motor de áudio do app.

O caminho que materializa isso:

- `classes/hareom.ts` (`HareOm`) — compila um `WaveRecipe` nos coeficientes `real`/`imag`
  de um `PeriodicWave`. O parcial `i` vira o harmônico `(i+1)×fundamental`; cada tipo
  (`sin`/`square`/`saw`/`tri`) é expandido em sua **série de Fourier ideal band-limited**
  (sem aliasing). `toCoefficients()` é núcleo puro, testável sem Web Audio.
- `classes/haresom.ts` (`HareSom`) — toca um `PeriodicWave` num `OscillatorNode` com
  envelope de attack/release por rampa linear no `GainNode`. Voz **monofônica**; o
  oscilador é **descartável**: criado em `play`, parado e desconectado em `stop`.
- `hooks/useHareSynth.ts` — orquestra os dois. Dono do único `AudioContext`, instanciado
  uma vez no `PianoKeyboard`. Compila o timbre **uma vez por mudança de `recipe.waves`**
  (`useMemo`), **somando** os coeficientes de todas as `waves[]` num só espectro, e mantém
  um pool polifônico de vozes (`Map<keyid, HareSom>`, uma `HareSom` por `keyid`).
  `play(frequency, keyid)` / `stop(keyid)` são distribuídos a todas as teclas (brancas e
  pretas); as frequências vêm de `hooks/useKeyboardLayout.ts`.

`classes/fundamentalwave.ts` (`FundamentalWave`) **não faz parte do áudio**: é o motor de
**visualização** das ondas no editor (`useFundamentalWaveView`, `useMainWaveView`), em
sample rate de tela e fora do caminho de reprodução.

O fluxo unidirecional `recipe → classes → hooks → UI` é preservado.

## Consequências

**Positivas**

- Timbre compilado **uma vez por mudança de `recipe`**, independente do número de notas;
  tocar uma tecla é só criar um oscilador leve e descartável numa frequência.
- `square`/`saw`/`tri` sem aliasing (Fourier band-limited), mais limpos que geradores
  ingênuos por amostra.
- A matemática de síntese fica isolada em `classes/` (núcleo puro), testável de forma
  determinística (Vitest + fast-check), fora do caminho de áudio.
- Sem `AudioWorklet`/`ScriptProcessor`: nenhuma lógica de áudio em thread de tempo real,
  menos superfície de API.
- O modelo abre caminho para **modulação contínua** com a nota soando (trocar a wavetable
  de um oscilador vivo) — explorado no [ADR-0003](0003-modulacao-ao-vivo.md).

**Negativas / custos**

- O `PeriodicWave` **normaliza o pico para ~1** por padrão, então o volume absoluto vem do
  `GainNode` de cada voz, não da escala do espectro.
- O `AudioContext` pode nascer `suspended` (política de autoplay do navegador); depende do
  gesto do usuário na primeira tecla para retomar.
- Timbres salvos passam a depender do motor band-limited: um mesmo `recipe` soa diferente
  de qualquer renderização ingênua — reforça versionar timbres por motor.

## Alternativas consideradas

- **PCM pré-renderizado em loop** — sintetizar, a cada mudança da `recipe`, um buffer de
  ciclos inteiros por nota e tocar repetindo o buffer (`loop = true`). Tocar fica barato,
  mas o custo de re-síntese **escala com o número de notas**, exige andaimes para garantir
  ciclos inteiros (sem cliques na emenda) e fixa o timbre por nota — não há modulação
  contínua. Preterido pelo `PeriodicWave`, que entrega o espectro aditivo independente da
  frequência e sem esse custo.
- **`AudioWorklet` sintetizando em tempo real** — permitiria modulação por amostra, mas
  reintroduz o custo de síntese no caminho de áudio e a complexidade de thread, além de
  dificultar o teste determinístico do núcleo. O `PeriodicWave` entrega o espectro aditivo
  sem isso. Mantido como possibilidade futura caso se exija modulação por amostra.
