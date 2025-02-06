import { useEffect, useState } from 'react'
import BasicSlider from '../basicslider'
import { FundamentalWaveStyled } from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { RootReducer } from '../../store'
import { adjustGain } from '../../store/reducers/recipe'

const FundamentalWave = ({ id }: { id: number }) => {
  const dispatch = useDispatch()
  const wave = useSelector((state: RootReducer) => state.recipe).waves[id]
  const [gain, setGain] = useState(wave.amplitudes[0])
  const [selected, setSelected] = useState(0)
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

  return (
    <FundamentalWaveStyled>
      <div className="header">
        <button style={{ borderRight: '2px solid black' }}>0</button>
        <div className="header__typewave">
          <button>{wave.type}</button>
        </div>
        <button style={{ borderLeft: '2px solid black' }}>X</button>
      </div>
      <div className="graph">grafico</div>
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
          {wave.amplitudes.map((m, i) => {
            return (
              <button onClick={() => setSelected(i)} key={i}>
                {i}
              </button>
            )
          })}
        </div>
        <button style={{ borderLeft: '2px solid black' }}>+</button>
      </div>
    </FundamentalWaveStyled>
  )
}

export default FundamentalWave
