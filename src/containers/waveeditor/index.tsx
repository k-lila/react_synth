import { useDispatch, useSelector } from 'react-redux'
import { WaveEditorStyled } from './styles'
import { RootReducer } from '../../store'
import FundamentalWaveEditor from '../../components/fundamentalwaveeditor'
import { addFundamental } from '../../store/reducers/recipe'

const WaveEditor = () => {
  const recipe = useSelector((state: RootReducer) => state.recipe)
  const dispatch = useDispatch()
  return (
    <WaveEditorStyled>
      {recipe.waves.length > 0
        ? recipe.waves.map((_, i) => {
            return <FundamentalWaveEditor key={i} id={i} />
          })
        : null}
      <div className="add-btn">
        <button type="button" onClick={() => dispatch(addFundamental())}>
          <span>+</span>
        </button>
      </div>
    </WaveEditorStyled>
  )
}

export default WaveEditor
