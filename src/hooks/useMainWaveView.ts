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
      _visualization.setPhases(wave.phases)
      _visualization.createContext(wave.type)
      _list.push(_visualization.getWave(wave.gain, wave.phase))
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
    const final = result.map((m) => {
      if (diff == 0) {
        return 0
      } else {
        return (m / diff) * recipe.gain
      }
    })
    return final
  }, [recipe.waves, recipe.gain])
  return visualization
}

export default useMainWaveView
