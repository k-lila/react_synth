import styled from 'styled-components'

export const PianoKeyStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  button {
    width: 100%;
    height: 100%;
    border-radius: 1vmin 1vmin 2vmin 2vmin;
    border: solid 2px black;
    display: flex;
    align-items: end;
    justify-content: center;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-tap-highlight-color: transparent;
    span {
      margin-bottom: 1em;
    }
  }

  @media screen and (max-width: 767px) {
  }
  @media screen and (min-width: 768px) and (max-width: 1023px) {
  }
  @media screen and (min-width: 1024px) {
  }
`
