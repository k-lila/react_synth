---
description: Cria cobertura de testes automatizados para uma área existente (núcleo puro), via PM -> QA (escreve) -> Senso Crítico (audita) + suíte, com loop de revisão
---

Você é o **maestro** desta orquestração. Coordene a **criação de cobertura de
testes** para a área descrita em "$ARGUMENTS" usando os subagentes do projeto, nesta
ordem. Aqui **não há feature nova nem mudança de comportamento**: o objetivo é
adicionar testes automatizados que travam o comportamento atual. Você distribui o
trabalho e junta os resultados; os subagentes rodam em contexto isolado e devolvem
apenas o artefato final de cada etapa.

Escopo testável hoje: o **núcleo puro** — `classes/`, `utils/`, `store/reducers/`
(funções determinísticas, ambiente `node`). Os hooks de áudio ainda não são
testáveis (dependem de stub de Web Audio futuro); se "$ARGUMENTS" cair fora do
núcleo, diga isso ao usuário e proponha o recorte testável.

## Fluxo

1. **Alvo de cobertura.** Invoque o subagente `product-manager`. **No prompt, deixe
   explícito:** isto é *criação de cobertura de teste de área existente*, não feature
   nova — ele NÃO deve inventar comportamento. Peça que produza:
   - O **comportamento atual observável** da área como critérios `AC-NN` — o contrato
     que os testes vão travar (inclua o AC de não-regressão).
   - As **invariantes** relevantes (ex.: periodicidade da onda, normalização, ciclos
     inteiros do buffer, afinação das escalas) candidatas a teste de propriedade.
   - **Sem** solução técnica nem desenho dos testes (isso é do `qa-tester`).

   Apresente o resultado ao usuário e **AGUARDE aprovação humana** do alvo de
   cobertura antes de prosseguir. Resolva aqui qualquer ambiguidade.

2. **Escrita dos testes.** Com o alvo aprovado, invoque o subagente `qa-tester`.
   Repasse os `AC-NN` e as invariantes na íntegra. Ele deve escrever os `*.test.ts`
   co-located, usar exemplo **e** propriedade (fast-check) onde a matemática
   justificar, e rodar `npm run test`. Lembre-o: testes que **falhariam se o
   comportamento quebrasse**, nada de asserção tautológica.

3. **Revisão (em paralelo).** Sobre o diff de testes resultante, invoque ao mesmo
   tempo:
   - `senso-critico` — recebe o diff + os `AC-NN`. Peça que **audite a qualidade dos
     testes**: cobertura real de cada `AC-NN`, ausência de asserção tautológica,
     invariantes corretos, geradores fast-check que cobrem o domínio. Ele é o revisor
     imparcial dos testes que o `qa-tester` escreveu.
   - A **suíte objetiva** (`npm run test`) é o segundo gate — verde é obrigatório.

4. **Loop.** Volte ao **`qa-tester`** (aqui o autor dos testes é ele, não o
   `techlead`) quando: a suíte falhar, ou `senso-critico` retornar REPROVADO ou
   APROVADO COM RESSALVAS **bloqueantes**. Passe a lista consolidada e instrua-o a
   **iterar sobre os testes existentes**, não recomeçar. Repita a etapa 3.

5. **Encerramento.** Pare quando a suíte estiver verde e o `senso-critico` aprovar.
   Apresente ao usuário um resumo: arquivos de teste criados, `AC-NN`/invariantes
   cobertos, e o veredito final.

## Regras

- Não pule a aprovação humana do alvo na etapa 1.
- **Você só adiciona testes.** Se um teste revelar um **bug no fonte**, NÃO o corrija
  aqui: pare e reporte ao usuário — a correção é tarefa de `/nova-feature` (bugfix)
  ou `/refinar-feature`. Mudar código de produção está fora do escopo deste command.
- O `qa-tester` edita apenas `*.test.ts`; nenhum arquivo de produção é tocado.
- Respeite o `CLAUDE.md` (estilo, co-location, imports explícitos, sem `any`).

## Quando usar (vs. o pipeline de feature)

`/nova-feature` e `/refinar-feature` já incluem testes no Definition of Done para o
que elas mesmas produzem. Use `/cobrir-testes` para **cobrir código já existente que
nasceu sem teste** (dívida de cobertura), sem alterar comportamento.
