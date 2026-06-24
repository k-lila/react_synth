# Stacks — harenator

Detalhamento das tecnologias usadas no projeto, com versões (de `package.json`) e o papel
de cada uma. Para a visão arquitetural, veja `docs/arquitetura.md`.

## Core / Runtime

| Stack | Versão | Papel |
|-------|--------|-------|
| **React** (`react`, `react-dom`) | ^18.3.1 | Biblioteca de UI (componentes e hooks). |
| **TypeScript** | ~5.6.2 | Tipagem estática, em modo estrito (`noUnusedLocals`/`noUnusedParameters`). |
| **Vite** | ^6.0.5 | Bundler e servidor de desenvolvimento. |
| **@vitejs/plugin-react-swc** | ^3.5.0 | Integração React no Vite usando SWC (compilação rápida no lugar do Babel). |

## Estado

| Stack | Versão | Papel |
|-------|--------|-------|
| **@reduxjs/toolkit** | ^2.5.0 | Store, slices e reducers (fonte da verdade: `recipe`, `keyboardkeys`). |
| **redux** | ^5.0.1 | Núcleo do Redux (dependência do Toolkit). |
| **react-redux** | ^9.2.0 | Binding React ↔ Redux (`Provider`, `useSelector`, `useDispatch`). |

## Estilização

| Stack | Versão | Papel |
|-------|--------|-------|
| **styled-components** | ^6.1.14 | CSS-in-JS. Cada componente/container tem seu `styles.ts`. |

## Visualização

| Stack | Versão | Papel |
|-------|--------|-------|
| **d3** | ^7.9.0 | Renderiza as formas de onda como SVG ao vivo (`utils/lineplot.tsx`, `utils/waveeditorplot.tsx`). |
| **@types/d3** | ^7.4.3 | Tipos do D3 (devDependency). |

## Áudio

| Stack | Versão | Papel |
|-------|--------|-------|
| **Web Audio API** | nativa (navegador) | Síntese aditiva e reprodução (`AudioBuffer`, `AudioBufferSourceNode`, `GainNode`). Sem dependência externa. |

## Tooling / Qualidade de código

| Stack | Versão | Papel |
|-------|--------|-------|
| **eslint** | ^9.17.0 | Linter (`npm run lint`). |
| **@eslint/js** | ^9.17.0 | Configs base recomendadas do ESLint. |
| **typescript-eslint** | ^8.18.2 | Integração ESLint + TypeScript. |
| **eslint-plugin-react-hooks** | ^5.0.0 | Regras das Rules of Hooks. |
| **eslint-plugin-react-refresh** | ^0.4.16 | Avisos de compatibilidade com Fast Refresh. |
| **globals** | ^15.14.0 | Definições de variáveis globais para o ESLint. |
| **prettier** | 3.4.2 | Formatação: sem ponto e vírgula, aspas simples, sem vírgula final. |

### Tipos auxiliares (devDependencies)

| Stack | Versão | Papel |
|-------|--------|-------|
| **@types/react** | ^18.3.18 | Tipos do React. |
| **@types/react-dom** | ^18.3.5 | Tipos do React DOM. |

## Testes

| Stack | Versão | Papel |
|-------|--------|-------|
| **vitest** | ^3.2.6 | Test runner (integração nativa com o Vite). Roda em ambiente `node`; escopo atual é o núcleo puro (`classes`/`utils`/`store/reducers`). |
| **@vitest/coverage-v8** | ^3.2.6 | Relatório de cobertura via engine V8 (`npm run coverage`). |
| **fast-check** | ^4.8.0 | Testes baseados em propriedade para a matemática de síntese/escalas (invariantes sobre entradas geradas). |

Testes ficam **co-located** (`*.test.ts` ao lado do fonte). Os hooks de áudio
(`useSynth`/`usePlayStop`) ainda não são cobertos — dependem de um stub de Web Audio
a ser introduzido depois.

Convenções, a pirâmide aplicada ao projeto e o estado vivo da suíte: `docs/testes.md`.

## Scripts (`package.json`)

| Script | Comando | O que faz |
|--------|---------|-----------|
| `npm run dev` | `vite` | Servidor de desenvolvimento em http://localhost:5173. |
| `npm run build` | `tsc -b && vite build` | Checagem de tipos + empacotamento de produção. |
| `npm run lint` | `eslint .` | ESLint sobre o repositório. |
| `npm run preview` | `vite preview` | Serve o build de produção localmente. |
| `npm run test` | `vitest run` | Roda a suíte de testes uma vez. |
| `npm run test:watch` | `vitest` | Suíte em modo watch. |
| `npm run coverage` | `vitest run --coverage` | Suíte + relatório de cobertura. |
