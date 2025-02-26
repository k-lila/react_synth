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

  const notesA = ['Dó', 'Ré', 'Mi', 'Fá', 'Sol', 'Lá', 'Sí']
  const notesB = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

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
            {props.infonum === 3
              ? Math.floor((Math.ceil(props.frequency * 1000) / 1000) * 100) /
                100
              : null}
            <br />
            {props.infonum === 0
              ? null
              : props.infonum === 1
                ? `${getKeyboardKey(keyboardkey ? keyboardkey.keycode : '')}`
                : props.infonum === 2
                  ? notesA[props.id > 6 ? props.id - 7 : props.id]
                  : notesB[props.id > 6 ? props.id - 7 : props.id]}
          </div>
        </span>
      </button>
    </PianoKeyStyled>
  )
}

export default PianoKey
