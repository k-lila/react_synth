declare type WaveRecipe = {
  type: string
  gain: number
  amplitudes: number[]
}

declare type SynthRecipe = {
  pitch: number
  gain: number
  scale: string
  waves: WaveRecipe[]
}
