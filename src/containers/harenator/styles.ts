import styled from 'styled-components'

export const HarenatorStyled = styled.div`
  width: 100%;
  padding: 0.25em;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid black;
  border-radius: 0.5em;

  @media screen and (max-width: 767px) {
    height: 100%;
    justify-content: space-between;
  }
  @media screen and (min-width: 768px) and (max-width: 1023px) {
    height: 100%;
    justify-content: space-between;
  }
  @media screen and (min-width: 1024px) {
  }
`
