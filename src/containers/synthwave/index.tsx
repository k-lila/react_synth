import { useRef } from 'react'
import useComponentSizes from '../../hooks/useComponentSizes'
import LinePlot from '../../utils/lineplot'
import { SynthWaveStyled } from './styles'
import useMainWaveView from '../../hooks/useMainWaveView'
import Menu from '../../components/menu'

const SynthWave = () => {
  const graphref = useRef<HTMLDivElement>(null)
  const componentSizes = useComponentSizes(graphref)
  const mainWaveView = useMainWaveView()
  const plot = LinePlot(
    [mainWaveView],
    componentSizes.width,
    componentSizes.height,
    5,
    1,
    5,
    1
  )
  return (
    <SynthWaveStyled>
      <div className="graph">
        <div className="graph--plot" ref={graphref}>
          {plot}
        </div>
      </div>
      <Menu />
    </SynthWaveStyled>
  )
}

export default SynthWave
