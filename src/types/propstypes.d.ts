declare type PianoKeyProps = {
  id: number
  /** Frequência da nota, em Hz */
  frequency: number
  /** PCM de um período, normalizado em ±1 */
  wavedata: number[]
  audioctx: AudioContext
  natural?: boolean
  flat?: boolean
  /** Modo de exibição de informação na tecla (ver `useInfoBtn`, 0–3) */
  infonum: number
}

declare type PianoKeyboardProps = {
  scale: string
  audioctx: AudioContext
  /** PCM das notas naturais; paralelo por índice a `naturalfrequencies` */
  naturalkeys: number[][]
  /** PCM das notas acidentais; paralelo por índice a `unnaturalfrequencies` */
  unnaturalkeys: number[][][]
  /** Frequências (Hz) das notas naturais; paralelo a `naturalkeys` */
  naturalfrequencies: number[]
  /** Frequências (Hz) das notas acidentais; paralelo a `unnaturalkeys` */
  unnaturalfrequencies: number[][]
}

declare type BasicSliderProps = {
  /** Valor inicial, dentro da faixa definida por `min`/`max` */
  defaultgain: number
  min: number
  max: number
  horizontal?: boolean
  onGainChange?: (gain: number) => void
}

declare type WaveEditorHeaderProps = {
  id: number
  wave: WaveRecipe
  /** Quando `true`, exibe os parciais isolados (ver `useFundamentalWaveView`) */
  waveExplosion: boolean
  setWaveExplosion: React.Dispatch<React.SetStateAction<boolean>>
}

declare type HarmonicControlerProps = {
  id: number
  wave: WaveRecipe
  /** Índice do parcial selecionado em `wave.amplitudes`; `-1` = onda global */
  selected: number
  setSelected: React.Dispatch<React.SetStateAction<number>>
}

declare type SVGContainerProps = {
  src: string
  alt: string
}
