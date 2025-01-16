import ScaleGenerator from './classes/scalegenerator'
import { Container, GlobalStyle } from './styles'

const scale = new ScaleGenerator(1)
scale.getInfo()

function App() {
  return (
    <>
      <GlobalStyle />
      <Container>
        <h1>on</h1>
      </Container>
    </>
  )
}

export default App
