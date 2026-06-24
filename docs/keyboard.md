# Vínculo entre o som gerado e o teclado

Como os buffers PCM pré-renderizados em `useSynth` se ligam às teclas do teclado
(visuais e físicas QWERTY) no `harenator`.

## Ideia central

O vínculo é **posicional (por índice)** — não há lookup por nota ou frequência. O que
liga um array PCM a uma tecla é a **posição** dele nos arrays de saída do `useSynth` e o
`id` da tecla. Esse `id` costura três coisas: o **som** (PCM), o **estado** (`pressed`) e a
**tecla física** (keycode QWERTY).

```
                    useSynth()  ── retorna 4 arrays PARALELOS, alinhados por índice ──┐
                                                                                      │
   naturalKeys          = [ PCM₀,   PCM₁,   PCM₂,  … ]   ← som de cada nota natural   │
   naturalFrequencies   = [ 261.6,  293.7,  329.6, … ]   ← Hz da MESMA posição        │
   unnaturalKeys        = [ [PCM], [PCM],  … ]           ← som das teclas pretas (#/b)│
   unnaturalFrequencies = [ [Hz],  [Hz],   … ]                                        │
                                                                                      │
        (a ordem do array = ordem do loop oitavas 3–4 × notas em useSynth)            │
                                                                                      ▼
   ┌──────────────────── containers/harenator ────────────────────────────────────────┐
   │  passa os 4 arrays inteiros como props para PianoKeyboard                          │
   └───────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
   ┌──────────────── containers/pianokeyboard ─ DISTRIBUI POR ÍNDICE ────────────────┐
   │  for i in 0..keyboardSize:                                                       │
   │     <PianoKey  id={i}                                                            │
   │                wavedata   = naturalkeys[i]        ← O SOM daquela tecla          │
   │                frequency  = naturalfrequencies[i] />                             │
   │  teclas pretas: índice remapeado (diff/_i) → unnaturalkeys[_i][0|1]              │
   │  useKeyboardQWERTY()  ← liga o teclado físico (uma vez)                          │
   └─────────────────────────────────────────────────────────────────────────────────┘
                    │ wavedata (1 PCM)                       │ id
                    ▼                                        ▼
   ┌──────── components/pianokey (id = i) ───────────────────────────────────────────┐
   │                                                                                  │
   │   usePlayStop(wavedata, audioctx)  ── o PCM vira AudioBuffer em loop             │
   │                                                                                  │
   │   keyboardkey = keyboardkeys.naturalkeys[ id ]   ← MESMO índice no Redux         │
   │                 { keycode:'KeyA', pressed }                                      │
   │                                                                                  │
   │   useEffect([keyboardkey.pressed]):  pressed ? play() : stop()                   │
   └──────────────────────────────────────────────────────────────────────────────────┘
                    ▲                                        ▲
       O QUE TOCA   │ play()/stop() leem o PCM               │ QUEM dispara o pressed
                    │                                        │
   ┌────────────────┴────────┐              ┌────────────────┴──────────────────────────┐
   │  state.keyboardkeys     │◄─────────────│  2 gatilhos escrevem `pressed` no Redux:   │
   │  (store/reducers/       │   dispatch   │                                            │
   │   keyboardkeys.ts)      │              │  ① Mouse/Touch na tecla                    │
   │                         │              │     onMouseDown → setKeyById({id})         │
   │  naturalkeys[id]        │              │                                            │
   │  flatkeys[id]           │              │  ② Teclado físico QWERTY                   │
   │  sharpkeys[id]          │              │     useQwerty → setKeyByCode({keycode})    │
   │  cada um: {id,keycode,  │              │     (casa pelo keycode: KeyA, KeyW, …)     │
   │            pressed}     │              │                                            │
   └─────────────────────────┘              └─────────────────────────────────────────────┘
```

## O vínculo em palavras

**1. O som é casado à tecla por POSIÇÃO, não por nota.**
`useSynth` gera `naturalKeys` / `unnaturalKeys` na ordem do loop `oitavas 3–4 × notas`.
`naturalFrequencies[i]` é a frequência exata de `naturalKeys[i]` — arrays paralelos. Em
`PianoKeyboard`, o `for i` entrega `wavedata = naturalkeys[i]` para a `PianoKey id={i}`.
Trocar o timbre (`recipe.waves`) re-renderiza todos os PCM, mas o vínculo índice→tecla
não muda.

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

> A slice `keyboardkeys.ts` expõe as 4 actions: `setKeyByCode`, `setKeyById`,
> `setChromaticKeyById`, `setNaturalKeyById`.

Ambos só mudam `pressed` no Redux. O `useEffect` da tecla observa `pressed` e chama
`play()`/`stop()` em `usePlayStop`, que dá loop no **AudioBuffer daquele PCM específico**.
Ou seja: a entrada (clique/tecla) escolhe o índice → o índice já tem o PCM
pré-renderizado pendurado → o buffer toca.

## Resumo do mapeamento de índices

| Tecla (UI)            | id            | Som (PCM)                   | Estado (Redux)            |
| --------------------- | ------------- | --------------------------- | ------------------------- |
| Natural               | `i` (0..N)    | `naturalKeys[i]`            | `keyboardkeys.naturalkeys[i]` |
| Sustenido (cromática) | `11X`         | `unnaturalKeys[_i][0]`      | `keyboardkeys.sharpkeys`  |
| Bemol (natural)       | `10X`         | `unnaturalKeys[i][0]`       | `keyboardkeys.flatkeys`   |
| Sustenido (natural)   | `11X`         | `unnaturalKeys[i-1][1]`     | `keyboardkeys.sharpkeys`  |

Ver também: **`docs/pipeline-audio.md`** (geração do PCM, do ponto 0 ao `AudioBuffer`).
