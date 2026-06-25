import { useSelector } from 'react-redux'
import FundamentalWave from '../classes/fundamentalwave'
import { RootReducer } from '../store'
import { useMemo } from 'react'

/**
 * Gera o PCM da soma de todas as ondas da receita para visualização (não áudio).
 *
 * @returns um período da onda resultante, normalizado e multiplicado por
 *   `recipe.gain`; array de zeros quando o sinal é plano
 * @remarks Usa sample rate fixo de 1000 (resolução de tela, não de áudio).
 */
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
    let max = result[0]
    let min = result[0]
    for (let k = 1; k < result.length; k++) {
      if (result[k] > max) max = result[k]
      if (result[k] < min) min = result[k]
    }
    const diff = (max - min) / 2
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
