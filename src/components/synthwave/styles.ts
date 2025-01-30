import styled from 'styled-components'

export const SynthWaveStyled = styled.div`
  display: flex;
  justify-items: center;
  align-items: center;
  width: fit-content;
  border-radius: 0.25em;
  border: solid 2px black;
  margin: 1vmin 0;
  padding: 1vmin;
  .graph {
    display: flex;
    width: 25svh;
    height: 25svh;
    border: solid 2px black;
    border-radius: 0.25em;
    &--plot {
      display: flex;
      width: 100%;
      height: 100%;
    }
  }
  .menu {
    border: solid 2px black;
    border-radius: 0.25em;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 25svh;
    width: 5em;
    margin-left: 1vmin;
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
      flex-direction: column;
      margin: 0.5em 0;
      button {
        margin: 0.25em 0;
        padding: 0.1em;
      }
    }
  }
  @media screen and (max-width: 767px) {
    margin: 1.75em 0;
    .graph {
      width: 65vmin;
    }
    .menu {
      width: 25vmin;
    }
  }
  @media screen and (min-width: 768px) and (max-width: 1023px) {
    height: 50svh;
    width: 25vw;
    margin-top: 1.75em;
    margin-left: 1vmin;
    margin-right: auto;
    .graph {
      height: 100%;
      width: 100%;
    }
    .menu {
      height: 100%;
    }
  }
  @media screen and (min-width: 1024px) {
  }
`
