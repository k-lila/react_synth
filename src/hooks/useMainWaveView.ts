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
      switch (wave.type) {
      case 'sin':
        _visualization.createSinContext(1)
        break
      case 'square':
        _visualization.createSquareContext(1)
        break
      case 'saw':
        _visualization.createSawThoothContext(1)
        break
      case 'tri':
        _visualization.createTriangleContext(1)
        break
      default:
        _visualization.createSinContext(1)
      }
      _list.push(_visualization.getWave())
    })
    const result: number[] = []
    for (let k=0; k<_list[0].length; k++) {
      let _num = 0
      for (let l=0; l<_list.length; l++) {
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
