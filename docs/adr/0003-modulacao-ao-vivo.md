# ADR-0003: Modulação de timbre e volume ao vivo (propagação às vozes soando)

## Status

Aceito — **Complementa [ADR-0001](0001-sintese-por-oscilador-nativo.md)** (não o substitui:
o motor de oscilador nativo permanece).

## Contexto

O [ADR-0001](0001-sintese-por-oscilador-nativo.md) adotou o oscilador nativo. No desenho
mais simples, uma voz guarda o `PeriodicWave` do disparo, então **trocar a `recipe` não
alteraria uma nota já soando** — o novo timbre valeria só do próximo `play`. Para um
sintetizador tocável, porém, mexer num slider **enquanto a nota soa** e ouvir o efeito é
comportamento esperado, não um luxo.

Dois fatos do código orientam a solução:

- O `useHareSynth` **já recompila** o `PeriodicWave` (`useMemo` em `recipe.waves`) a cada
  mudança da receita; o que falta é **propagar** essa onda para as vozes ativas.
- Esse caminho já dispara `dispatch` + recompile **por evento de mouse** ao arrastar um
  slider (`useWaveEditorState`, `KeyboardVolume`) — uma cadência que o app já tolera.

A premissa habilitadora é que `OscillatorNode.setPeriodicWave()` pode ser chamado com o
oscilador **em execução**, trocando a wavetable de forma contínua em fase, e que um
`GainNode` pode ser automado ao vivo por rampa.

## Decisão

Propagar mudanças de `recipe.waves` (timbre) e `recipe.gain` (volume) às vozes **já
soando**.

- `HareSom.setWave(wave)` aplica o novo `PeriodicWave` no oscilador ativo
  (`setPeriodicWave`, contínuo em fase); se nada estiver tocando, vale do próximo `play`.
- `HareSom.setGain(gain)` faz uma rampa curta (~0.02 s) do valor corrente ao novo ganho no
  `GainNode` da voz (anti-clique); se nada estiver tocando, só atualiza o alvo.
- O `useHareSynth` ganha dois efeitos: um propaga o `wave` recompilado e outro o
  `gain * 0.5` a **todas** as vozes do pool.

**Cadência do `dispatch`:** mantém-se o `dispatch` **síncrono por evento de mouse** — a
mesma cadência de antes desta feature, já tolerada pelo app. Coalescer as atualizações em
≤1×/frame (`requestAnimationFrame`) foi avaliado e **fica como otimização futura**: uma
primeira tentativa quebrou a atualização do store (e, com ela, som e gráfico), então não se
adota agora; a reintrodução exige validação no navegador.

**Normalização:** mantém-se a normalização de pico padrão do `createPeriodicWave`
([ADR-0001](0001-sintese-por-oscilador-nativo.md)). Aceita-se a possível leve "respiração"
de loudness ao variar harmônicos; refinar com `disableNormalization` + escala própria fica
como passo futuro, decidido por ouvido.

## Consequências

**Positivas**

- A nota soando reflete timbre e volume em tempo real — UX esperada de um sintetizador.
- Mudança localizada, dentro da rota do oscilador nativo; sem novo motor de áudio.

**Negativas / custos**

- A troca de wavetable é contínua em fase, mas dá um salto **espectral** discreto entre
  frames; a normalização de pico pode "respirar" ao variar harmônicos.
- O caminho de áudio passa a depender de `setPeriodicWave`/automação de `GainNode` em nós
  vivos.
- O `dispatch` segue por evento de mouse (recompila o `PeriodicWave` a cada um); a
  coalescência por frame está pendente (ver Decisão).

## Alternativas consideradas

- **Transitório puro (bypass do Redux, commit no `mouseup`):** zero `dispatch` durante o
  arraste, mas o plot/visualização (que lê do Redux) congelaria sem um caminho duplo —
  preterido pela complexidade de reconciliação.
- **Crossfade entre dois osciladores (morph por `AudioParam`):** suave e barato, mas só
  modela um eixo A→B; não generaliza para qualquer slider de harmônico arbitrário.
- **`AudioWorklet` (síntese por amostra):** modulação perfeita de espectro arbitrário, mas
  reintroduz custo de síntese no thread de áudio e complexidade de thread — o que a rota do
  oscilador nativo evitou. Mantido como possibilidade futura caso se exija modulação por
  amostra.
