declare type PianoKeyProps = {
  id: number
  /** Frequência da nota, em Hz */
  frequency: number
  natural?: boolean
  flat?: boolean
  /** Modo de exibição de informação na tecla (ver `useInfoBtn`, 0–3) */
  infonum: number
  /** Dispara a nota `frequency` (Hz) marcando `keyid` em `keyboardkeys.playing`. */
  play: (frequency: number, keyid: number) => void
  /** Solta e descarta a voz do `keyid`. */
  stop: (keyid: number) => void
}

declare type PianoKeyboardProps = {
  scale: string
  /** Frequências (Hz) das notas naturais */
  naturalfrequencies: number[]
  /** Frequências (Hz) das notas acidentais; uma lista por posição natural */
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
