import styled from 'styled-components'

export const PianoBlackKeyStyled = styled.div`
  width: 2.25em;
  height: 100%;
  button {
    height: 100%;
    width: 100%;
    background-color: rgba(50, 50, 50);
    border: 2px solid black;
    border-radius: 0.25em;
    span {
      font-size: 0.8em;
      color: white;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: end;
      padding-bottom: 1em;
      div {
        padding: 0;
        margin: 0;
      }
    }
  }
`
