import styled from 'styled-components'

export const KeyboardVolumeStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0.25em;
  height: 100%;

  /******** Chrome, Safari, Opera and Edge Chromium styles ********/
  #slider::-webkit-slider-runnable-track {
    // width: 100%;
  }
  #slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    margin-top: 0px;
    background-color: gray;
    border-radius: 0.25rem;
    height: 3rem;
    width: 10em;
    max-width: 100px;
  }

  #slider:focus::-webkit-slider-thumb {
    outline: 3px solid #808080;
    outline-offset: 0.125rem;
  }

  /*********** Firefox styles ***********/
  /* slider track */
  #slider::-moz-range-track {
    background-color: lightgray;
    height: 100%;
    width: 10em;
  }

  /* slider thumb */
  #slider::-moz-range-thumb {
    background-color: gray;
    border-radius: 0.25rem;
    border: none;
    height: 3rem;
    width: 10em;
  }

  #slider:focus::-moz-range-thumb {
    outline: 3px solid #808080;
    outline-offset: 0.125rem;
  }

  @media screen and (max-width: 767px) {
    #slider::-webkit-slider-thumb {
      width: 2em;
    }
    #slider::-moz-range-thumb {
      width: 2em;
    }
  }
  @media screen and (min-width: 768px) and (max-width: 1024px) {
  }
  @media screen and (min-width: 1025px) {
  }
`
