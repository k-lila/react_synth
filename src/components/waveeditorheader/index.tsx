import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { removeFundamental } from '../../store/reducers/recipe'
import WaveChoosePopUp from '../wavechoosepopup'
import { WaveEditorHeaderStyled } from './styles'
import change from '../../assets/change.svg'
import close from '../../assets/close.svg'
import up from '../../assets/up.svg'
import down from '../../assets/down.svg'
import SVGContainer from '../svgcontainer'

const WaveEditorHeader = ({ ...props }: WaveEditorHeaderProps) => {
  const dispatch = useDispatch()
  const [popUp, setPopUp] = useState(false)
  return (
    <WaveEditorHeaderStyled>
      <button
        onClick={() => props.setWaveExplosion(!props.waveExplosion)}
        style={{ borderRight: '2px solid black' }}
      >
        <SVGContainer src={change} alt="change graph" />
      </button>
      <div className="typewave">
        <button onClick={() => setPopUp(!popUp)}>
          {props.wave.type}
          <div>
            {popUp ? (
              <SVGContainer src={up} alt="up" />
            ) : (
              <SVGContainer src={down} alt="down" />
            )}
          </div>
        </button>
        <WaveChoosePopUp id={props.id} show={popUp} />
      </div>
      <button
        onClick={() => dispatch(removeFundamental(props.id))}
        style={{ borderLeft: '2px solid black' }}
      >
        <SVGContainer src={close} alt="close" />
      </button>
    </WaveEditorHeaderStyled>
  )
}

export default WaveEditorHeader
