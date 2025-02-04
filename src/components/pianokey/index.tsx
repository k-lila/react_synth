import { useSelector } from 'react-redux'
import usePlayStop from '../../hooks/usePlayStop'
import { PianoKeyProps } from '../../types/propstypes'
import { PianoKeyStyled } from './styles'
import { RootReducer } from '../../store'
import { useEffect } from 'react'

const PianoKey = ({ ...props }: PianoKeyProps) => {
  const { play, stop } = usePlayStop(props.wavedata, props.audioctx)
  const keyboardkey = useSelector((state: RootReducer) => state.keyboardkeys)
    .naturalkeys[props.id]

  useEffect(() => {
    if (keyboardkey.pressed) {
      play()
    } else {
      stop()
    }
  }, [keyboardkey.pressed, play, stop, keyboardkey])

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
