import { useDispatch, useSelector } from 'react-redux'
import { RootReducer } from '../../store'
import usePitchChange from '../../hooks/usePitchChange'
import { setScale } from '../../store/reducers/recipe'
import { MenuStyled } from './styles'

const Menu = () => {
  const dispatch = useDispatch()
  const recipe = useSelector((state: RootReducer) => state.recipe)
  const { pitch, handlePitchChange } = usePitchChange()
  return (
    <MenuStyled>
      <div className="input">
        <label className='--bg-lightgray' htmlFor="reference">{'Lá'}</label>
        <input
          type="number"
          step={0.1}
          min={2}
          id="reference"
          value={pitch}
          onChange={(e) => handlePitchChange(Number(e.target.value))}
        />
      </div>
      <div className="scales">
        <button
          className={`${recipe.scale == 'chromatic' ? '--bg-darkgray' : ''}`}
          onClick={() => dispatch(setScale('chromatic'))}
        >
          cromatica
        </button>
        <button
          className={`${recipe.scale == 'natural' ? '--bg-darkgray' : ''}`}
          onClick={() => dispatch(setScale('natural'))}
        >
          natural
        </button>
        <button
          className={`${recipe.scale == 'pitagoric' ? '--bg-darkgray' : ''}`}
          onClick={() => dispatch(setScale('pitagoric'))}
        >
          pitagorica
        </button>
      </div>
    </MenuStyled>
  )
}

export default Menu
