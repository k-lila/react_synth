import FundamentalWave from '../../classes/fundamentalwave'
import usePlayStop from '../../hooks/usePlayStop'
import { PianoKeyProps } from '../../types/props/propstypes'
import { PianoKeyStyled } from './styles'

const PianoKey = ({ ...props }: PianoKeyProps) => {
  const fundamental = new FundamentalWave(props.audioctx.sampleRate)
  const intensities = [1, 0.5, 0.25, 0.1]
  fundamental.setIntensities(intensities)
  fundamental.createSinContext(props.pitch)
  // fundamental.createSquareContext(props.pitch)
  // fundamental.createSawThoothContext(props.pitch)
  const wave = fundamental.getWave()

  const { play, stop } = usePlayStop(wave, props.audioctx)

  return (
    <PianoKeyStyled>
      <button
        onMouseDown={play}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={play}
        onTouchEnd={stop}
      >
        {Math.floor(props.pitch)}
      </button>
    </PianoKeyStyled>
  )
}

export default PianoKey
