import { PianoKeyProps } from '../../types/props/propstypes'
import { PianoKeyStyled } from './styles'

const PianoKey = ({ ...props }: PianoKeyProps) => {
  return (
    <PianoKeyStyled>
      <button>{props.pitch}</button>
    </PianoKeyStyled>
  )
}

export default PianoKey
