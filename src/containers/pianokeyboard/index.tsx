import PianoBlackKey from '../../components/blackpianokey'
import KeyboardVolume from '../../components/keyboardvolume'
import PianoKey from '../../components/pianokey'
import useKeyboardQWERTY from '../../hooks/useKeyboardQWERTY'
import useWindowSize from '../../hooks/useWindowsSize'
import { KeyboardContainer, PianoKeyboardStyled } from './styles'

const PianoKeyboard = ({ ...props }: PianoKeyboardProps) => {
  const { windowsize } = useWindowSize()
  useKeyboardQWERTY()

  const keyboardSize =
    windowsize.width < 600 ? 5 : windowsize.width >= 1024 ? 12 : 8

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

  const blackKeyboard =
    props.scale === 'pitagoric'
      ? null
      : keyboard.map((_, i) => {
          if (i != 0) {
            if (props.scale == 'natural') {
              return (
                <div className="natural" key={i}>
                  <PianoBlackKey
                    key={`10${i - 1}`}
                    id={Number(`10${i - 1}`)}
                    frequency={props.unnaturalfrequencies[i][0]}
                    wavedata={props.unnaturalkeys[i][0]}
                    audioctx={props.audioctx}
                    natural
                    flat
                  />
                  <PianoBlackKey
                    key={`11${i - 1}`}
                    id={Number(`11${i - 1}`)}
                    frequency={props.unnaturalfrequencies[i - 1][1]}
                    wavedata={props.unnaturalkeys[i - 1][1]}
                    audioctx={props.audioctx}
                    natural
                  />
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
        })

  return (
    <PianoKeyboardStyled>
      <KeyboardVolume />
      <KeyboardContainer $num={keyboard.length}>
        {keyboard}
        <div className="black-keys-container">{blackKeyboard}</div>
      </KeyboardContainer>
    </PianoKeyboardStyled>
  )
}

export default PianoKeyboard
