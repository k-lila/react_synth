import styled from 'styled-components'

export const SynthWaveStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  border-radius: 0.25em;
  border: solid 2px black;
  padding: 1vmin;
  background-color: white;

  .graph {
    display: flex;
    width: 100%;
    height: calc(100% - 1vmin - 2em);
    border: solid 2px black;
    border-radius: 0.25em;
    &--plot {
      display: flex;
      height: 100%;
      width: 100%;
    }
  }

  @media screen and (max-height: 450px) {
    flex-direction: row;
    .graph {
      height: 100%;
      width: calc(100% - 5em - 1vmin);
    }
  }
`
