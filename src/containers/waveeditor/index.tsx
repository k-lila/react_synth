import { useSelector } from 'react-redux'
import { WaveEditorStyled } from './styles'
import { RootReducer } from '../../store'
import FundamentalWave from '../../components/fundamentalwave'

const WaveEditor = () => {
  const recipe = useSelector((state: RootReducer) => state.recipe)
  return (
    <WaveEditorStyled>
      {recipe.waves.map((_, i) => {
        return <FundamentalWave key={i} id={i} />
      })}
    </WaveEditorStyled>
  )
}

export default WaveEditor
