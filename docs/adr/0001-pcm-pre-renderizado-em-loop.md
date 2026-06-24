# ADR-0001: PCM pré-renderizado em loop por nota, não streaming quadro a quadro

## Status

Aceito

## Contexto

O `harenator` é um sintetizador aditivo: o som é definido pela slice `recipe`
(`pitch`, `gain`, `scale`, `waves[]` com amplitudes/fases dos parciais). A partir
dessa receita, cada tecla tocável precisa virar áudio audível pela Web Audio API.

Havia duas formas de produzir o áudio:

1. **Streaming / síntese em tempo real** — gerar as amostras continuamente
   enquanto a nota soa (ex.: `OscillatorNode`, `AudioWorklet` ou um
   `ScriptProcessor` calculando a soma de Fourier quadro a quadro).
2. **Pré-renderização** — quando a receita muda, sintetizar uma vez um buffer PCM
   de ciclos inteiros por nota e, ao tocar, apenas repetir esse buffer em loop.

Forças em jogo:

- A síntese é uma soma de parciais (`classes/fundamentalwave.ts`) — cara o
  suficiente para não querer recalculá-la a cada bloco de áudio, mas o resultado
  é **estático** enquanto a `recipe` não muda.
- O som de uma tecla é **periódico**: um buffer de ciclos inteiros pode tocar em
  loop indefinidamente sem perda de fidelidade.
- O conjunto de notas é pequeno e conhecido de antemão (oitavas 3–4, naturais +
  sustenidos/bemóis), então pré-computar tudo de uma vez é viável.
- Emendar um buffer em loop produz cliques se as bordas não casarem — é preciso
  garantir ciclos inteiros no buffer.

## Decisão

Adotamos a **pré-renderização**.

Quando `recipe` muda, `hooks/useSynth.ts` (via `useMemo`) re-renderiza **todas** as
notas tocáveis das oitavas 3–4 num passo só: para cada frequência,
`useMinBufferSizeMap` calcula um tamanho de buffer que contém ciclos inteiros,
`generateNote` soma os parciais (`FundamentalWave.getWave`) e normaliza o PCM
resultante pelo pico. A saída (`naturalKeys` / `unnaturalKeys`) é consumida pela UI.

Tocar uma tecla (`hooks/usePlayStop.ts`) **não sintetiza nada**: copia o PCM para um
`AudioBuffer`, marca `source.loop = true` e repete o buffer, aplicando apenas um
envelope de attack/release por rampa linear no `GainNode`. O fluxo permanece
unidirecional: `recipe → classes → hooks → UI`.

## Consequências

**Positivas**

- Tocar é barato e de baixa latência: é só dar `start()` num buffer já pronto.
- Loop sem cliques, garantido por buffers de ciclos inteiros
  (`FundamentalWave.setMinBufferSize`).
- A matemática de síntese fica isolada em `classes/` e roda fora do caminho de
  reprodução — testável de forma determinística (núcleo puro, Vitest + fast-check).
- Sem `AudioWorklet`/`ScriptProcessor`: menos superfície de API e nada de lógica
  de áudio rodando em thread de tempo real.

**Negativas / custos**

- Toda mudança na `recipe` recalcula o conjunto inteiro de notas — pico de CPU ao
  editar a onda, daí o `useMemo` em `useSynth` ser obrigatório aqui (otimização
  medida, não por reflexo).
- O custo de memória cresce com o nº de notas pré-renderizadas; ampliar o range de
  oitavas multiplica o trabalho do loop em `useSynth`.
- O timbre é fixo durante a nota: não há modulação contínua em tempo real (ex.:
  varrer um filtro ou a fase enquanto a tecla soa) sem repensar este modelo.
- Há um acoplamento posicional implícito: o loop de oitavas em `useSynth`
  (`for i = 3; i < 5`) precisa ficar em sincronia com `useMinBufferSizeMap`.

## Alternativas consideradas

- **`OscillatorNode` nativo** — barato, mas não soma parciais arbitrários com
  fases independentes; não expressa a síntese aditiva do projeto.
- **`AudioWorklet` sintetizando em tempo real** — permitiria modulação contínua,
  mas reintroduz custo de síntese no caminho de áudio, complexidade de thread e
  dificulta o teste determinístico do núcleo. Rejeitado enquanto o timbre for
  estático por nota.
