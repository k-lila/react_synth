import PianoKey from '../../components/pianokey'
import { PianoKeyboardStyled } from './styles'

const PianoKeyboard = () => {
  return (
    <PianoKeyboardStyled>
      <PianoKey pitch={1} />
      <PianoKey pitch={2} />
      <PianoKey pitch={3} />
      <PianoKey pitch={4} />
      <PianoKey pitch={5} />
    </PianoKeyboardStyled>
  )
}

export default PianoKeyboard
