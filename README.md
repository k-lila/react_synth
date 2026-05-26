# harenator

Sintetizador musical web com síntese aditiva por série de Fourier, teclado de piano interativo e editor de formas de onda em tempo real.

**Stack:** TypeScript · React 18 · Vite · Redux Toolkit · Styled Components · D3 · Web Audio API

---

## Arquitetura

```
Redux (recipe + keyboardkeys)
        │
        ├── useKeyboard()              escalas → frequências por oitava
        │        └── Keyboard / ScaleGenerator
        │
        ├── useMinBufferSizeMap()      buffers PCM sem artefatos por frequência
        │
        └── useSynth()                 orquestrador central
                 └── FundamentalWave   síntese: sin · square · saw · tri
                          │
                          ├── usePlayStop()    Web Audio API (play / stop com envelope)
                          │
                          └── lineplot()       visualização D3 (SVG em tempo real)
```

### Escalas suportadas

| Escala     | Técnica                      | Teclas pretas       |
| ---------- | ---------------------------- | ------------------- |
| Cromática  | 12-TET (igual temperamento)  | Sustenidos          |
| Natural    | Just intonation (harmônicos) | Sustenidos e bemóis |
| Pitagórica | Razões de quinta pura (3:2)  | Nenhuma             |

---

## Pré-requisitos

| Ferramenta | Versão mínima | Necessário para       |
| ---------- | ------------- | --------------------- |
| Node.js    | 20+           | Instalar dependências |
| npm        | 10+           | Executar scripts      |

---

## Instalação e execução

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento (http://localhost:5173)
npm run dev

# Build de produção
npm run build

# Pré-visualizar o build
npm run preview
```

---

## Estrutura do projeto

```
src/
├── classes/          Motor de síntese (ScaleGenerator, Keyboard, FundamentalWave)
├── components/       Componentes de UI (BasicSlider, PianoKey, Menu…)
├── containers/       Orquestração de layout (Harenator, WaveEditor, PianoKeyboard…)
├── hooks/            Lógica reutilizável (useSynth, usePlayStop, useKeyboard…)
├── store/            Estado global Redux
│   └── reducers/     recipe (síntese) · keyboardkeys (teclado QWERTY)
├── types/            Tipos globais TypeScript
└── utils/            Utilitários (minbuffersize, lineplot, getkeyboardkey…)
```

---

## Uso

O sintetizador é controlado via mouse/touch ou teclado físico (QWERTY).

### Mapeamento QWERTY

```
Teclas brancas:  A  S  D  F  G  H  J  K  L  Ç  ~  ]
Sustenidos:      W  E  R  T  Y  U  I  O  P
Bemóis (natural):2  3  4  5  6  7  8  9  0
```

### Editor de ondas

Cada **onda fundamental** tem:

- Tipo de forma (senoidal, quadrada, dente-de-serra, triangular)
- Ganho e fase globais
- Série de harmônicos individuais com amplitude e fase por parcial

---
