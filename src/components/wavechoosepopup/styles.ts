import styled from 'styled-components'

export const WaveChoosePopUpStyled = styled.div`
  position: absolute;
  top: 100%;
  border: 2px solid black;
  padding: 0.25em;
  display: grid;
  grid-template-columns: 1.5em 1fr;
  grid-template-rows: 2em 2em 2em 2em;
  background-color: white;
  align-items: center;

  @media screen and (max-height: 450px) {
    grid-template-rows: 1em 1em 1em 1em;
  }
`
