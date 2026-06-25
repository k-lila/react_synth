# ADR-0003: Síntese por oscilador nativo (`PeriodicWave`), não PCM pré-renderizado

## Status

Aceito — **Substitui [ADR-0001](0001-pcm-pre-renderizado-em-loop.md)**.

## Contexto

O [ADR-0001](0001-pcm-pre-renderizado-em-loop.md) adotou **PCM pré-renderizado em loop**:
a cada mudança da `recipe`, `useSynth` re-sintetizava o conjunto inteiro de notas tocáveis
(soma de parciais em `FundamentalWave`), e `usePlayStop` apenas repetia o buffer em loop.
Aquele ADR **rejeitou explicitamente o `OscillatorNode` nativo** com a justificativa de que
ele "não soma parciais arbitrários com fases independentes; não expressa a síntese aditiva".

Essa premissa caiu. A Web Audio expõe `BaseAudioContext.createPeriodicWave(real, imag)`, que
descreve **qualquer** espectro de Fourier — exatamente parciais arbitrários com fases
independentes. Construímos o caminho que materializa isso:

- `classes/hareom.ts` (`HareOm`) — compila um `WaveRecipe` (e, no orquestrador, a soma de
  `recipe.waves[]`) nos coeficientes `real`/`imag` de um `PeriodicWave`, com os 4 tipos em
  **série de Fourier ideal band-limited** (sem aliasing).
- `classes/haresom.ts` (`HareSom`) — toca um `PeriodicWave` num `OscillatorNode` com envelope
  de attack/release, descartando o oscilador a cada nota.
- `hooks/useHareSynth.ts` — orquestra os dois: compila o timbre uma vez (`useMemo` em
  `recipe.waves`) e mantém um pool de vozes polifônico (`Map<keyid, HareSom>`).

Forças que reabriram a decisão:

- O custo de re-síntese do PCM crescia com o range de notas; o `PeriodicWave` é **independente
  da frequência** — um único timbre serve qualquer nota, bastando o oscilador variar a Hz.
- `square`/`saw`/`tri` band-limited soam mais limpos que os geradores naïve do PCM.
- O modelo abre caminho para modulação contínua (varrer fase/filtro com a nota soando), que o
  PCM estático em loop não permitia.
- A pré-renderização exigia andaimes (`useMinBufferSizeMap`, `minbuffersize`, e a resíntese
  seletiva `playingslots` + slice `editing`) que somavam complexidade só para mitigar o custo
  do próprio PCM.

## Decisão

Adotamos a **síntese por oscilador nativo** como motor de áudio do app, **substituindo** o
PCM pré-renderizado.

- `useHareSynth` é o motor: dono do único `AudioContext`, instanciado uma vez no
  `PianoKeyboard`, com `play(frequency, keyid)`/`stop(keyid)` distribuídos a **todas** as
  teclas (brancas e pretas). Polifonia = uma voz `HareSom` por `keyid`.
- O layout de **quais notas existem** (frequências por escala/oitava) saiu para
  `hooks/useKeyboardLayout.ts` — concern ortogonal à rota de síntese.
- O fluxo unidirecional `recipe → classes → hooks → UI` é preservado.

Removidos por ficarem órfãos: `useSynth`, `usePlayStop`, `useMinBufferSizeMap`,
`utils/minbuffersize`, `utils/playingslots` e o slice `editing` (a resíntese seletiva existia
só para o PCM).

`FundamentalWave` **permanece** — não é parte do áudio, e sim o motor de **visualização** das
ondas no editor (`useFundamentalWaveView`, `useMainWaveView`, em sample rate de tela).

## Consequências

**Positivas**

- Timbre compilado uma vez por mudança de `recipe`, independente do nº de notas; tocar é só
  criar um oscilador leve e descartável.
- `square`/`saw`/`tri` sem aliasing (Fourier band-limited).
- Menos superfície: somem os andaimes de buffer/resíntese seletiva do PCM.
- Caminho aberto para modulação em tempo real no futuro.

**Negativas / custos**

- O timbre dos 4 tipos passa a **soar diferente** do PCM antigo (band-limited vs naïve) —
  divergência aceita de propósito; reforça versionar timbres salvos por motor.
- Trocar a `recipe` não altera uma nota **já soando** (a voz guarda o `PeriodicWave` do
  disparo); o novo timbre vale do próximo `play`.
- O `PeriodicWave` normaliza o pico para ~1, então o volume absoluto vem do `GainNode` de cada
  voz, não do espectro.
- O `AudioContext` pode nascer `suspended` (autoplay policy); depende do gesto do usuário na
  primeira tecla para retomar.

## Alternativas consideradas

- **Manter o PCM pré-renderizado (ADR-0001)** — funcional, mas com o custo de re-síntese e os
  andaimes que motivaram esta troca; e a objeção original ao oscilador foi superada pelo
  `PeriodicWave`.
- **`AudioWorklet` sintetizando em tempo real** — permitiria modulação contínua, mas
  reintroduz custo de síntese no caminho de áudio e complexidade de thread; o `PeriodicWave`
  entrega o espectro aditivo sem isso. Mantido como possibilidade futura caso se exija
  modulação por amostra.
