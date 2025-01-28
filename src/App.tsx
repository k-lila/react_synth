import { Provider } from 'react-redux'
import Interface from './components/interface'
import Harenator from './containers/harenator'
import { Container, GlobalStyle } from './styles'
import store from './store'

function App() {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Interface>
          <Provider store={store}>
            <Harenator />
          </Provider>
        </Interface>
      </Container>
    </>
  )
}

export default App
