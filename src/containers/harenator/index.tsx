import FundamentalWave from '../../classes/fundamentalwave'
import Keyboard from '../../classes/keyboard'
import SynthWave from '../../components/synthwave'
import PianoKeyboard from '../pianokeyboard'
import { HarenatorStyled } from './styles'

const afinacao = 441

const Harenator = () => {
  const notes = new Keyboard(afinacao)
  const note = notes.keyboard.natural[4][5]
  const fundamental_sin = new FundamentalWave(44100)
  // const intensities = [1, 0.5, 0.25, 0.4, 0.2, 0.05]
  const intensities = [1, 1]

  fundamental_sin.setIntensities(intensities)
  fundamental_sin.createSinContext(note)

  const wave = fundamental_sin.getWave()

  console.log(fundamental_sin.wavelist)

  return (
    <HarenatorStyled>
      <SynthWave datavisualization={fundamental_sin.wavelist} />
      <PianoKeyboard />
    </HarenatorStyled>
  )
}

export default Harenator
