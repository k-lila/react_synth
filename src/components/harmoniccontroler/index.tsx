import { addHarmonic, removeHarmonic } from '../../store/reducers/recipe'
import { useDispatch } from 'react-redux'
import { HarmonicControlerStyled } from './styles'

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
        -
      </button>
      <div className="button-container">
        <button
          className={props.selected < 0 ? '--bg-darkgray' : ''}
          onClick={() => {
            props.setSelected(-1)
          }}
        >
          ~
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
        +
      </button>
    </HarmonicControlerStyled>
  )
}

export default HarmonicControler
