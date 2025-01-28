import SynthWave from '../../components/synthwave'
import PianoKeyboard from '../pianokeyboard'
import { HarenatorStyled } from './styles'

const Harenator = () => {
  return (
    <HarenatorStyled>
      <SynthWave />
      <PianoKeyboard />
    </HarenatorStyled>
  )
}

export default Harenator
