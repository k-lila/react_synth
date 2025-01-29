import { ReactNode } from 'react'

declare type InterfaceProps = {
  children: ReactNode
}

declare type PianoKeyProps = {
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
