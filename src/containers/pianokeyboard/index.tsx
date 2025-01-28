import Keyboard from '../../classes/keyboard'
import KeyboardVolume from '../../components/keyboardvolume'
import PianoKey from '../../components/pianokey'
import useWindowSize from '../../hooks/usewindowssize'
import { KeyboardContainer, PianoKeyboardStyled } from './styles'

const PianoKeyboard = () => {
  const audioCtx = new AudioContext()
  const keyboard_scales = new Keyboard(440)
  const scale = keyboard_scales.keyboard.chromatic
  const chromatic_sequence = [0, 2, 4, 5, 7, 9, 11]
  const { windowsize } = useWindowSize()
  let keyboardSize
  if (windowsize.width < 700) {
    keyboardSize = 5
  } else if (windowsize.width >= 1024) {
    keyboardSize = 12
  } else {
    keyboardSize = 8
  }
  const keyboard = []
  let counter = 0
  let octave = 0
  for (let i = 0; i < keyboardSize; i++) {
    keyboard.push(
      <PianoKey
        key={i}
        pitch={scale[4 + octave][chromatic_sequence[counter]]}
        audioctx={audioCtx}
      />
    )
    counter++
    if (counter > 6) {
      octave += 1
      counter = 0
    }
  }

  return (
    <PianoKeyboardStyled>
      <KeyboardVolume />
      <KeyboardContainer>{keyboard}</KeyboardContainer>
    </PianoKeyboardStyled>
  )
}

export default PianoKeyboard
