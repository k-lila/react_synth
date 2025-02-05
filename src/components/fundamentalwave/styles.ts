import styled from 'styled-components'

export const FundamentalWaveStyled = styled.div`
  display: grid;
  grid-template-columns: auto 1.75em;
  grid-template-rows: 1.75em auto 1.75em;
  height: 100%;
  width: 35%;
  border: 2px solid black;
  border-radius: 0.25em;
  margin-right: 1vmin;
  color: black;

  .header {
    display: grid;
    grid-template-columns: 1.75em auto 1.75em;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    border-bottom: 2px solid black;
    grid-column: span 2;
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      border: none;
    }
  }

  .graph {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25em;
    height: 100%;
    width: 100%;
  }

  .slider {
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 2px solid black;
    height: 100%;
  }

  .harmonics {
    border-top: 2px solid black;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 1.75em auto 1.75em;
    grid-column: span 2;
    align-items: center;
    height: 100%;
    width: 100%;
    button {
      height: 100%;
      width: 100%;
      border: none;
    }
    &__button-container {
      display: flex;
      // flex-direction: column;
      height: 100%;
      width: 100%;
      button {
        border-right: 1px solid black;
        border-left: 1px solid black;
      }
    }
  }
`
