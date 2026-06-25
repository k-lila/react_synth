# ADR-0004: Modulação de timbre e volume ao vivo (propagação às vozes soando)

## Status

Aceito — **Complementa [ADR-0003](0003-sintese-por-oscilador-nativo.md)** (não o substitui:
o motor de oscilador nativo permanece). Reverte de propósito uma **consequência** registrada
no ADR-0003.

## Contexto

O [ADR-0003](0003-sintese-por-oscilador-nativo.md) adotou o oscilador nativo e registrou como
consequência negativa aceita: *"trocar a `recipe` não altera uma nota já soando (a voz guarda
o `PeriodicWave` do disparo); o novo timbre vale do próximo `play`"*. Para um sintetizador
tocável, porém, mexer num slider **enquanto a nota soa** e ouvir o efeito é comportamento
esperado — não um luxo.

Dois fatos do código orientam a solução:

- O `useHareSynth` **já recompila** o `PeriodicWave` (`useMemo` em `recipe.waves`) a cada
  mudança da receita; o que faltava era **propagar** essa onda para as vozes ativas
  (`HareSom.setWave` só valia no próximo `play`).
- Esse caminho já dispara `dispatch` + recompile **por evento de mouse** ao arrastar um
  slider (`useWaveEditorState`, `KeyboardVolume`) — uma tempestade que existia silenciosa
  porque nada a jusante reagia em tempo real.

A premissa habilitadora é que `OscillatorNode.setPeriodicWave()` pode ser chamado com o
oscilador **em execução**, trocando a wavetable de forma contínua em fase.

## Decisão

Propagar mudanças de `recipe.waves` (timbre) e `recipe.gain` (volume) às vozes **já soando**,
e coalescer o fluxo de atualização para não onerar o caminho de áudio.

- **Estratégia 1 — propagação ao vivo:** `HareSom.setWave` aplica o novo `PeriodicWave` no
  oscilador ativo; novo `HareSom.setGain` ajusta o `GainNode` da voz com rampa curta
  (anti-clique). O `useHareSynth` ganha dois efeitos que propagam o `wave` recompilado e o
  `gain * 0.5` a todas as vozes do pool.
- **Estratégia 2 — coalescência por frame: adiada.** A intenção era agrupar o `dispatch` ao
  Redux em ≤1×/frame (`requestAnimationFrame`), mas a primeira tentativa quebrou a atualização
  do store (logo, do som e do gráfico). Mantém-se por ora o `dispatch` **síncrono** por evento
  — a mesma cadência de antes desta feature, já tolerada pelo app. A coalescência fica como
  otimização futura, a reintroduzir com validação no navegador.

**Normalização:** mantém-se a normalização de pico padrão do `createPeriodicWave` (ADR-0003).
Aceita-se a possível leve "respiração" de loudness ao variar harmônicos; refinar com
`disableNormalization` + escala própria fica como passo futuro, decidido por ouvido.

## Consequências

**Positivas**
- A nota soando reflete timbre e volume em tempo real — UX esperada de um sintetizador.
- Mudança localizada, dentro da rota oscilador; sem novo motor de áudio.

**Negativas / custos**
- A troca de wavetable é contínua em fase, mas dá um salto **espectral** discreto entre
  frames — a validar por ouvido (cliques/zipper); a normalização de pico pode "respirar".
- Caminho de áudio agora depende de `setPeriodicWave`/automação de `GainNode` em nós vivos.
- O `dispatch` segue por evento de mouse (recompila o `PeriodicWave` a cada um); a coalescência
  por frame foi adiada (ver Decisão). Cadência idêntica à de antes desta feature.

## Alternativas consideradas

- **Transitório puro (bypass do Redux, commit no `mouseup`):** zero `dispatch` durante o
  arraste, mas o plot/visualização (que lê do Redux) congelaria sem um caminho duplo —
  preterido pela complexidade de reconciliação. Era a alternativa à coalescência em rAF (esta
  adiada por ter quebrado a atualização do store na primeira tentativa).
- **Crossfade entre dois osciladores (morph por `AudioParam`):** suave e barato, mas só
  modela um eixo A→B; não generaliza para qualquer slider de harmônico arbitrário.
- **`AudioWorklet` (síntese por amostra):** modulação perfeita de espectro arbitrário, mas
  reintroduz custo de síntese no thread de áudio e complexidade de thread — o que o ADR-0003
  evitou. Mantido como possibilidade futura caso se exija modulação por amostra.
