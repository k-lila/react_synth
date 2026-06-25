---
description: Refina uma feature EXISTENTE (otimiza e/ou simplifica) sem alterar comportamento, via PM -> Techlead -> Senso Crítico + QA, com gate humano de escopo e loop de revisão
---

Você é o **maestro** desta orquestração. Coordene o **refinamento** da feature/área
descrita em "$ARGUMENTS" usando os subagentes do projeto, nesta ordem. Refinar =
otimizar (custo de CPU/memória) e/ou simplificar (complexidade, acoplamento,
duplicação, linhas) **uma feature que JÁ existe**, sem mudar o comportamento
observável. Você distribui o trabalho e junta os resultados; os subagentes rodam em
contexto isolado e devolvem apenas o artefato final de cada etapa.

Diferença para `nova-feature`: aqui **não há feature nova**. O comportamento atual é
o contrato a preservar; o diff nasce de você, não de um requisito.

## Fluxo

1. **Caracterização & oportunidades.** Invoque o subagente `product-manager` com a
   área em "$ARGUMENTS". **No prompt, deixe explícito:** isto é um *refinamento de
   feature existente*, não uma feature nova — ele NÃO deve inventar comportamento.
   Peça que produza:
   - O **comportamento atual observável** da feature como critérios `AC-NN` — estes
     são o **contrato de não-regressão** (tudo deve permanecer idêntico após o refino).
   - As **oportunidades de melhoria** (complexidade, acoplamento, duplicação, custo)
     — **sem** propor solução técnica (isso é do Techlead).
   - Os **riscos de regressão**, com ênfase nas invariantes de áudio.

   Apresente o resultado ao usuário e **AGUARDE aprovação humana dos alvos** de
   melhoria a perseguir antes de prosseguir. Resolva aqui qualquer ambiguidade.

2. **Refinamento.** Com os alvos aprovados, invoque o subagente `techlead`. **No
   prompt, deixe explícito o override:** "refatorar/otimizar **É** o objetivo desta
   tarefa — a proibição usual de 'refator oportunista' do `CLAUDE.md` **não se
   aplica DENTRO dos alvos aprovados**; FORA deles continua valendo. **Nenhuma**
   mudança de comportamento." Repasse os alvos aprovados **e** os `AC-NN` na íntegra.
   O Techlead deve:
   - Apresentar o **plano primeiro** (razão · arquivos a modificar · resumo
     antes→depois) e aguardar a confirmação que você repassar.
   - Para cada mudança, declarar o **eixo** (simplificação ou performance) e a
     **justificativa concreta** (ex.: −N linhas, removeu acoplamento X, evita
     recomputo em `useSynth`), e qual `AC-NN` o comportamento preservado corresponde.
   - Rodar `npm run build` e `npm run lint` antes de entregar.
   - Se não houver melhoria real a fazer dentro do escopo, é legítimo concluir
     **"nada a refinar"** — não invente churn.

3. **Revisão (em paralelo).** Sobre o diff resultante, invoque ao mesmo tempo:
   - `senso-critico` — recebe o diff + os `AC-NN` + os alvos aprovados. **No prompt,
     peça que verifique, além da auditoria padrão:** (a) comportamento preservado
     (invariantes de áudio, fluxo unidirecional `recipe → classes → hooks → UI`);
     (b) cada mudança é **melhoria líquida real**, não churn lateral nem complexidade
     só deslocada; (c) o escopo não passou dos alvos aprovados; (d) a qualidade dos
     testes de não-regressão escritos pelo `qa-tester` (cobrem mesmo o `AC-NN`, sem
     asserção tautológica).
   - `qa-tester` — recebe o diff + os `AC-NN`. Quando a área refinada recai no núcleo
     testável (`classes`/`utils`/`store`), **garante/escreve testes que fixam o
     contrato de não-regressão** (`AC-NN`) e os roda como prova objetiva de que nada
     mudou; idealmente esses testes já passavam antes do refino e seguem passando
     depois. Roda `npm run test` + build + lint e mapeia cada `AC-NN` → status. O que
     não for verificável por ferramenta (igualdade de timbre/áudio) sai marcado como
     `⚠️ não verificável`, com o motivo — nunca presumir ok.

4. **Loop.** Volte ao `techlead` quando: `qa-tester` retornar REPROVADO, ou
   `senso-critico` retornar REPROVADO ou APROVADO COM RESSALVAS **bloqueantes**.
   `APROVADO COM RESSALVAS` apenas não-bloqueantes não dispara nova rodada. Passe a
   lista consolidada de correções e instrua-o a **iterar sobre o existente**, não
   recomeçar. Repita a etapa 3.

5. **Encerramento.** Pare quando ambos aprovarem. Apresente ao usuário um resumo: o
   que foi refinado, arquivos tocados, o **ganho declarado por mudança** (eixo +
   justificativa), e o veredito final de cada revisor.

## Regras

- Não pule a aprovação humana dos alvos na etapa 1.
- Não implemente nada você mesmo (maestro): o refino é sempre do `techlead`.
- Refator é o objetivo, mas **apenas dentro dos alvos aprovados**; zero mudança de
  comportamento observável.
- Respeite o `CLAUDE.md` do projeto (mudança mínima, sem arquivos extras fora do
  escopo aprovado).
- Se o refino crescer além dos alvos aprovados, pare e reconfirme com o usuário.

## Quando usar (vs. ferramentas internas)

`/simplify` e `/code-review` atuam sobre um **diff já existente**. Use
`/refinar-feature` quando parte de uma **feature existente sem diff**: ele gera o
diff através do pipeline com gate de escopo e revisão por pares (`senso-critico` +
`qa-tester`). São complementares.
