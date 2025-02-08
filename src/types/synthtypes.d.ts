declare type WaveRecipe = {
  type: string
  gain: number
  phase: number
  amplitudes: number[]
  phases: number[]
}

declare type SynthRecipe = {
  pitch: number
  gain: number
  scale: string
  waves: WaveRecipe[]
}
