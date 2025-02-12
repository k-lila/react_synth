declare type PianoKeyProps = {
  id: number
  frequency: number
  wavedata: number[]
  audioctx: AudioContext
}

declare type PianoKeyboardProps = {
  audioctx: AudioContext
  naturalkeys: number[][]
  naturalfrequencies: number[]
}

declare type BasicSliderProps = {
  defaultgain: number
  min: number
  max: number
  horizontal?: boolean
  onGainChange?: (gain: number) => void
}

declare type WaveEditorHeaderProps = {
  id: number
  wave: WaveRecipe
  waveExplosion: boolean
  setWaveExplosion: React.Dispatch<React.SetStateAction<boolean>>
}

declare type HarmonicControlerProps = {
  id: number
  wave: WaveRecipe
  selected: number
  setSelected: React.Dispatch<React.SetStateAction<number>>
}
