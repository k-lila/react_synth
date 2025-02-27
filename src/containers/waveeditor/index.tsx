import { useDispatch, useSelector } from 'react-redux'
import { WaveEditorStyled } from './styles'
import { RootReducer } from '../../store'
import FundamentalWaveEditor from '../fundamentalwaveeditor'
import { addFundamental } from '../../store/reducers/recipe'
import plus from '../../assets/plus.svg'
import SVGContainer from '../../components/svgcontainer'

const WaveEditor = () => {
  const recipe = useSelector((state: RootReducer) => state.recipe)
  const dispatch = useDispatch()
  return (
    <WaveEditorStyled>
      {recipe.waves.map((_, i) => {
        return <FundamentalWaveEditor key={i} id={i} />
      })}
      <div className="add-btn">
        <button type="button" onClick={() => dispatch(addFundamental())}>
          <SVGContainer src={plus} alt="add" />
        </button>
      </div>
    </WaveEditorStyled>
  )
}

export default WaveEditor
