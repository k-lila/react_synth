import SynthWave from '../../components/synthwave'
import useSynth from '../../hooks/useSynth'
import PianoKeyboard from '../pianokeyboard'
import { HarenatorStyled } from './styles'

const Harenator = () => {
  const { audioCtx, naturalKeys, naturalFrequencies } = useSynth()
  return (
    <HarenatorStyled>
      <SynthWave />
      <PianoKeyboard
        audioctx={audioCtx}
        naturalkeys={naturalKeys}
        naturalfrequencies={naturalFrequencies}
      />
    </HarenatorStyled>
  )
}

export default Harenator
