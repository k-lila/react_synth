import { useSelector } from 'react-redux'
import FundamentalWave from '../classes/fundamentalwave'
import { RootReducer } from '../store'
import { useMemo } from 'react'

function useMainWaveView() {
  const recipe = useSelector((state: RootReducer) => state.recipe)
  const visualization = useMemo(() => {
    const _visualization = new FundamentalWave(1000)
    const _list: number[][] = []
    recipe.waves.forEach((wave) => {
      _visualization.setIntensities(wave.amplitudes)
      _visualization.createContext(1, wave.type)
      _list.push(_visualization.getWave())
    })
    const result: number[] = []
    for (let k = 0; k < _list[0].length; k++) {
      let _num = 0
      for (let l = 0; l < _list.length; l++) {
        _num += _list[l][k]
      }
      result.push(_num)
    }
    const diff = (Math.max(...result) - Math.min(...result)) / 2
    return result.map((m) => (m / diff) * recipe.gain)
  }, [recipe.waves, recipe.gain])
  return visualization
}

export default useMainWaveView
