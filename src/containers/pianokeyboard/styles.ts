import styled from 'styled-components'

export const PianoKeyboardStyled = styled.section`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 30vmin;

  @media screen and (max-width: 767px) {
  }
  @media screen and (min-width: 768px) and (max-width: 1023px) {
    height: 40vmin;
  }
  @media screen and (min-width: 1024px) {
  }
`

export const KeyboardContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`
