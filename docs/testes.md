# Testes — harenator

Referência canônica de testes do projeto. O subagente `qa-tester` traz as **regras gerais**
de decisão (que camada testar, como descobrir o que testar, como auditar testes existentes);
este documento traz o que é **volátil ou detalhado demais** para viver no agente: a pirâmide
aplicada ao harenator, o **mapa vivo** do que é testável hoje + roadmap, e as **convenções
concretas** de implementação. Os dois trabalham juntos para manter a suíte saudável conforme
o projeto se transforma.

Para versões das stacks de teste, veja `docs/stacks.md`. Para o fluxo de dados e camadas,
`docs/arquitetura.md`.

## 1. A pirâmide de testes no harenator

A pirâmide organiza os testes por granularidade, velocidade e custo: muitos testes baratos e
rápidos na base, poucos caros e lentos no topo. Teste sempre na **camada mais barata** que
prova o contrato.

```mermaid
flowchart TB
    E2E["E2E — fluxo do usuário ponta a ponta<br/>(fora de escopo por ora)"]
    INT["Integração — módulos + infra real<br/>(hooks de áudio + Web Audio · pendente)"]
    UNIT["Unitário — núcleo puro determinístico<br/>(classes · utils · store/reducers · ATIVO)"]
    E2E --> INT --> UNIT
```

| Camada | Pergunta que responde | Ferramenta | Ambiente | Estado no projeto |
|--------|-----------------------|------------|----------|-------------------|
| **Unitário** | "a lógica desta unidade está correta?" | Vitest (+ fast-check) | `node` | **ativo** |
| **Integração** | "as peças conversam com a infra real?" | Vitest + stub de Web Audio | jsdom/stub | **pendente** (sem stub ainda) |
| **Componente/UI** | "o componente renderiza e reage certo?" | Vitest + Testing Library | jsdom | **pendente** (futuro) |
| **E2E** | "o usuário consegue usar o app?" | — | browser | **fora de escopo** por ora |

A base larga existe de propósito: os testes do núcleo rodam em milissegundos, são
determinísticos e localizam o defeito com precisão. As camadas acima só entram quando há
infra para sustentá-las sem flakiness.

## 2. Estado atual da suíte (mapa vivo)

> Esta seção é atualizada quando o **escopo testável muda** (humano/`techlead`), pois o
> `qa-tester` edita apenas `*.test.ts`. É a fonte da verdade sobre o que dá para testar hoje.

**Testável hoje — núcleo puro** (funções determinísticas, ambiente `node`, sem DOM/áudio):

| Área | Pasta | Cobertura atual |
|------|-------|-----------------|
| Timbre / síntese / afinação | `src/classes/` | `hareom.test.ts` · `fundamentalwave.test.ts` · `scalegenerator.test.ts` · `keyboard.test.ts` |
| Helpers | `src/utils/` | `getkeyboardkey.test.ts` · `getpercent.test.ts` |
| Estado (reducers) | `src/store/reducers/` | `recipe.test.ts` · `keyboardkeys.test.ts` |

**Pendente — `⚠️ não verificável` por automação** (validação manual no app por enquanto):

- Reprodução `HareSom` e o hook `useHareSynth` — tocam via `OscillatorNode`/`GainNode` reais;
  dependem de um **stub de Web Audio** que ainda não existe. Não tente testá-los; marque o
  comportamento como `⚠️ não verificável`. (O timbre puro, `HareOm.toCoefficients`, **é**
  testável sem Web Audio e já tem cobertura.)
- Componentes/containers (UI) — sem ambiente jsdom + Testing Library configurado ainda.

**Roadmap:**

1. Introduzir um **stub de Web Audio** (`AudioContext`/`OscillatorNode`/`PeriodicWave`/
   `GainNode`) → destrava a camada de **integração** para `HareSom`/`useHareSynth`
   (oscilador, envelope, pool de vozes).
2. Habilitar **jsdom + Testing Library** → camada de **componente** para a UI folha.
3. E2E permanece fora de escopo até haver necessidade real.

Quando um item do roadmap for concluído, mova-o para a tabela de "testável hoje" e ajuste o
`coverage.include` em `vite.config.ts` (§5) e a tabela da §1.

## 3. Convenções de implementação

- **Co-location:** o teste fica ao lado do fonte — `src/classes/hareom.test.ts` para
  `src/classes/hareom.ts`. Sufixo `.test.ts`.
- **Imports explícitos** (sem globals; `globals: false`): `import { describe, it, expect } from 'vitest'`
  e `import fc from 'fast-check'`.
- **AAA** (Arrange · Act · Assert): monte o cenário, execute a unidade, verifique. Uma razão de
  falha por teste; se cobre dois comportamentos, divida em dois.
- **Nomenclatura:** nome descritivo em **português** dizendo o comportamento esperado, não a
  implementação. Prefixe com o `AC-NN` ou a invariante que o teste cobre
  (ex.: `'RECIPE-AC-01: setPitch … não toca waves'`, `'propriedade: create* é linear na intensidade'`).
- **Estilo Prettier do projeto:** sem ponto-e-vírgula, aspas simples, sem vírgula final.
- **Asserção que falha-se-quebra:** nada de asserção tautológica que só reafirma a
  implementação — um teste que não falharia se o comportamento quebrasse é uma falsa rede de
  segurança (e o `senso-critico` o sinaliza como achado).
- **fast-check (propriedade)** para a matemática de síntese/escalas: verifique **invariantes**
  sobre entradas geradas, não só exemplos — periodicidade da onda, normalização, **ciclos
  inteiros do buffer** (`setMinBufferSize` → loop sem clique), afinação correta das escalas.
  Cuide para que o **gerador cubra o domínio real** (limites realistas) e que a propriedade não
  "passe" por vacuidade.
- **Não teste:** getters/setters triviais, código gerado, frameworks, nem cenários impossíveis.

## 4. Padrões por camada (núcleo)

A regra prática para o núcleo: **um exemplo concreto** (caso âncora legível) **+ uma
propriedade** (invariante sobre entradas geradas) onde a matemática justificar.

**Exemplo + propriedade** — `src/classes/hareom.test.ts` (referência canônica):

```ts
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import HareOm from './hareom'

// magnitude do harmônico n: sqrt(real^2 + imag^2)
const mag = (c: { real: Float32Array; imag: Float32Array }, n: number) =>
  Math.hypot(c.real[n], c.imag[n])

describe('HareOm', () => {
  it('HAREOM-AC-03: square tem só harmônicos ímpares (pares ~0) decaindo ~1/k', () => {
    const c = new HareOm(
      { type: 'square', gain: 1, phase: 0, amplitudes: [1], phases: [0] },
      16
    ).toCoefficients()
    for (let n = 2; n <= 16; n += 2) expect(mag(c, n)).toBeCloseTo(0, 12)
    expect(mag(c, 1) / mag(c, 3)).toBeCloseTo(3, 6) // 1/k → razão ~3
  })

  it('HAREOM-AC-10: variar a fase preserva a magnitude de cada harmônico', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('sin', 'square', 'saw', 'tri'),
        fc.double({ min: 0, max: 1, noNaN: true }),
        (type, phase) => {
          const base = new HareOm(
            { type, gain: 1, phase: 0, amplitudes: [1], phases: [0] },
            32
          ).toCoefficients()
          const shifted = new HareOm(
            { type, gain: 1, phase, amplitudes: [1], phases: [0] },
            32
          ).toCoefficients()
          // Float32Array => precisão ~1e-7; compara em nível compatível
          for (let n = 0; n <= 32; n++)
            expect(mag(shifted, n)).toBeCloseTo(mag(base, n), 5)
        }
      )
    )
  })
})
```

**Reducer com isolamento + não-regressão** — `src/store/reducers/recipe.test.ts`: cada teste
nomeia o `AC-NN`, afirma o campo alterado **e** que o resto não foi tocado, e trata o estado
como imutável (helper `clone` via `JSON.parse(JSON.stringify(...))`). Inclui propriedade de
pareamento `amplitudes.length === phases.length` após qualquer sequência de `add/removeHarmonic`.

**Timbre (áudio)** — `src/classes/hareom.test.ts`: por tipo, em quais harmônicos a energia cai
(`square`/`tri` só ímpares, `saw` todos) e o decaimento (`1/k`, `1/k²`); e como propriedade, a
linearidade no `gain`/amplitude e a preservação da magnitude sob variação de fase. Tudo no núcleo
puro (`toCoefficients`), sem Web Audio.

**Síntese (visualização)** — `src/classes/fundamentalwave.test.ts`: comprimento do buffer
(`minbuffer + 1`), amplitude normalizada em `[-1, 1]`, extremos próximos de zero (loop sem clique)
e linearidade na intensidade como propriedade. Veja também `scalegenerator.test.ts`/
`keyboard.test.ts` para afinação.

## 5. Configuração e comandos

Seção `test` do `vite.config.ts`:

```ts
test: {
  globals: false,
  environment: 'node',
  include: ['src/**/*.test.ts'],
  coverage: {
    provider: 'v8',
    include: ['src/classes/**', 'src/utils/**', 'src/store/reducers/**'],
    exclude: ['**/*.test.ts', '**/*.tsx']
  }
}
```

O `coverage.include` reflete o **escopo testável atual** (núcleo puro) — ao destravar uma camada
nova (§2 roadmap), amplie-o para não diluir a métrica com código ainda não testado.

| Script | Comando | Quando usar |
|--------|---------|-------------|
| `npm run test` | `vitest run` | Suíte uma vez (CI, antes de commit) |
| `npm run test:watch` | `vitest` | Durante o desenvolvimento (rerun ao salvar) |
| `npm run coverage` | `vitest run --coverage` | Diagnóstico de lacunas (cobertura é diagnóstico, não meta) |

## 6. Manter a suíte saudável (agente + doc)

O ciclo que mantém a bateria completa conforme o projeto muda:

1. **Decidir** — o `qa-tester` classifica a unidade pela pirâmide (§1) e consulta o mapa vivo
   (§2) para saber se a camada está ativa ou se o comportamento é `⚠️ não verificável`.
2. **Escrever** — segue as convenções da §3 e os padrões da §4; cada teste amarra um `AC-NN`/invariante.
3. **Auditar** — quando uma feature muda, localizar os testes que a exercitam; teste que passa
   mas não reflete mais o contrato é defeito (atualizar/remover); caçar lacunas de branch/edge.
   O `senso-critico` revisa imparcialmente a qualidade dos testes do `qa-tester`.
4. **Atualizar o mapa** — ao concluir um item do roadmap (§2) ou mudar o escopo testável,
   atualizar a §2, o `coverage.include` (§5) e a tabela da §1. Como o `qa-tester` só edita
   `*.test.ts`, ele **sinaliza** a defasagem no relatório; quem atualiza este doc é o
   humano/`techlead`.
