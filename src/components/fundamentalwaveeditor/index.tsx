import { useEffect, useRef, useState } from 'react'
import BasicSlider from '../basicslider'
import { FundamentalWaveEditorStyled } from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { RootReducer } from '../../store'
import {
  addHarmonic,
  adjustGain,
  removeFundamental,
  removeHarmonic,
  setWaveGain,
  setWaveType
} from '../../store/reducers/recipe'
import FundamentalWave from '../../classes/fundamentalwave'
import useComponentSizes from '../../hooks/useComponentSizes'
import LinePlot from '../../utils/lineplot'

const FundamentalWaveEditor = ({ id }: { id: number }) => {
  const dispatch = useDispatch()
  const wave = useSelector((state: RootReducer) => state.recipe).waves[id]
  const [gain, setGain] = useState(wave.amplitudes[0])
  const [selected, setSelected] = useState(0)
  const [waveExplosion, setWaveExplosion] = useState(false)
  const [popUp, setPopUp] = useState(false)
  const handleGain = (_gain: number) => {
    setGain(_gain)
  }

  useEffect(() => {
    if (selected >= 0) {
      setGain(wave.amplitudes[selected])
    } else {
      setGain(wave.gain)
    }
  }, [selected, wave.amplitudes, wave.gain])

  useEffect(() => {
    if (selected >= 0) {
      dispatch(adjustGain({ index: id, j: selected, gain: gain }))
    } else {
      dispatch(setWaveGain({ waveid: id, gain: gain }))
    }
  }, [dispatch, id, gain])
  const teste = new FundamentalWave(1000)
  teste.setIntensities(wave.amplitudes)
  teste.createContext(1, wave.type)
  const _wave = teste.getWave().map((m) => m * wave.gain)
  const diff = (Math.max(..._wave) - Math.min(..._wave)) / 2
  const visualization = _wave.map((m) => (diff > 1 ? m / diff : m))
  const graphref = useRef<HTMLDivElement>(null)
  const componentSizes = useComponentSizes(graphref)
  const teste2 = [...teste.wavelist, visualization]
  const plot = LinePlot(
    waveExplosion ? teste2 : [visualization],
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
          <button onClick={() => setPopUp(!popUp)}>{wave.type}</button>
          <div className={`header__typewave__popup ${popUp ? '' : '--d-none'}`}>
            <input
              onChange={() => dispatch(setWaveType({ id: id, type: 'sin' }))}
              type="radio"
              id={`sin${id}`}
              name={`wavef${id}`}
              value="sin"
              checked={wave.type == 'sin'}
            />
            <label htmlFor={`sin${id}`}>Seno</label>
            <input
              onChange={() => dispatch(setWaveType({ id: id, type: 'square' }))}
              type="radio"
              id={`square${id}`}
              name={`wavef${id}`}
              value="square"
              checked={wave.type == 'square'}
            />
            <label htmlFor={`square${id}`}>Quadrada</label>
            <input
              onChange={() => dispatch(setWaveType({ id: id, type: 'tri' }))}
              type="radio"
              id={`tri${id}`}
              name={`wavef${id}`}
              value="tri"
              checked={wave.type == 'tri'}
            />
            <label htmlFor={`tri${id}`}>Triangular</label>
            <input
              onChange={() => dispatch(setWaveType({ id: id, type: 'saw' }))}
              type="radio"
              id={`saw${id}`}
              name={`wavef${id}`}
              value="saw"
              checked={wave.type == 'saw'}
            />
            <label htmlFor={`saw${id}`}>Dente de Serra</label>
          </div>
        </div>
        <button
          onClick={() => dispatch(removeFundamental(id))}
          style={{ borderLeft: '2px solid black' }}
        >
          X
        </button>
      </div>
      <div className="slider">
        {/* <BasicSlider
          key={selected}
          defaultgain={wave.amplitudes[selected]}
          onGainChange={handleGain}
        /> */}
      </div>
      <div className="graph" ref={graphref}>
        {plot}
      </div>
      <div className="slider">
        <BasicSlider
          key={selected}
          defaultgain={selected >= 0 ? wave.amplitudes[selected] : wave.gain}
          onGainChange={handleGain}
        />
      </div>
      <div className="harmonics">
        <button
          style={{ borderRight: '2px solid black' }}
          onClick={() => {
            if (selected == wave.amplitudes.length - 1) {
              setSelected(selected == 0 ? selected : selected - 1)
            }
            dispatch(removeHarmonic(id))
          }}
        >
          -
        </button>
        <div className="harmonics__button-container">
          <button
            className={selected < 0 ? '--bg-darkgray' : ''}
            onClick={() => {
              setSelected(-1)
            }}
          >
            ~
          </button>
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
        <button
          onClick={() => dispatch(addHarmonic(id))}
          style={{ borderLeft: '2px solid black' }}
        >
          +
        </button>
      </div>
    </FundamentalWaveEditorStyled>
  )
}

export default FundamentalWaveEditor
