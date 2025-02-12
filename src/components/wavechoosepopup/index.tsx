import { setWaveType } from '../../store/reducers/recipe'
import { useDispatch, useSelector } from 'react-redux'
import { RootReducer } from '../../store'
import { WaveChoosePopUpStyled } from './styles'

const WaveChoosePopUp = ({ id, show }: { id: number; show: boolean }) => {
  const dispatch = useDispatch()
  const wave = useSelector((state: RootReducer) => state.recipe).waves[id]
  return (
    <WaveChoosePopUpStyled className={`${show ? '' : '--d-none'}`}>
      <input
        onChange={() => dispatch(setWaveType({ id: id, type: 'sin' }))}
        type="radio"
        id={`sin${id}`}
        name={`wavef${id}`}
        value="sin"
        checked={wave.type == 'sin'}
      />
      <label htmlFor={`sin${id}`}>Seno</label>
      <input
        onChange={() => dispatch(setWaveType({ id: id, type: 'square' }))}
        type="radio"
        id={`square${id}`}
        name={`wavef${id}`}
        value="square"
        checked={wave.type == 'square'}
      />
      <label htmlFor={`square${id}`}>Quadrada</label>
      <input
        onChange={() => dispatch(setWaveType({ id: id, type: 'tri' }))}
        type="radio"
        id={`tri${id}`}
        name={`wavef${id}`}
        value="tri"
        checked={wave.type == 'tri'}
      />
      <label htmlFor={`tri${id}`}>Triangular</label>
      <input
        onChange={() => dispatch(setWaveType({ id: id, type: 'saw' }))}
        type="radio"
        id={`saw${id}`}
        name={`wavef${id}`}
        value="saw"
        checked={wave.type == 'saw'}
      />
      <label htmlFor={`saw${id}`}>Dente de Serra</label>
    </WaveChoosePopUpStyled>
  )
}

export default WaveChoosePopUp
