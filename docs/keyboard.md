# Vínculo entre o som gerado e o teclado

Como as frequências derivadas em `useKeyboardLayout` se ligam às teclas do teclado
(visuais e físicas QWERTY) no `harenator`.

## Ideia central

O vínculo é **posicional (por índice)** — não há lookup por nota. O que liga uma frequência
a uma tecla é a **posição** dela nos arrays de saída do `useKeyboardLayout` e o `id` da
tecla. Esse `id` costura três coisas: o **som** (a frequência tocada via `useHareSynth`),
o **estado** (`pressed`) e a **tecla física** (keycode QWERTY). O timbre é único e global
(um `PeriodicWave` em `useHareSynth`); a tecla só escolhe **qual frequência** disparar.

```
              useKeyboardLayout()  ── 2 listas PARALELAS, alinhadas por índice ──┐
                                                                                 │
   naturalFrequencies   = [ 261.6,  293.7,  329.6, … ]   ← Hz de cada nota natural│
   unnaturalFrequencies = [ [Hz],  [Hz],   … ]           ← Hz das teclas pretas(#/b)│
                                                                                 │
        (a ordem do array = ordem do loop oitavas (recipe.octaves) × notas)      │
                                                                                 ▼
   ┌──────────────────── containers/harenator ────────────────────────────────────┐
   │  useKeyboardLayout() → passa as listas como props para PianoKeyboard            │
   │  useHareSynth() vive no PianoKeyboard → expõe play(freq, id) / stop(id)         │
   └────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
   ┌──────────────── containers/pianokeyboard ─ DISTRIBUI POR ÍNDICE ────────────────┐
   │  const { play, stop } = useHareSynth()   ← dono do AudioContext (1 timbre)       │
   │  for i in 0..keyboardSize:                                                       │
   │     <PianoKey  id={i}                                                            │
   │                frequency = naturalfrequencies[i]   ← A NOTA daquela tecla        │
   │                play={play} stop={stop} />                                        │
   │  teclas pretas: índice remapeado (diff/_i) → unnaturalfrequencies[_i][0|1]       │
   │  useKeyboardQWERTY()  ← liga o teclado físico (uma vez)                          │
   └─────────────────────────────────────────────────────────────────────────────────┘
                    │ frequency + play/stop                  │ id
                    ▼                                        ▼
   ┌──────── components/pianokey (id = i) ───────────────────────────────────────────┐
   │                                                                                  │
   │   keyboardkey = keyboardkeys.naturalkeys[ id ]   ← MESMO índice no Redux         │
   │                 { keycode:'KeyA', pressed }                                      │
   │                                                                                  │
   │   useEffect([keyboardkey.pressed]):                                              │
   │       pressed ? play(frequency, id) : stop(id)   ← dispara/solta a voz           │
   └──────────────────────────────────────────────────────────────────────────────────┘
                    ▲                                        ▲
       O QUE TOCA   │ play()/stop() ligam um OscillatorNode  │ QUEM dispara o pressed
                    │ ao PeriodicWave global, na frequency    │
   ┌────────────────┴────────┐              ┌────────────────┴──────────────────────────┐
   │  state.keyboardkeys     │◄─────────────│  2 gatilhos escrevem `pressed` no Redux:   │
   │  (store/reducers/       │   dispatch   │                                            │
   │   keyboardkeys.ts)      │              │  ① Mouse/Touch na tecla                    │
   │                         │              │     onMouseDown → setKeyById({id})         │
   │  naturalkeys[id]        │              │                                            │
   │  flatkeys[id]           │              │  ② Teclado físico QWERTY                   │
   │  sharpkeys[id]          │              │     useQwerty → setKeyByCode({keycode})    │
   │  playing[] (ids ativos) │              │     (casa pelo keycode: KeyA, KeyW, …)     │
   └─────────────────────────┘              └─────────────────────────────────────────────┘
```

## O vínculo em palavras

**1. A frequência é casada à tecla por POSIÇÃO, não por nota.**
`useKeyboardLayout` gera `naturalFrequencies` / `unnaturalFrequencies` na ordem do loop
`oitavas (recipe.octaves) × notas`. Em `PianoKeyboard`, o `for i` entrega
`frequency = naturalfrequencies[i]` para a `PianoKey id={i}`. Trocar o timbre
(`recipe.waves`) recompila o `PeriodicWave` global, mas o vínculo índice→tecla e as
frequências não mudam.

**2. O `id` da tecla é a chave que junta som + estado + tecla física.**
A `PianoKey id={i}` lê `keyboardkeys.naturalkeys[i]` no Redux — **mesmo índice**. Esse
registro carrega `pressed` (toca/para) e `keycode` (a tecla QWERTY, ex.: `KeyA`). As
teclas pretas usam ids especiais (`10X` para bemóis, `11X` para sustenidos) e leem
`flatkeys`/`sharpkeys`.

**3. Dois gatilhos, um só estado.**
- **Mouse/touch:** `onMouseDown` →
  - teclas brancas (`components/pianokey`): `setKeyById({ id })`;
  - teclas pretas (`components/blackpianokey`): `setChromaticKeyById` (escala cromática →
    `sharpkeys`) ou `setNaturalKeyById` (escala natural → `flatkeys`/`sharpkeys` conforme `flat`).
- **QWERTY:** `useQwerty` captura o `event.code` → `setKeyByCode({ keycode })`, que casa
  pelo `keycode` registrado na slice.

> A slice `keyboardkeys.ts` expõe as actions de toque (`setKeyByCode`, `setKeyById`,
> `setChromaticKeyById`, `setNaturalKeyById`) e o registro `playing[]` (ids tocando agora),
> alimentado por `addPlayingKey`/`removePlayingKey` em `useHareSynth`.

Ambos só mudam `pressed` no Redux. O `useEffect` da tecla observa `pressed` e chama
`play(frequency, id)` / `stop(id)` do `useHareSynth`, que liga um `OscillatorNode` ao
`PeriodicWave` global na frequência da tecla. Ou seja: a entrada (clique/tecla) escolhe o
índice → o índice já tem a frequência pendurada → o oscilador toca essa nota.

## Resumo do mapeamento de índices

| Tecla (UI)            | id            | Som (frequência)               | Estado (Redux)            |
| --------------------- | ------------- | ------------------------------ | ------------------------- |
| Natural               | `i` (0..N)    | `naturalFrequencies[i]`        | `keyboardkeys.naturalkeys[i]` |
| Sustenido (cromática) | `11X`         | `unnaturalFrequencies[_i][0]`  | `keyboardkeys.sharpkeys`  |
| Bemol (natural)       | `10X`         | `unnaturalFrequencies[i][0]`   | `keyboardkeys.flatkeys`   |
| Sustenido (natural)   | `11X`         | `unnaturalFrequencies[i-1][1]` | `keyboardkeys.sharpkeys`  |

Ver também: **`docs/pipeline-audio.md`** (geração do timbre, da receita ao `OscillatorNode`).
