import PianoBlackKey from '../../components/blackpianokey'
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
          <div className="black-keys-container">
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
                  if (i === 3 || i === 7 || i === 10) {
                    return (
                      <div
                        key={i}
                        style={{ width: '2.25em', visibility: 'hidden' }}
                      />
                    )
                  } else {
                    const diff = i <= 3 ? 0 : i <= 7 ? 1 : i <= 10 ? 2 : 3
                    const _i = i - diff - 1
                    return (
                      <PianoBlackKey
                        key={`11${i - 1}`}
                        id={Number(`11${i - 1}`)}
                        frequency={props.unnaturalfrequencies[_i][0]}
                        wavedata={props.unnaturalkeys[_i][0]}
                        audioctx={props.audioctx}
                      />
                    )
                  }
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
