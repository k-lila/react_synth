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
  horizontal?: boolean
  onGainChange?: (gain: number) => void
}
