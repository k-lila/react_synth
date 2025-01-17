import Interface from './components/interface'
import PianoKeyboard from './containers/pianokeyboard'
import { Container, GlobalStyle } from './styles'

function App() {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Interface>
          <PianoKeyboard />
        </Interface>
      </Container>
    </>
  )
}

export default App
