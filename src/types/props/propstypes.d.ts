import { ReactNode } from 'react'

declare type InterfaceProps = {
  children: ReactNode
}

declare type PianoKeyProps = {
  pitch: number
  audioctx: AudioContext
}
