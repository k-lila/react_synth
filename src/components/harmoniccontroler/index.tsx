import { addHarmonic, removeHarmonic } from '../../store/reducers/recipe'
import { useDispatch } from 'react-redux'
import { HarmonicControlerStyled } from './styles'
import minus from '../../assets/minus.svg'
import plus from '../../assets/plus.svg'
import all from '../../assets/all.svg'
import SVGContainer from '../svgcontainer'

const HarmonicControler = ({ ...props }: HarmonicControlerProps) => {
  const dispatch = useDispatch()
  return (
    <HarmonicControlerStyled>
      <button
        style={{ borderRight: '2px solid black' }}
        onClick={() => {
          if (props.selected == props.wave.amplitudes.length - 1) {
            props.setSelected(
              props.selected == 0 ? props.selected : props.selected - 1
            )
          }
          dispatch(removeHarmonic(props.id))
        }}
      >
        <SVGContainer src={minus} alt="remove" />
      </button>
      <div className="button-container">
        <button
          className={props.selected < 0 ? '--bg-darkgray' : ''}
          onClick={() => {
            props.setSelected(-1)
          }}
        >
          <SVGContainer src={all} alt="all" />
        </button>
        {props.wave.amplitudes.map((_, i) => {
          return (
            <button
              className={props.selected == i ? '--bg-darkgray' : ''}
              onClick={() => props.setSelected(i)}
              key={i}
            >
              {i}
            </button>
          )
        })}
      </div>
      <button
        onClick={() => {
          dispatch(addHarmonic(props.id))
          props.setSelected(props.wave.amplitudes.length)
        }}
        style={{ borderLeft: '2px solid black' }}
      >
        <SVGContainer src={plus} alt="add" />
      </button>
    </HarmonicControlerStyled>
  )
}

export default HarmonicControler
