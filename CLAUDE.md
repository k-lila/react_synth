# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código deste repositório.

## Restrições de Execução

- Não refatore código fora do escopo explícito da tarefa pedida
- Não adicione tratamento de erro para cenários impossíveis
- Não crie arquivos sem ser pedido explicitamente
- Pergunte antes de agir se a tarefa tiver mais de 3 arquivos envolvidos
- Antes de cada alteração no código, apresente um relatório que aponte claramente: 1) razões dos novos códigos e/ou das modificações; 2) arquivos a serem criados, se houver; 3) arquivos a serem modificados, se houver
- Ao criar uma nova branch, pergunte seu nome
- Decisão arquitetural significativa (stack, padrão transversal, trade-off estrutural) deve virar um ADR em `docs/adr/`. ADRs são imutáveis: para mudar/reverter uma decisão, crie um novo ADR (`Substitui ADR-XXXX`) — não edite o antigo. Atualize o índice em `docs/adr/README.md`.
- Sempre que elaborar perguntas e fornecer as opções de resposta, sempre dê um panorama simples e resumido sobre a opção em si, com seus prós e contras.

## Visão Geral do Projeto

`harenator` é um sintetizador musical para web (síntese aditiva via séries de Fourier) construído com React 18 + TypeScript + Vite, Redux Toolkit, styled-components, D3 e a Web Audio API nativa.

É um **produto real**, destinado a usuários finais tocando no navegador — priorize UX, robustez e compatibilidade de browser ao decidir trade-offs.

## Comandos

`npm run` + `dev` (Vite em http://localhost:5173) · `build` (`tsc -b && vite build`) ·
`lint` · `preview` · `test` (`vitest run`) · `test:watch` · `coverage` (v8).
Descrição de cada script e versões das dependências: **`docs/stacks.md`**.

### Testes

Vitest, configurado em `vite.config.ts` (seção `test`). Escopo testável hoje = **núcleo
puro** (`classes/`, `utils/`, `store/reducers/`, ambiente `node`); áudio/UI verificados à
mão. Testes co-located (`*.test.ts`), imports explícitos, **fast-check** na matemática.
Referência canônica (pirâmide, escopo vivo + roadmap, convenções e exemplos):
**`docs/testes.md`**.

## Arquitetura e mapa do projeto

Documentação detalhada (diagramas, fluxo de dados completo, tabela de camadas): **`docs/arquitetura.md`**. Stacks com versões e papel de cada dependência: **`docs/stacks.md`**. Pipeline de áudio passo a passo (receita → `PeriodicWave` → `OscillatorNode`, com diagrama das etapas): **`docs/pipeline-audio.md`**. Vínculo posicional entre as frequências e as teclas (visuais + QWERTY): **`docs/keyboard.md`**. Decisões arquiteturais (o *porquê* datado e imutável de cada escolha estrutural; índice): **`docs/adr/README.md`**.

Cerne não óbvio: o áudio usa o **oscilador nativo** (`OscillatorNode` + `PeriodicWave`), não PCM nem streaming quadro a quadro — quando a slice `recipe` muda, `useHareSynth` compila o timbre uma vez num `PeriodicWave` (independente da nota) e tocar uma tecla apenas dispara um oscilador leve nessa frequência. Motivação e trade-offs: **[ADR-0001](docs/adr/0001-sintese-por-oscilador-nativo.md)**. Fluxo unidirecional: `recipe` (Redux) → `classes/` (síntese) → `hooks/` (compila timbre + áudio) → `containers/`/`components/` (UI).

### Esquema simplificado

`store/reducers/` (recipe·keyboardkeys) · `classes/` (timbre·escalas·afinação·reprodução) ·
`hooks/` (timbre·áudio·input·layout) · `utils/` (plot D3·helpers) · `components/` (UI folha)
· `containers/` (layout) · `types/*.d.ts` (tipos globais, sem import). Árvore completa,
papéis e diagramas: **`docs/arquitetura.md`**.

### Onde mexer

- **Matemática do timbre (áudio)** (harmônicos, soma de parciais, fase) → `classes/hareom.ts`. Compila um `WaveRecipe` nos coeficientes de Fourier (`real`/`imag`) de um `PeriodicWave`; o parcial `i` vira o harmônico `(i+1)×fundamental`, cada tipo expandido em série band-limited. A **visualização** das ondas no editor continua em `classes/fundamentalwave.ts` (em sample rate de tela, fora do caminho de áudio).
- **Quais notas existem** (escalas `chromatic`/`natural`/`pitagoric`, afinação) → `classes/scalegenerator.ts` + `classes/keyboard.ts`. `useKeyboard` expõe `keyboard[0|1|2][oitava][nota]` (naturais / sustenidos / bemóis); `useKeyboardLayout` achata isso nas frequências tocáveis (faixa `recipe.octaves`).
- **Como o som se liga à tecla** (vínculo posicional por índice; `id` costura a frequência da nota + `pressed` no Redux + keycode QWERTY; ids `10X`/`11X` para bemóis/sustenidos) → `containers/pianokeyboard` + `components/pianokey` (brancas) + `components/blackpianokey` (pretas) + `store/reducers/keyboardkeys.ts`. Detalhes e mapa de índices: **`docs/keyboard.md`**.
- **O que o som _é_** → slice `recipe` (`store/reducers/recipe.ts`): `pitch`, `gain`, `scale`, `octaves` (faixa `[início, fim]`), `waves[]` (cada wave: `type` `sin`/`square`/`saw`/`tri`, `gain`, `phase`, arrays paralelos `amplitudes[]`/`phases[]`).
- **Compilação do timbre e layout de notas** → `hooks/useHareSynth.ts` (`useMemo` sobre `recipe.waves`: soma os `HareOm` num só `PeriodicWave`; pool de vozes `Map<keyid, HareSom>`) e `hooks/useKeyboardLayout.ts` (quais notas existem por escala/oitava → frequências). O caminho completo (receita → timbre → oscilador → reprodução) está em **`docs/pipeline-audio.md`**.
- **Reprodução** (play/stop, envelope attack/release por rampa linear, oscilador descartável) → `classes/haresom.ts`.

### Stacks (resumo)

React 18 + TypeScript + Vite (SWC) · Redux Toolkit + React-Redux · styled-components · D3 (SVG) · Web Audio API nativa. Tooling: ESLint + Prettier. Testes: Vitest + fast-check (núcleo puro). Detalhes e versões: `docs/stacks.md`.

## Layout e convenções

- Tipos globais ambientes em `src/types/*.d.ts` (`SynthRecipe`, `WaveRecipe`, props — utilizáveis sem import). Papéis das pastas: ver `### Esquema simplificado` acima / `docs/arquitetura.md`.
- Um componente/container é uma pasta com `index.tsx` + `styles.ts` (styled-components).
- Estilo de código (`.prettierrc`): sem ponto e vírgula, aspas simples, sem vírgula final. TS é estrito com `noUnusedLocals`/`noUnusedParameters`.

## Convenções de Desenvolvimento

Princípios que guiam *como* escrever código aqui. Consistência com o existente vence
preferência pessoal; na dúvida, espelhe o arquivo vizinho.

**Componentes**
- Pequenos e de responsabilidade única; quebre quando crescer.
- Separe apresentação (`components/`) de orquestração/estado (`containers/`).
- Arrow const com props desestruturadas; sem `React.FC`.
- Render puro: sem efeito colateral nem lógica pesada no corpo do JSX.

**Tipos**
- Domínio e props em `types/*.d.ts` (ambient, sem import); reuse antes de criar novo.
- Nunca `any`; derive tipos (`keyof`, `ReturnType`, unions discriminadas) em vez de duplicar.

**Hooks e lógica**
- Lógica reutilizável ou com estado → custom hook (`useX`, retorna objeto).
- Respeite as regras dos hooks; declare as dependências reais de efeitos/memo.
- Memoize só com custo medido (ex.: PCM em `useSynth`), não por reflexo.

**Estado**
- Local por padrão; só o que é compartilhado vai ao Redux.
- Mutações via `createSlice`; trate o estado como imutável fora do reducer.
- Preserve o fluxo unidirecional `recipe → classes → hooks → UI`.

**Estilo**
- styled-components por componente, exportado como `XStyled`; props transientes com `$`.
- Classes utilitárias globais com prefixo `--`.

**Documentação (TSDoc)**
- API pública do núcleo (`classes/` exportadas, hooks `useX`, `utils/` exportados) leva
  TSDoc; `private`/helpers triviais não. Comente o *porquê* e o contrato não-óbvio
  (unidade, faixa, invariante, ordem de chamada), nunca o que o tipo já diz.
- Tags permitidas: `@param` `@returns` `@remarks` `@throws` `@example` `@see`
  `@deprecated`. Regra de ouro do `@param`: só documente se acrescentar unidade/faixa/
  invariante; senão, omita. Detalhes e *porquê*: **[ADR-0002](docs/adr/0002-padrao-tsdoc.md)**.

**Geral**
- Reuse/estenda antes de criar (DRY); não abstraia sem segundo uso (YAGNI).
- Nomes descritivos em português; clareza acima de esperteza.
- Mudança mínima e local ao escopo; evite refator oportunista.
