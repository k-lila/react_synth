import { useDispatch, useSelector } from 'react-redux'
import { PianoBlackKeyStyled } from './styles'
import { RootReducer } from '../../store'
import { setChromaticKeyById } from '../../store/reducers/keyboardkeys'
import { useEffect } from 'react'
import usePlayStop from '../../hooks/usePlayStop'
import getKeyboardKey from '../../utils/getkeyboardkey'

const PianoBlackKey = ({ ...props }: PianoKeyProps) => {
  const dispatch = useDispatch()
  const { play, stop } = usePlayStop(props.wavedata, props.audioctx)
  const keyboardkey = useSelector(
    (state: RootReducer) => state.keyboardkeys
  ).sharpkeys.find((f) => f.id === props.id)

  const handleKeyDown = () => {
    if (!keyboardkey?.pressed && keyboardkey?.pressed != undefined) {
      dispatch(setChromaticKeyById({ keyid: props.id, pressed: true }))
    }
  }
  const handleKeyUp = () => {
    dispatch(setChromaticKeyById({ keyid: props.id, pressed: false }))
  }

  useEffect(() => {
    if (keyboardkey?.pressed) {
      play()
    } else {
      stop()
    }
  }, [keyboardkey?.pressed, play, stop, keyboardkey])

  return (
    <PianoBlackKeyStyled>
      <button
        onMouseDown={handleKeyDown}
        onMouseUp={handleKeyUp}
        onMouseLeave={handleKeyUp}
        onTouchStart={handleKeyDown}
        onTouchEnd={handleKeyUp}
        className={keyboardkey?.pressed ? '--bg-blackkeypressed' : ''}
      >
        <span>
          {`${Math.floor((Math.ceil(props.frequency * 1000) / 1000) * 100) / 100}`
            .split('')
            .map((char, i) => (
              <div key={i}>{char}</div>
            ))}
          <div>{`(${getKeyboardKey(keyboardkey ? keyboardkey.keycode : '')})`}</div>
        </span>
      </button>
    </PianoBlackKeyStyled>
  )
}

export default PianoBlackKey
