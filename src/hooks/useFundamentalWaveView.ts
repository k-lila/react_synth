import { useSelector } from 'react-redux'
import FundamentalWave from '../classes/fundamentalwave'
import { RootReducer } from '../store'
import { useRef } from 'react'
import useComponentSizes from './useComponentSizes'
import LinePlot from '../utils/lineplot'

function useFundamentalWaveView({
  id,
  explosion,
  selected
}: {
  id: number
  explosion: boolean
  selected: number
}) {
  const wave = useSelector((state: RootReducer) => state.recipe.waves[id])
  const fundamental = new FundamentalWave(1000)
  fundamental.setIntensities(wave.amplitudes)
  fundamental.setPhases(wave.phases)
  fundamental.createContext(1, wave.type)
  const _wave = fundamental.getWave(wave.gain, wave.phase)
  const diff = (Math.max(..._wave) - Math.min(..._wave)) / 2
  const visualization = _wave.map((m) => (diff > 1 ? m / diff : m))
  const graphref = useRef<HTMLDivElement>(null)
  const componentSizes = useComponentSizes(graphref)
  const views = [...fundamental.wavelist, visualization]
  const plot = LinePlot(
    explosion ? views : [visualization],
    componentSizes.width,
    componentSizes.height,
    5,
    1,
    5,
    1,
    selected
  )
  return { plot, graphref }
}

export default useFundamentalWaveView
