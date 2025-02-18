import { Provider } from 'react-redux'
import SynthWindow from './containers/synthwindow'
import Harenator from './containers/harenator'
import { Container, GlobalStyle } from './styles'
import store from './store'

function App() {
  return (
    <>
      <GlobalStyle />
      <Container>
        <SynthWindow>
          <Provider store={store}>
            <Harenator />
          </Provider>
        </SynthWindow>
      </Container>
    </>
  )
}

export default App
