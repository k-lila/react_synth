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
  background-color: white;
  @media screen and (max-width: 600px) {
    grid-column: span 1;
  }
  @media screen and (min-width: 601px) and (max-width: 1023px) {
  }
  @media screen and (min-width: 1024px) {
  }
`

export const KeyboardContainer = styled.div<{ $num: number }>`
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 0;
  position: relative;

  .black-keys-container {
    position: absolute;
    pointer-events: none;
    width: 100%;
    height: 60%;
    display: flex;
    justify-content: space-around;
    padding: 0 calc(100% / ${(props) => props.$num * 2});
  }

  .natural {
    display: flex;
  }
`
