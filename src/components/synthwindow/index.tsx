import { SynthWindowStyled, Title } from './styles'
import { ReactNode } from 'react'

const SynthWindow = ({ children }: { children: ReactNode }) => {
  return (
    <SynthWindowStyled>
      <Title>harenator</Title>
      {children}
    </SynthWindowStyled>
  )
}

export default SynthWindow
