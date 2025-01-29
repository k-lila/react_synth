declare type WaveRecipe = {
  type: string
  amplitudes: number[]
}

declare type SynthRecipe = {
  pitch: number
  gain: number
  scale: string
  waves: WaveRecipe[]
}
