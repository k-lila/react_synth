import KeyboardVolume from '../../components/keyboardvolume'
import PianoKey from '../../components/pianokey'
import useKeyboardQWERTY from '../../hooks/useKeyboardQWERTY'
import useWindowSize from '../../hooks/useWindowsSize'
import { KeyboardContainer, PianoKeyboardStyled } from './styles'

const PianoKeyboard = ({ ...props }: PianoKeyboardProps) => {
  const { windowsize } = useWindowSize()
  useKeyboardQWERTY()

  let keyboardSize
  if (windowsize.width < 600) {
    keyboardSize = 5
  } else if (windowsize.width >= 1024) {
    keyboardSize = 12
  } else {
    keyboardSize = 8
  }
  const keyboard = []
  for (let i = 0; i < keyboardSize; i++) {
    keyboard.push(
      <PianoKey
        key={i}
        id={i}
        frequency={props.naturalfrequencies[i]}
        wavedata={props.naturalkeys[i]}
        audioctx={props.audioctx}
      />
    )
  }
  return (
    <PianoKeyboardStyled>
      <KeyboardVolume />
      <KeyboardContainer $num={keyboard.length}>
        {keyboard}
        {props.scale != 'pitagoric' ? (
          <div className="teste">
            {keyboard.map((_, i) => {
              if (i != 0) {
                if (props.scale == 'natural') {
                  return (
                    <div className="natural" key={i}>
                      <div className="left" />
                      <div className="right" />
                    </div>
                  )
                } else {
                  return <div className="teste2" key={i} />
                }
              }
            })}
          </div>
        ) : null}
      </KeyboardContainer>
    </PianoKeyboardStyled>
  )
}

export default PianoKeyboard
