import KeyboardVolume from '../../components/keyboardvolume'
import PianoKey from '../../components/pianokey'
import useKeyboardQWERTY from '../../hooks/useKeyboardQWERTY'
import useWindowSize from '../../hooks/usewindowssize'
import { KeyboardContainer, PianoKeyboardStyled } from './styles'

const PianoKeyboard = ({ ...props }: PianoKeyboardProps) => {
  const { windowsize } = useWindowSize()
  useKeyboardQWERTY()

  let keyboardSize
  if (windowsize.width < 600) {
    keyboardSize = 5
  } else if (windowsize.width >= 1024) {
    keyboardSize = 12
  } else {
    keyboardSize = 8
  }
  const keyboard = []
  for (let i = 0; i < keyboardSize; i++) {
    keyboard.push(
      <PianoKey
        key={i}
        id={i}
        frequency={props.naturalfrequencies[i]}
        wavedata={props.naturalkeys[i]}
        audioctx={props.audioctx}
      />
    )
  }

  return (
    <PianoKeyboardStyled>
      <KeyboardVolume />
      <KeyboardContainer>{keyboard}</KeyboardContainer>
    </PianoKeyboardStyled>
  )
}

export default PianoKeyboard
