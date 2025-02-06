import { useEffect, useRef, useState } from 'react'
import BasicSlider from '../basicslider'
import { FundamentalWaveEditorStyled } from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { RootReducer } from '../../store'
import { adjustGain } from '../../store/reducers/recipe'
import FundamentalWave from '../../classes/fundamentalwave'
import useComponentSizes from '../../hooks/useComponentSizes'
import LinePlot from '../../utils/lineplot'

const FundamentalWaveEditor = ({ id }: { id: number }) => {
  const dispatch = useDispatch()
  const wave = useSelector((state: RootReducer) => state.recipe).waves[id]
  const [gain, setGain] = useState(wave.amplitudes[0])
  const [selected, setSelected] = useState(0)
  const [waveExplosion, setWaveExplosion] = useState(false)
  const handleGain = (_gain: number) => {
    setGain(_gain)
  }

  useEffect(() => {
    if (selected >= 0) {
      console.log(wave.amplitudes[selected])
      setGain(wave.amplitudes[selected])
    }
  }, [selected, wave.amplitudes])

  useEffect(() => {
    dispatch(adjustGain({ index: id, j: selected, gain: gain }))
  }, [dispatch, id, gain])

  const teste = new FundamentalWave(1000)
  teste.setIntensities(wave.amplitudes)
  teste.createContext(1, wave.type)
  const _wave = teste.getWave()
  const diff = (Math.max(..._wave) - Math.min(..._wave)) / 2
  const visualization = _wave.map((m) => (diff > 1 ? m / diff : m))

  const graphref = useRef<HTMLDivElement>(null)
  const componentSizes = useComponentSizes(graphref)

  const plot = LinePlot(
    waveExplosion ? teste.wavelist : [visualization],
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
      <div className="header">
        <button
          onClick={() => setWaveExplosion(!waveExplosion)}
          style={{ borderRight: '2px solid black' }}
        >
          0
        </button>
        <div className="header__typewave">
          <button>{wave.type}</button>
        </div>
        <button style={{ borderLeft: '2px solid black' }}>X</button>
      </div>
      <div className="graph" ref={graphref}>
        {plot}
      </div>
      <div className="slider">
        <BasicSlider
          key={selected}
          defaultgain={wave.amplitudes[selected]}
          onGainChange={handleGain}
        />
      </div>
      <div className="harmonics">
        <button style={{ borderRight: '2px solid black' }}>-</button>
        <div className="harmonics__button-container">
          {wave.amplitudes.map((_, i) => {
            return (
              <button
                className={selected == i ? '--bg-darkgray' : ''}
                onClick={() => setSelected(i)}
                key={i}
              >
                {i}
              </button>
            )
          })}
        </div>
        <button style={{ borderLeft: '2px solid black' }}>+</button>
      </div>
    </FundamentalWaveEditorStyled>
  )
}

export default FundamentalWaveEditor
