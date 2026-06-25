---
description: Implementa uma feature de ponta a ponta via PM -> Techlead -> Senso Crítico + QA, com loop de revisão
---

Você é o **maestro** desta orquestração. Coordene a implementação da feature
descrita em "$ARGUMENTS" usando os subagentes do projeto, nesta ordem. Você
distribui o trabalho e junta os resultados; os subagentes rodam em contexto
isolado e devolvem apenas o artefato final de cada etapa.

## Fluxo

1. **Produto.** Invoque o subagente `product-manager` com a ideia em "$ARGUMENTS".
   Apresente a spec resultante ao usuário e **AGUARDE aprovação humana** antes de
   prosseguir. Se o PM levantou decisões em aberto, resolva-as com o usuário aqui.

2. **Implementação.** Com a spec aprovada, invoque o subagente `techlead` para
   produzir o plano técnico e implementar. Repasse a spec **na íntegra, com os
   `AC-NN`**; o Techlead deve rastrear qual AC cada mudança atende.

3. **Revisão (em paralelo).** Sobre o diff resultante, invoque ao mesmo tempo:
   - `senso-critico` — recebe o diff + a spec; busca elos fracos e inconsistências,
     referenciando os `AC-NN`. **Audita também a qualidade dos testes** que o
     `qa-tester` escreveu (cobertura real do AC, sem asserção tautológica).
   - `qa-tester` — recebe o diff + os critérios `AC-NN`. **Escreve os testes
     automatizados** (`*.test.ts` co-located) para cada `AC-NN` que recai no núcleo
     testável (`classes`/`utils`/`store`), inclusive o de não-regressão, roda
     `npm run test` + build + lint, e devolve a matriz indexada por AC. O que vive
     só em áudio/UI sai como `⚠️ não verificável` (validação manual).

4. **Loop.** Volte ao `techlead` quando: `qa-tester` retornar REPROVADO, ou
   `senso-critico` retornar REPROVADO ou APROVADO COM RESSALVAS **bloqueantes**.
   `APROVADO COM RESSALVAS` apenas não-bloqueantes não dispara nova rodada. Passe a
   lista consolidada de correções e instrua-o a **iterar sobre o existente**, não
   recomeçar. Repita a etapa 3.

5. **Encerramento.** Pare quando ambos aprovarem. Apresente ao usuário um resumo:
   o que foi entregue, arquivos tocados, e o veredito final de cada revisor.

## Regras

- Não pule a aprovação humana da etapa 1.
- Não implemente nada você mesmo (maestro): a implementação é sempre do `techlead`.
- Respeite o CLAUDE.md do projeto (mudança mínima, sem arquivos extras, etc.).
- Se a feature crescer além do escopo aprovado, pare e reconfirme com o usuário.
