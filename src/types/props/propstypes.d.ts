import { ReactNode } from 'react'

declare type InterfaceProps = {
  children: ReactNode
}

declare type PianoKeyProps = {
  pitch: number
  audioctx: AudioContext
}

declare type BasicSliderProps = {
  defaultgain: number
  horizontal?: boolean
  onGainChange?: (gain: number) => void
}
