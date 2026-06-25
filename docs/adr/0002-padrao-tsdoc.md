# ADR-0002: Padrão de TSDoc para a API pública do núcleo

## Status

Aceito

## Contexto

O `harenator` documenta arquitetura em camadas: `CLAUDE.md` e `docs/*.md` descrevem
*o que é hoje*, e os ADRs registram o *porquê* datado. Falta, porém, documentação no
**ponto de uso**: quem dá hover em `HareOm.toCoefficients` ou em `useHareSynth` no editor
não vê nada — o contrato (unidades, faixas, invariantes, pré-condições) vive apenas na
prosa externa ou na cabeça de quem escreveu.

Forças em jogo:

- O TypeScript já expressa **tipos** (assinaturas, formatos). Comentar o tipo de novo é
  ruído; o que falta é o **não-óbvio**: unidade de um `number`, faixa válida, invariante,
  ordem de chamada, efeito colateral.
- A matemática de síntese (`classes/`) e a orquestração de áudio (`hooks/`) têm contratos
  sutis (ex.: `phase` é fração de ciclo, não radiano; `play` é ignorado se já houver nota
  ativa; o `PeriodicWave` normaliza o pico para ~1).
- Sem uma convenção única, cada arquivo comentaria de um jeito — o oposto do princípio
  "consistência com o existente vence preferência pessoal".
- Excesso de docstring (em `private`, helpers triviais) envelhece e mente; é pior que a
  ausência.

## Decisão

Adotamos **TSDoc** como padrão de documentação da **API pública do núcleo**.

**Onde é obrigatório** — todo símbolo *exportado* que cruza fronteira de módulo:
`classes/` (classe + métodos públicos), `hooks/` (o `useX`), `utils/` (funções exportadas).

**Onde é proibido (ruído)** — métodos `private`, helpers triviais, getters óbvios, e
qualquer comentário que apenas repita o tipo ou o nome do símbolo. Em `types/*.d.ts`,
comenta-se só o campo não-óbvio.

**Tags permitidas (whitelist):** `@param`, `@returns`, `@remarks`, `@throws`,
`@example`, `@see`, `@deprecated`. Fora dessas, escreva prosa.

**Regra de ouro dos `@param`:** só documente o parâmetro se acrescentar **unidade, faixa
ou invariante** que o tipo não carrega. Se não há o que acrescentar, **omita**.

**Estilo:** em português, sem ponto e vírgula, espelhando o `.prettierrc` e a convenção
"nomes descritivos em português; clareza acima de esperteza".

Exemplo canônico (`HareOm.toCoefficients`):

```ts
/**
 * Compila o recipe nos coeficientes de Fourier do `PeriodicWave`.
 *
 * @returns `real` (cossenos) e `imag` (senos), ambos com `maxHarmonics + 1` posições;
 *   índice 0 é o DC (sempre 0) e o índice `n` é o harmônico `n` da fundamental
 * @remarks Núcleo puro, sem Web Audio. Convenção: uma componente
 *   `A·sin(2π n t + θ)` entra como `real[n] += A·sin θ` e `imag[n] += A·cos θ`.
 */
toCoefficients(): { real: Float32Array; imag: Float32Array } {
```

## Consequências

**Positivas**

- O contrato (unidade, faixa, pré-condição) fica visível no hover do editor, no ponto de
  uso — não só na documentação externa.
- Convenção única e enxuta: a whitelist de tags e a regra de ouro evitam tanto a anarquia
  quanto a verbosidade.
- Abre caminho (opcional, não decidido aqui) para `eslint-plugin-jsdoc` restrito a
  *exports* e para gerar um site de API com `TypeDoc` a partir das mesmas docstrings.

**Negativas / custos**

- Docstring é código que envelhece: precisa ser mantida junto com a assinatura, ou mente.
  Mitigado por restringi-la à API pública e ao não-óbvio.
- Aplicar e manter o padrão no núcleo é trabalho incremental, arquivo a arquivo.

## Alternativas consideradas

- **Só documentação externa (status quo)** — mantém `docs/` como única fonte, mas deixa o
  contrato invisível no editor e propenso a divergir do código. Rejeitado.
- **JSDoc "clássico" com tipos nas tags** (`@param {number}`) — redundante com o
  TypeScript e propenso a divergir do tipo real. Rejeitado em favor de TSDoc, que assume
  os tipos do TS e documenta só a semântica.
