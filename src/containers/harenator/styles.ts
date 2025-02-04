import styled from 'styled-components'

export const HarenatorStyled = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0.25em;
  display: grid;
  grid-template-columns: 30% auto;
  grid-template-rows: 16em 16em;
  gap: 0.25em;
  align-items: center;
  border: 2px solid black;
  border-radius: 0.5em;

  @media screen and (max-width: 600px) {
    padding: 0;
    height: 100%;
    grid-template-columns: 100%;
    grid-template-rows: 25% auto 30%;
  }
  @media screen and (min-width: 600px) and (max-width: 1024px) {
    max-width: calc(100vw - 3vmin);
    @media screen and (max-height: 600px) {
      grid-template-columns: 30% auto;
      grid-template-rows: 47svh 47svh;
    }
  }
  @media screen and (min-width: 1025px) {
  }
`
