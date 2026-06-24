import { useSelector } from 'react-redux'
import FundamentalWave from '../classes/fundamentalwave'
import { RootReducer } from '../store'
import { useMemo } from 'react'

/**
 * Gera o PCM de uma única onda da receita para visualização (não para áudio).
 *
 * @param id - índice da onda em `recipe.waves`
 * @param explosion - se `true`, inclui também cada parcial isolado além da soma
 * @returns uma lista de séries para plotar (`number[][]`): só a onda final, ou
 *   os parciais seguidos dela quando `explosion`
 * @remarks Usa sample rate fixo de 1000 (resolução de tela, não de áudio); a
 *   normalização só divide pelo pico quando ele excede 1.
 */
function useFundamentalWaveView({
  id,
  explosion
}: {
  id: number
  explosion: boolean
}) {
  const wave = useSelector((state: RootReducer) => state.recipe.waves[id])
  const visualization = useMemo(() => {
    const fundamental = new FundamentalWave(1000)
    fundamental.setIntensities(wave.amplitudes)
    fundamental.setPhases(wave.phases)
    fundamental.createContext(wave.type)
    const _wave = fundamental.getWave(wave.gain, wave.phase)
    let max = _wave[0]
    let min = _wave[0]
    for (let k = 1; k < _wave.length; k++) {
      if (_wave[k] > max) max = _wave[k]
      if (_wave[k] < min) min = _wave[k]
    }
    const diff = (max - min) / 2
    const visualization = _wave.map((m) => (diff > 1 ? m / diff : m))
    const views = [...fundamental.wavelist, visualization]
    return explosion ? views : [visualization]
  }, [
    explosion,
    wave.amplitudes,
    wave.gain,
    wave.type,
    wave.phase,
    wave.phases
  ])
  return visualization
}

export default useFundamentalWaveView
