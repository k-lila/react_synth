import BasicSlider from '../../components/basicslider'
import PianoKey from '../../components/pianokey'
// import useWindowSize from '../../hooks/usewindowssize'
import { KeyboardContainer, PianoKeyboardStyled } from './styles'

const PianoKeyboard = () => {
  // const { windowsize } = useWindowSize()
  // let keyboardSize
  // if (windowsize.width < 768) {
  //   keyboardSize = 5
  // } else if (windowsize.width >= 1024) {
  //   keyboardSize = 12
  // } else {
  //   keyboardSize = 8
  // }
  const keyboard = []
  for (let i = 0; i < 2; i++) {
    keyboard.push(<PianoKey key={i} pitch={i} />)
  }

  return (
    <PianoKeyboardStyled>
      <BasicSlider defaultgain={50} />
      <BasicSlider defaultgain={70} horizontal />
      <KeyboardContainer>{keyboard}</KeyboardContainer>
    </PianoKeyboardStyled>
  )
}

export default PianoKeyboard
