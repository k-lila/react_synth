import { useRef, useState } from 'react'
import BasicSlider from '../../components/basicslider'
import { FundamentalWaveEditorStyled } from './styles'
import useFundamentalWaveView from '../../hooks/useFundamentalWaveView'
import useWaveEditorState from '../../hooks/useWaveEditorState'
import HarmonicControler from '../../components/harmoniccontroler'
import WaveEditorHeader from '../../components/waveeditorheader'
import useComponentSizes from '../../hooks/useComponentSizes'
import LinePlot from '../../utils/lineplot'

const FundamentalWaveEditor = ({ id }: { id: number }) => {
  const { selected, setGain, setPhase, setSelected, wave } =
    useWaveEditorState(id)
  const [waveExplosion, setWaveExplosion] = useState(false)
  const graphref = useRef<HTMLDivElement>(null)
  const componentSizes = useComponentSizes(graphref)
  const fundamentalView = useFundamentalWaveView({
    id: id,
    explosion: waveExplosion
  })
  const plot = LinePlot(
    fundamentalView,
    componentSizes.width,
    componentSizes.height,
    5,
    1,
    5,
    1,
    selected
  )
  return (
    <FundamentalWaveEditorStyled>
      <WaveEditorHeader
        id={id}
        wave={wave}
        waveExplosion={waveExplosion}
        setWaveExplosion={setWaveExplosion}
      />
      <div className="slider" style={{ borderRight: '2px solid black' }}>
        <BasicSlider
          key={selected}
          min={0}
          max={1}
          defaultgain={selected >= 0 ? wave.phases[selected] : wave.phase}
          onGainChange={setPhase}
        />
      </div>
      <div className="graph">
        <div className="graph--plot" ref={graphref}>
          {plot}
        </div>
      </div>
      <div className="slider" style={{ borderLeft: '2px solid black' }}>
        <BasicSlider
          key={selected}
          min={-1}
          max={1}
          defaultgain={selected >= 0 ? wave.amplitudes[selected] : wave.gain}
          onGainChange={setGain}
        />
      </div>
      <HarmonicControler
        id={id}
        selected={selected}
        setSelected={setSelected}
        wave={wave}
      />
    </FundamentalWaveEditorStyled>
  )
}

export default FundamentalWaveEditor
