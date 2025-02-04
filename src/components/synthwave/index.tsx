import { useRef } from 'react'
import useComponentSizes from '../../hooks/useComponentSizes'
import LinePlot from '../../utils/lineplot'
import { SynthWaveStyled } from './styles'

import usePitchChange from '../../hooks/usePitchChange'
import { useDispatch } from 'react-redux'
import { setScale } from '../../store/reducers/recipe'
import useMainWaveView from '../../hooks/useMainWaveView'

const SynthWave = () => {
  const dispatch = useDispatch()
  const { pitch, handlePitchChange } = usePitchChange()
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
      <div className="menu">
        <div>
          <div className="menu--input">
            <label htmlFor="reference">afinação</label>
            <input
              type="number"
              step={0.1}
              min={2}
              id="reference"
              value={pitch}
              onChange={(e) => handlePitchChange(Number(e.target.value))}
            />
          </div>
          <div className="menu--scales">
            <button onClick={() => dispatch(setScale('chromatic'))}>
              cromatica
            </button>
            <button onClick={() => dispatch(setScale('natural'))}>
              natural
            </button>
            <button onClick={() => dispatch(setScale('pitagoric'))}>
              pitagorica
            </button>
          </div>
        </div>
      </div>
    </SynthWaveStyled>
  )
}

export default SynthWave
