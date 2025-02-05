import { FundamentalWaveStyled } from './styles'

const FundamentalWave = () => {
  return (
    <FundamentalWaveStyled>
      <div className="header">
        <button style={{ borderRight: '2px solid black' }}>0</button>
        <span>sin</span>
        <button style={{ borderLeft: '2px solid black' }}>X</button>
      </div>

      <div className="graph">grafico</div>

      <div className="slider">asd</div>

      <div className="harmonics">
        <button style={{ borderRight: '2px solid black' }}>-</button>
        <div className="harmonics__button-container">
          <button>asd</button>
          <button>asd</button>
          <button>asd</button>
          <button>asd</button>
          <button>asd</button>
          <button>asd</button>
        </div>
        <button style={{ borderLeft: '2px solid black' }}>+</button>
      </div>
    </FundamentalWaveStyled>
  )
}

export default FundamentalWave
