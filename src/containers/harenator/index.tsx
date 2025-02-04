import SynthWave from '../synthwave'
import useSynth from '../../hooks/useSynth'
import PianoKeyboard from '../pianokeyboard'
import WaveEditor from '../waveeditor'
import { HarenatorStyled } from './styles'

const Harenator = () => {
  const { audioCtx, naturalKeys, naturalFrequencies } = useSynth()
  return (
    <HarenatorStyled>
      <SynthWave />
      <WaveEditor />
      <PianoKeyboard
        audioctx={audioCtx}
        naturalkeys={naturalKeys}
        naturalfrequencies={naturalFrequencies}
      />
    </HarenatorStyled>
  )
}

export default Harenator
