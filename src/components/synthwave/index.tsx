import { useRef } from 'react'
import useComponentSizes from '../../hooks/useComponentSizes'
import { SynthWaveProps } from '../../types/props/propstypes'
import LinePlot from '../../utils/lineplot'
import { SynthWaveStyled } from './styles'

const SynthWave = ({ ...props }: SynthWaveProps) => {
  const graphref = useRef<HTMLDivElement>(null)
  const { height, width } = useComponentSizes(graphref)
  return (
    <SynthWaveStyled>
      <div className="graph">
        <div className="graph--plot" ref={graphref}>
          {props.datavisualization
            ? LinePlot([props.datavisualization], width, height, 5, 1, 5, 1)
            : null}
        </div>
      </div>
      <div className="menu">
        <div>
          <div className="menu--input">
            <label htmlFor="reference">afinação</label>
            <input type="number" step={0.1} id="reference" />
          </div>
          <div className="menu--scales">
            <button>cromatica</button>
            <button>natural</button>
            <button>pitagorica</button>
          </div>
        </div>
        <button>refresh</button>
      </div>
    </SynthWaveStyled>
  )
}

export default SynthWave
