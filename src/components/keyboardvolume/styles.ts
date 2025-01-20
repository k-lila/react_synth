import styled from 'styled-components'

export const KeyboardVolumeStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0.25em;
  height: 100%;
  width: 7%;

  /*********** Baseline, reset styles ***********/
  #slider {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    width: 100%;
  }

  /* Removes default focus */
  #slider:focus {
    outline: none;
  }

  /******** Chrome, Safari, Opera and Edge Chromium styles ********/
  /* slider track */
  #slider::-webkit-slider-runnable-track {
    background-color: black;
    border-radius: 0.25rem;
    height: 2rem;
    width: 0.5em;
  }

  /* slider thumb */
  #slider::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    margin-top: 0px; /* Centers thumb on the track */
    background-color: #808080;
    border-radius: 0.25rem;
    height: 3rem;
    width: 6rem;
    transform: translateX(-2.75rem);
  }

  #slider:focus::-webkit-slider-thumb {
    outline: 3px solid #808080;
    outline-offset: 0.125rem;
  }

  /*********** Firefox styles ***********/
  /* slider track */
  #slider::-moz-range-track {
    background-color: #9ccdde;
    border-radius: 0.5rem;
    height: 2rem;
  }

  /* slider thumb */
  #slider::-moz-range-thumb {
    background-color: #808080;
    border: none; /*Removes extra border that FF applies*/
    border-radius: 0rem;
    height: 2rem;
    width: 1rem;
  }

  #slider:focus::-moz-range-thumb {
    outline: 3px solid #808080;
    outline-offset: 0.125rem;
  }
`
