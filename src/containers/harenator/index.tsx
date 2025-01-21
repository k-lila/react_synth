import FundamentalWave from '../../classes/fundamentalwave'
import Keyboard from '../../classes/keyboard'
import PianoKeyboard from '../pianokeyboard'
import { HarenatorStyled } from './styles'

const Harenator = () => {
  const notes = new Keyboard(440)
  const note = notes.keyboard.chromatic[4][0]
  const teste = new FundamentalWave(`${note}`)
  teste.getInfo()

  return (
    <HarenatorStyled>
      <PianoKeyboard />
    </HarenatorStyled>
  )
}

export default Harenator
