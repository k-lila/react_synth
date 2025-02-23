import SynthWave from '../synthwave'
import useSynth from '../../hooks/useSynth'
import PianoKeyboard from '../pianokeyboard'
import WaveEditor from '../waveeditor'
import { HarenatorStyled } from './styles'

const Harenator = () => {
  const {
    recipe,
    audioCtx,
    naturalKeys,
    unnaturalKeys,
    naturalFrequencies,
    unnaturalFrequencies
  } = useSynth()
  return (
    <HarenatorStyled>
      <SynthWave />
      <WaveEditor />
      <PianoKeyboard
        scale={recipe.scale}
        audioctx={audioCtx}
        naturalkeys={naturalKeys}
        unnaturalkeys={unnaturalKeys}
        naturalfrequencies={naturalFrequencies}
        unnaturalfrequencies={unnaturalFrequencies}
      />
    </HarenatorStyled>
  )
}

export default Harenator
