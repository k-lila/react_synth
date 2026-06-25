import SynthWave from '../synthwave'
import PianoKeyboard from '../pianokeyboard'
import WaveEditor from '../waveeditor'
import { HarenatorStyled } from './styles'
import { useSelector } from 'react-redux'
import { RootReducer } from '../../store'
import useKeyboardLayout from '../../hooks/useKeyboardLayout'

const Harenator = () => {
  const scale = useSelector((state: RootReducer) => state.recipe.scale)
  const { naturalFrequencies, unnaturalFrequencies } = useKeyboardLayout()
  return (
    <HarenatorStyled>
      <SynthWave />
      <WaveEditor />
      <PianoKeyboard
        scale={scale}
        naturalfrequencies={naturalFrequencies}
        unnaturalfrequencies={unnaturalFrequencies}
      />
    </HarenatorStyled>
  )
}

export default Harenator
