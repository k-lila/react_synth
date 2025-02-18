import styled from 'styled-components'

export const SynthWaveStyled = styled.div`
  display: grid;
  grid-template-columns: 75% auto;
  grid-template-rows: 100%;
  gap: 0.5em;
  justify-items: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 0.25em;
  border: solid 2px black;
  padding: 1vmin;
  background-color: white;

  .graph {
    display: flex;
    width: 100%;
    height: 100%;
    border: solid 2px black;
    border-radius: 0.25em;
    &--plot {
      display: flex;
      height: 100%;
      width: 100%;
    }
  }
  .menu {
    border: solid 2px black;
    border-radius: 0.25em;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    padding: 0.25em;
    &--input {
      color: black;
      text-align: center;
      padding: 0.25em;
      input {
        text-align: center;
        width: 100%;
      }
    }
    &--scales {
      display: flex;
      height: 100%;
      justify-content: space-evenly;
      flex-direction: column;
      margin: 0.5em 0;
      button {
        margin: 0.25em 0;
        padding: 0.1em;
      }
    }
  }
  @media screen and (max-height: 400px) {
    .menu {
      font-size: 0.75em;
      &--scales {
        button {
          font-size: 0.75em;
        }
      }
    }
  }
  @media screen and (max-width: 600px) {
  }
  @media screen and (min-width: 601px) and (max-width: 767px) {
    grid-template-columns: 50% auto;
  }
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    grid-template-columns: 65% auto;
  }
  @media screen and (min-width: 1025px) {
  }
`
