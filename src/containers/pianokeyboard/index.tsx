import Keyboard from '../../classes/keyboard'
import KeyboardVolume from '../../components/keyboardvolume'
import PianoKey from '../../components/pianokey'
import useWindowSize from '../../hooks/usewindowssize'
import { KeyboardContainer, PianoKeyboardStyled } from './styles'

const PianoKeyboard = () => {
  const keyboard_scales = new Keyboard(432.1)
  const scale = keyboard_scales.keyboard.chromatic[4]

  const { windowsize } = useWindowSize()
  let keyboardSize
  if (windowsize.width < 768) {
    keyboardSize = 5
  } else if (windowsize.width >= 1024) {
    keyboardSize = 12
  } else {
    keyboardSize = 8
  }
  const keyboard = []

  for (let i = 0; i < keyboardSize; i++) {
    keyboard.push(<PianoKey key={i} pitch={scale[i]} />)
  }

  return (
    <PianoKeyboardStyled>
      <KeyboardVolume />
      <KeyboardContainer>{keyboard}</KeyboardContainer>
    </PianoKeyboardStyled>
  )
}

export default PianoKeyboard
