declare type WaveRecipe = {
  type: string
  /** Amplitude global da onda (0–1) */
  gain: number
  /** Deslocamento de fase global, em frações de ciclo (0–1; 0.5 = meio ciclo) */
  phase: number
  /** Amplitude de cada parcial; paralelo a `phases` (índice `i` = harmônico `(i+1)×fund`) */
  amplitudes: number[]
  /** Fase de cada parcial em frações de ciclo (0–1); paralelo a `amplitudes` */
  phases: number[]
}

declare type SynthRecipe = {
  /** Frequência de referência, em Hz */
  pitch: number
  /** Ganho global aplicado na reprodução (0–1) */
  gain: number
  scale: string
  /** `[início, fim]` inclusivo das oitavas pré-renderizadas */
  octaves: number[]
  waves: WaveRecipe[]
}
