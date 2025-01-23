import FundamentalWave from '../../classes/fundamentalwave'
import Keyboard from '../../classes/keyboard'
import SynthWave from '../../components/synthwave'
import PianoKeyboard from '../pianokeyboard'
import { HarenatorStyled } from './styles'

const afinacao = 44100

const Harenator = () => {
  const notes = new Keyboard(afinacao)
  const note = notes.keyboard.chromatic[4][9]
  const teste = new FundamentalWave(44100)
  teste.setIntensities([1, 0.5, 0.25, 0.1, 0.05, 0.05])
  teste.createSinContext(note)
  // const data1 = [teste.getWave()]
  // const data1 = teste.wavelist

  return (
    <HarenatorStyled>
      <SynthWave datavisualization={teste.getVisualization()} />
      <PianoKeyboard />
    </HarenatorStyled>
  )
}

export default Harenator
