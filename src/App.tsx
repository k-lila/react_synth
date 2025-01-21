import Interface from './components/interface'
import Harenator from './containers/harenator'
import { Container, GlobalStyle } from './styles'

function App() {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Interface>
          <Harenator />
        </Interface>
      </Container>
    </>
  )
}

export default App
