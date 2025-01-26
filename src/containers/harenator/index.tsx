import FundamentalWave from '../../classes/fundamentalwave'
import Keyboard from '../../classes/keyboard'
import SynthWave from '../../components/synthwave'
import PianoKeyboard from '../pianokeyboard'
import { HarenatorStyled } from './styles'

const afinacao = 440

const Harenator = () => {
  const notes = new Keyboard(afinacao)
  const note = notes.keyboard.natural[2][5]
  const fundamental = new FundamentalWave(44100)
  const intensities = [1, 0.3, 0.2, 0.1]
  fundamental.setIntensities(intensities)
  // fundamental.createSinContext(note)
  // fundamental.createSquareContext(note)
  fundamental.createSawThoothContext(note)
  // fundamental.createSinContext(note)

  const wave = fundamental.getWave()

  return (
    <HarenatorStyled>
      <SynthWave datavisualization={wave} />
      <PianoKeyboard />
    </HarenatorStyled>
  )
}

export default Harenator
