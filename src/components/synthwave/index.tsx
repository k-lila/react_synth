import { useRef } from 'react'
import useComponentSizes from '../../hooks/useComponentSizes'
import LinePlot from '../../utils/lineplot'
import { SynthWaveStyled } from './styles'
import FundamentalWave from '../../classes/fundamentalwave'

import usePitchChange from '../../hooks/usePitchChange'

const SynthWave = () => {
  const { pitch, handlePitchChange } = usePitchChange()
  const graphref = useRef<HTMLDivElement>(null)
  const { height, width } = useComponentSizes(graphref)
  const fundamental = new FundamentalWave(1000)
  fundamental.setIntensities([1, 0.2])

  fundamental.createSinContext(1)

  return (
    <SynthWaveStyled>
      <div className="graph">
        <div className="graph--plot" ref={graphref}>
          {LinePlot([fundamental.getWave()], width, height, 5, 1, 5, 1)}
        </div>
      </div>
      <div className="menu">
        <div>
          <div className="menu--input">
            <label htmlFor="reference">afinação</label>
            <input
              type="number"
              step={0.1}
              id="reference"
              value={pitch}
              onChange={(e) => handlePitchChange(Number(e.target.value))}
            />
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
