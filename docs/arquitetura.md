# Arquitetura — harenator

Sintetizador musical para web (síntese aditiva via séries de Fourier) construído com
React 18 + TypeScript + Vite, Redux Toolkit, styled-components, D3 e a Web Audio API nativa.

O ponto central não óbvio: o áudio **não** é transmitido quadro a quadro — quando a `recipe`
muda, `useSynth` re-renderiza toda nota tocável em um buffer em loop, e tocar uma tecla
apenas repete esse buffer. Motivação e trade-offs dessa escolha:
**[ADR-0001](adr/0001-pcm-pre-renderizado-em-loop.md)**.

## 1. Esquema de arquivos e diretórios

```
react_synth/
│
├── Configuração raiz
│   ├── index.html                  ← ponto de entrada HTML
│   ├── package.json                ← deps e scripts (dev/build/lint/preview)
│   ├── vite.config.ts              ← config do Vite
│   ├── tsconfig*.json              ← TS (app / node / base)
│   ├── eslint.config.js
│   ├── CLAUDE.md · README.md
│
├── docs/
│   ├── arquitetura.md              ← este documento (mapa + fluxo + camadas)
│   ├── pipeline-audio.md           ← receita → PCM → AudioBuffer (4 etapas)
│   ├── keyboard.md                 ← vínculo posicional PCM ↔ teclas
│   ├── stacks.md                   ← dependências, versões e papéis
│   └── testes.md                   ← pirâmide, escopo testável e convenções
│
└── src/
    ├── main.tsx                    ← bootstrap React + Redux Provider
    ├── App.tsx                     ← raiz da árvore de componentes
    ├── styles.ts                   ← estilos globais
    ├── vite-env.d.ts
    │
    ├── assets/                     ← ícones SVG (all, change, close, up/down, plus/minus)
    │
    ├── types/                      ← tipos ambientes globais (sem import)
    │   ├── synthtypes.d.ts         ← SynthRecipe, WaveRecipe…
    │   └── propstypes.d.ts         ← tipos de props
    │
    ├── store/                      ← REDUX (fonte da verdade)
    │   ├── index.ts                ← configureStore
    │   └── reducers/
    │       ├── recipe.ts           ← pitch, gain, scale, waves[]  ◄── o som
    │       └── keyboardkeys.ts     ← teclas QWERTY pressionadas
    │
    ├── classes/                    ← MOTOR de síntese (lógica pura)
    │   ├── fundamentalwave.ts      ← síntese aditiva (Fourier) por wave
    │   ├── scalegenerator.ts       ← escala → razões de frequência
    │   └── keyboard.ts             ← + pitch → frequências absolutas/oitava
    │
    ├── hooks/                      ← LÓGICA reutilizável / orquestração
    │   ├── useSynth.ts             ★ orquestrador: pré-renderiza PCM de cada nota
    │   ├── usePlayStop.ts          ← AudioBuffer em loop + play/stop (envelope)
    │   ├── useKeyboard.ts          ← monta keyboard[oitava][nota]
    │   ├── useMinBufferSizeMap.ts  ← buffer sem cliques por frequência
    │   ├── useQwerty.ts / useKeyboardQWERTY.ts  ← input do teclado físico
    │   ├── usePitchChange.ts
    │   ├── useWaveEditorState.ts · useFundamentalWaveView.ts
    │   ├── useMainWaveView.ts · useComponentSizes.ts
    │   ├── useWindowsSize.ts · useInfoBtn.ts
    │
    ├── utils/                      ← helpers
    │   ├── lineplot.tsx · waveeditorplot.tsx   ← visualização D3/SVG
    │   ├── minbuffersize.ts        ← cálculo de ciclo inteiro
    │   ├── getkeyboardkey.ts · getpercent.ts
    │
    ├── components/                 ← UI folha (cada um: index.tsx + styles.ts)
    │   ├── pianokey/ · blackpianokey/        ← teclas
    │   ├── basicslider/ · harmoniccontroler/ ← controles de parciais
    │   ├── keyboardvolume/ · menu/
    │   ├── wavechoosepopup/ · waveeditorheader/
    │   └── svgcontainer/
    │
    └── containers/                 ← LAYOUT / orquestração de UI
        ├── harenator/              ← container raiz da app
        ├── synthwindow/            ← janela principal do sintetizador
        ├── synthwave/              ← forma de onda resultante (ao vivo)
        ├── pianokeyboard/          ← teclado tocável
        ├── waveeditor/             ← editor de waves
        └── fundamentalwaveeditor/  ← editor de uma fundamental
```

## 2. Arquitetura e fluxo de dados

```mermaid
flowchart TD
    subgraph STORE["🗄️ store/ (Redux — fonte da verdade)"]
        recipe["recipe.ts<br/>pitch · gain · scale · waves[]"]
        keys["keyboardkeys.ts<br/>teclas QWERTY ativas"]
    end

    subgraph CLASSES["⚙️ classes/ (motor — lógica pura)"]
        scale["ScaleGenerator<br/>escala → razões"]
        kbd["Keyboard<br/>+ pitch → frequências/oitava"]
        fw["FundamentalWave<br/>síntese aditiva (Fourier)"]
        scale --> kbd
    end

    subgraph HOOKS["🪝 hooks/ (orquestração)"]
        useKeyboard["useKeyboard"]
        useMinBuf["useMinBufferSizeMap"]
        useSynth["★ useSynth<br/>pré-renderiza PCM<br/>de cada nota (oitavas 3–4)"]
        usePlayStop["usePlayStop<br/>AudioBuffer loop + envelope"]
        useQwerty["useQwerty / useKeyboardQWERTY"]
    end

    subgraph UI["🖥️ containers/ + components/"]
        harenator["harenator (raiz)"]
        synthwindow["synthwindow"]
        synthwave["synthwave (onda ao vivo)"]
        piano["pianokeyboard"]
        editor["waveeditor / fundamentalwaveeditor"]
    end

    plot["utils/lineplot · waveeditorplot<br/>(D3 → SVG)"]
    audio(["🔊 AudioBufferSourceNode<br/>→ GainNode → saída"])

    recipe --> fw
    kbd --> useKeyboard
    useKeyboard --> useSynth
    recipe --> useSynth
    fw --> useSynth
    useMinBuf --> useSynth

    useSynth -->|PCM pré-computado| piano
    piano --> usePlayStop
    usePlayStop --> audio

    keys --> useQwerty
    useQwerty --> piano

    recipe --> synthwave
    synthwave --> plot
    editor -->|edita| recipe

    harenator --> synthwindow & piano & editor
    synthwindow --> synthwave
```

## 3. Estrutura de diretórios

```mermaid
flowchart LR
    root["react_synth/"]

    root --> cfg["⚙️ config<br/>index.html · package.json<br/>vite · tsconfig · eslint"]
    root --> src["src/"]

    src --> entry["main.tsx · App.tsx<br/>styles.ts"]
    src --> assets["assets/<br/>(SVGs)"]
    src --> types["types/<br/>synthtypes.d.ts<br/>propstypes.d.ts"]

    src --> store["store/"]
    store --> store_r["reducers/<br/>recipe.ts<br/>keyboardkeys.ts"]

    src --> classes["classes/<br/>fundamentalwave.ts<br/>scalegenerator.ts<br/>keyboard.ts"]

    src --> hooks["hooks/<br/>useSynth · usePlayStop<br/>useKeyboard · useQwerty<br/>useMinBufferSizeMap · …"]

    src --> utils["utils/<br/>lineplot · waveeditorplot<br/>minbuffersize · getpercent"]

    src --> comps["components/ (UI folha)<br/>pianokey · blackpianokey<br/>basicslider · harmoniccontroler<br/>menu · wavechoosepopup · …"]

    src --> conts["containers/ (layout)<br/>harenator · synthwindow<br/>synthwave · pianokeyboard<br/>waveeditor · fundamentalwaveeditor"]
```

## 4. Camadas e responsabilidades

| Camada | Pasta | Papel |
|--------|-------|-------|
| Estado | `store/` | O que o som **é** (recipe) + teclas ativas |
| Motor | `classes/` | A **matemática** (síntese, escalas, afinação) |
| Orquestração | `hooks/` | Pré-computa PCM, gerencia áudio e input |
| Apresentação | `components/` / `containers/` | UI folha vs. layout |
| Auxiliares | `utils/` / `types/` / `assets/` | Plotagem, buffers, tipos globais, ícones |
