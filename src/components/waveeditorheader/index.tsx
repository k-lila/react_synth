import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { removeFundamental } from '../../store/reducers/recipe'
import WaveChoosePopUp from '../wavechoosepopup'
import { WaveEditorHeaderStyled } from './styles'

const WaveEditorHeader = ({ ...props }: WaveEditorHeaderProps) => {
  const dispatch = useDispatch()
  const [popUp, setPopUp] = useState(false)
  return (
    <WaveEditorHeaderStyled>
      <button
        onClick={() => props.setWaveExplosion(!props.waveExplosion)}
        style={{ borderRight: '2px solid black' }}
      >
        0
      </button>
      <div className="typewave">
        <button onClick={() => setPopUp(!popUp)}>{props.wave.type}</button>
        <WaveChoosePopUp id={props.id} show={popUp} />
      </div>
      <button
        onClick={() => dispatch(removeFundamental(props.id))}
        style={{ borderLeft: '2px solid black' }}
      >
        X
      </button>
    </WaveEditorHeaderStyled>
  )
}

export default WaveEditorHeader
