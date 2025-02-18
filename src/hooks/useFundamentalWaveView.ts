import { useSelector } from 'react-redux'
import FundamentalWave from '../classes/fundamentalwave'
import { RootReducer } from '../store'
import { useMemo } from 'react'

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
    fundamental.createContext(1, wave.type)
    const _wave = fundamental.getWave(wave.gain, wave.phase)
    const diff = (Math.max(..._wave) - Math.min(..._wave)) / 2
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
