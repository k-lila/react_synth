import styled from 'styled-components'

export const FundamentalWaveEditorStyled = styled.div`
  display: grid;
  grid-template-columns: 1.75em calc(100% - 3.5em) 1.75em;
  grid-template-rows: 1.75em calc(100% - 4em) 2.25em;
  height: 100%;
  // min-width: 40%;
  border: 3px solid black;
  border-radius: 0.25em;
  margin-right: 1vmin;
  color: black;
  background-color: white;

  .graph {
    display: flex;
    width: 100%;
    height: 100%;
    &--plot {
      display: flex;
      height: 100%;
      width: 100%;
    }
  }

  .slider {
    display: flex;
    align-items: center;
    justify-content: center;
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

  @media screen and (max-width: 767px) {
    min-width: calc(50% - 2px);
  }
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    min-width: calc(50% - 2px);
  }
  @media screen and (min-width: 1025px) {
    min-width: 40%;
  }
`
