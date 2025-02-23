import { useDispatch, useSelector } from 'react-redux'
import usePlayStop from '../../hooks/usePlayStop'
import { PianoKeyStyled } from './styles'
import { RootReducer } from '../../store'
import { useEffect } from 'react'
import { setKeyById } from '../../store/reducers/keyboardkeys'
import getKeyboardKey from '../../utils/getkeyboardkey'

const PianoKey = ({ ...props }: PianoKeyProps) => {
  const dispatch = useDispatch()
  const { play, stop } = usePlayStop(props.wavedata, props.audioctx)
  const keyboardkey = useSelector((state: RootReducer) => state.keyboardkeys)
    .naturalkeys[props.id]

  const handleKeyDown = () => {
    if (!keyboardkey.pressed && keyboardkey.pressed != undefined) {
      dispatch(setKeyById({ keyid: props.id, pressed: true }))
    }
  }
  const handleKeyUp = () => {
    dispatch(setKeyById({ keyid: props.id, pressed: false }))
  }

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
        onMouseDown={handleKeyDown}
        onMouseUp={handleKeyUp}
        onMouseLeave={handleKeyUp}
        onTouchStart={handleKeyDown}
        onTouchEnd={handleKeyUp}
        className={keyboardkey.pressed ? '--bg-darkgray' : ''}
      >
        <span>
          <div>
            {Math.floor((Math.ceil(props.frequency * 1000) / 1000) * 100) / 100}
            <br />
            {`(${getKeyboardKey(keyboardkey ? keyboardkey.keycode : '')})`}
          </div>
        </span>
      </button>
    </PianoKeyStyled>
  )
}

export default PianoKey
