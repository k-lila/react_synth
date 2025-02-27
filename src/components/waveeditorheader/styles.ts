import styled from 'styled-components'

export const WaveEditorHeaderStyled = styled.header`
  display: grid;
  grid-template-columns: 1.75em auto 1.75em;
  grid-template-rows: 100%;
  align-items: center;
  height: 100%;
  border-bottom: 2px solid black;
  grid-column: span 3;
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    border: none;
    &:hover {
      background-color: lightgray;
    }
  }
  .typewave {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    button {
      background-color: red;
      width: fit-content;
      padding: 0 1em;
      border-right: 2px solid black;
      border-left: 2px solid black;
    }
  }
`
