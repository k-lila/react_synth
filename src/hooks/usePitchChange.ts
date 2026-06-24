import { useDispatch, useSelector } from 'react-redux'
import { RootReducer } from '../store'
import { setPitch } from '../store/reducers/recipe'

/**
 * Lê e altera o `pitch` (Hz) da receita.
 *
 * @returns o `pitch` atual e `handlePitchChange`, que ignora valores ≤ 2 Hz
 */
function usePitchChange() {
  const recipe = useSelector((state: RootReducer) => state.recipe)
  const dispatch = useDispatch()
  const handlePitchChange = (newPitch: number) => {
    if (newPitch > 2) {
      dispatch(setPitch(newPitch))
    }
  }
  return { pitch: recipe.pitch, handlePitchChange: handlePitchChange }
}

export default usePitchChange
