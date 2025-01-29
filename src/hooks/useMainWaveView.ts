import { useSelector } from "react-redux"
import FundamentalWave from "../classes/fundamentalwave"
import { RootReducer } from "../store"

function useMainWaveView() {
  const recipe = useSelector((state:RootReducer) => state.recipe)
  const _visualization = new FundamentalWave(1000)
  _visualization.setIntensities(recipe.waves[0].amplitudes)
  if (recipe.waves[0].type == 'sin') {
    _visualization.createSinContext(1)
  } else if (recipe.waves[0].type == 'square') {
    _visualization.createSquareContext(1)
  }
  const visualization = _visualization.getWave().map((m) => m * recipe.gain)
  return visualization
}

export default useMainWaveView
