import { InterfaceStyled, Title } from './styles'
import { InterfaceProps } from '../../types/propstypes'

const Interface = ({ children }: InterfaceProps) => {
  return (
    <InterfaceStyled>
      <Title>harenator</Title>
      {children}
    </InterfaceStyled>
  )
}

export default Interface
