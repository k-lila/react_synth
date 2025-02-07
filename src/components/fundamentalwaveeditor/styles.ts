import styled from 'styled-components'

export const FundamentalWaveEditorStyled = styled.div`
  display: grid;
  grid-template-columns: 1.75em auto 1.75em;
  grid-template-rows: 1.75em calc(100% - 4em) 2.25em;
  height: 100%;
  min-width: 40%;
  border: 2px solid black;
  border-radius: 0.25em;
  margin-right: 1vmin;
  color: black;
  background-color: white;

  .header {
    display: grid;
    grid-template-columns: 1.75em auto 1.75em;
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
    }
    &__typewave {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      button {
        width: fit-content;
        padding: 0 1em;
        border-right: 2px solid black;
        border-left: 2px solid black;
      }
      &__popup {
        position: absolute;
        top: 100%;
        border: 2px solid black;
        padding: 0.25em;
        display: grid;
        grid-template-columns: 1.5em 1fr;
        grid-template-rows: 2em 2em 2em 2em;
        background-color: white;
        align-items: center;
      }
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
    width: 100%;
    overflow: hidden;
  }

  /******** Chrome, Safari, Opera and Edge Chromium styles ********/
  #slider::-webkit-slider-runnable-track {
    width: 0.5em;
  }
  #slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    margin-top: 0px;
    background-color: darkgray;
    border-radius: 0.1em;
    height: 1.75em;
    width: 3em;
    max-width: 100px;
    transform: translateX(-50%);
  }

  #slider:focus::-webkit-slider-thumb {
    outline: 3px solid #808080;
    outline-offset: 0.125em;
  }

  /*********** Firefox styles ***********/
  /* slider track */
  #slider::-moz-range-track {
    background-color: darkgray;
    height: 100%;
    width: 0.5em;
  }

  /* slider thumb */
  #slider::-moz-range-thumb {
    background-color: gray;
    border-radius: 0.1em;
    border: none;
    height: 1.75em;
    width: 1.75em;
  }

  #slider:focus::-moz-range-thumb {
    outline: 3px solid #808080;
    outline-offset: 0.125em;
  }

  .harmonics {
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
    }
    &__button-container {
      display: flex;
      height: 100%;
      width: 100%;
      overflow: auto;
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
  }
  .--d-none {
    display: none;
  }
`
