import styled from 'styled-components'

export const WaveEditorStyled = styled.div`
  display: flex;
  padding: 0.25em;
  border: 2px solid black;
  border-radius: 0.25em;
  width: 100%;
  height: 100%;
  overflow-x: auto;
  background-color: white;

  .add-btn {
    height: 100%;
    padding: 2em;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      width: 7em;
      height: 7em;
      border-radius: 50%;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid black;
      &:hover {
        background-color: darkgray;
      }
    }
    span {
      font-size: 7em;
    }
  }
`
