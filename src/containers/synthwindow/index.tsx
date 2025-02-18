import useWindowSize from '../../hooks/useWindowsSize'
import { SynthWindowStyled, Title } from './styles'
import { ReactNode } from 'react'

const SynthWindow = ({ children }: { children: ReactNode }) => {
  const { windowsize } = useWindowSize()
  return (
    <SynthWindowStyled>
      {windowsize.width > 1024 ? <Title>harenator</Title> : null}
      {children}
    </SynthWindowStyled>
  )
}

export default SynthWindow
