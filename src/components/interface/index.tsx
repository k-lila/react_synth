import { InterfaceStyled, Title } from './styles'
import { ReactNode } from 'react'

const Interface = ({ children }: { children: ReactNode }) => {
  return (
    <InterfaceStyled>
      <Title>harenator</Title>
      {children}
    </InterfaceStyled>
  )
}

export default Interface
