import useQWERTY from './useQwerty'
import { useDispatch, useSelector } from 'react-redux'
import { setKeyByCode } from '../store/reducers/keyboardkeys'
import { RootReducer } from '../store'

/**
 * Liga o teclado físico QWERTY ao estado das teclas no Redux.
 *
 * @remarks Efeito puro (não retorna nada). Casa o `event.code` com as teclas em
 *   `keyboardkeys` e ignora auto-repeat (só dispara quando a tecla muda de estado).
 */
function useKeyboardQWERTY() {
  const dispatch = useDispatch()
  const keyboardkeys = useSelector((state: RootReducer) => state.keyboardkeys)

  const handleKeyDown = (key: string) => {
    const pressed = [
      ...keyboardkeys.naturalkeys,
      ...keyboardkeys.flatkeys,
      ...keyboardkeys.sharpkeys
    ].find((f) => f.keycode === key)?.pressed
    if (!pressed && pressed !== undefined) {
      dispatch(setKeyByCode({ keycode: key, pressed: true }))
    }
  }

  const handleKeyUp = (key: string) => {
    dispatch(setKeyByCode({ keycode: key, pressed: false }))
  }
  useQWERTY(handleKeyDown, handleKeyUp)
}

export default useKeyboardQWERTY
