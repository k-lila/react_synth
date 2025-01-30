import usePlayStop from '../../hooks/usePlayStop'
import { PianoKeyProps } from '../../types/propstypes'
import { PianoKeyStyled } from './styles'

const PianoKey = ({ ...props }: PianoKeyProps) => {
  const { play, stop } = usePlayStop(props.wavedata, props.audioctx)
  return (
    <PianoKeyStyled>
      <button
        onMouseDown={play}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={play}
        onTouchEnd={stop}
      >
        <span>
          {Math.floor((Math.ceil(props.frequency * 1000) / 1000) * 100) / 100}
        </span>
      </button>
    </PianoKeyStyled>
  )
}

export default PianoKey
