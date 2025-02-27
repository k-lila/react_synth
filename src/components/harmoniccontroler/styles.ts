import styled from 'styled-components'

export const HarmonicControlerStyled = styled.div`
  border-top: 2px solid black;
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 1.75em auto 1.75em;
  grid-column: span 3;
  align-items: center;
  height: 100%;
  width: 100%;
  button {
    height: 100%;
    width: 100%;
    border: none;
    &:hover {
      background-color: lightgray;
    }
  }
  .button-container {
    display: flex;
    height: 100%;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    button {
      width: 20%;
      min-width: 20%;
      border-right: 2px solid black;
    }
    &::-webkit-scrollbar {
      height: 0.5em;
    }
    &::-webkit-scrollbar-track {
      background-color: lightgray;
    }
    &::-webkit-scrollbar-thumb {
      background-color: darkgray;
    }
  }
`
