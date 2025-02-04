import styled from 'styled-components'

export const PianoKeyboardStyled = styled.section`
  display: flex;
  padding: 0.25em;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  border: 2px solid black;
  border-radius: 0.25em;
  grid-column: span 2;

  @media screen and (max-width: 767px) {
    grid-column: span 1;
  }
  @media screen and (min-width: 768px) and (max-width: 1023px) {
  }
  @media screen and (min-width: 1024px) {
  }
`

export const KeyboardContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`
