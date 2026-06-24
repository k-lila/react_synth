# Architecture Decision Records (ADRs)

Registro das **decisões arquiteturais significativas** do `harenator`: o *porquê*
datado de cada escolha estrutural, com o contexto da época e os trade-offs aceitos.

## Como funciona

- Um ADR = um arquivo `NNNN-titulo-em-kebab-case.md`, numerado em sequência.
- ADRs são **imutáveis**. Não se edita um ADR aceito: para reverter ou substituir
  uma decisão, cria-se um **novo** ADR com status `Substitui ADR-XXXX`, e o antigo
  passa a `Substituído por ADR-YYYY`. A trilha histórica é preservada, não reescrita.
- Documentos vivos (`CLAUDE.md`, `docs/*.md`) **apontam** para os ADRs; nunca
  duplicam o raciocínio deles. O doc vivo diz *o que é hoje*; o ADR, *por quê*.
- Use um ADR para decisões duradouras, difíceis de reverter ou cuja motivação não
  é óbvia pelo código (stack, padrões transversais, trade-offs estruturais). Não
  registre o trivial que o próprio código já explica.

## Modelo

Cada ADR segue o formato Nygard: **Status · Contexto · Decisão · Consequências**
(e, quando útil, *Alternativas consideradas*). Copie um ADR existente como base.

## Índice

| ADR | Título | Status |
|-----|--------|--------|
| [0001](0001-pcm-pre-renderizado-em-loop.md) | PCM pré-renderizado em loop por nota, não streaming quadro a quadro | Aceito |
