import styled from 'styled-components'

export const KeyboardVolumeStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0.25em;
  height: 100%;

  #slider {
    width: 6em;
  }

  /******** Chrome, Safari, Opera and Edge Chromium styles ********/
  #slider::-webkit-slider-runnable-track {
  }
  #slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    margin-top: 0px;
    border-radius: 0.25rem;
    height: 2em;
    width: 6em;
    max-width: 100px;
  }

  #slider:focus::-webkit-slider-thumb {
    outline-offset: 0.125rem;
  }

  /*********** Firefox styles ***********/
  /* slider track */
  #slider::-moz-range-track {
    width: 6em;
  }

  /* slider thumb */
  #slider::-moz-range-thumb {
    appearance: none;
    margin-top: 0px;
    border-radius: 0.25rem;
    height: 2em;
    width: 6em;
    max-width: 100px;
  }

  #slider:focus::-moz-range-thumb {
    outline-offset: 0.125rem;
  }

  @media screen and (max-height: 450px) {
    #slider::-webkit-slider-thumb {
      height: 1.5em;
    }
    #slider::-moz-range-thumb {
      height: 1.5em;
    }
  }

  @media screen and (max-width: 767px) {
    #slider {
      width: 2em;
    }
    #slider::-webkit-slider-thumb {
      width: 2em;
    }
    #slider::-moz-range-track {
      width: 2em;
    }
    #slider::-moz-range-thumb {
      width: 2em;
    }
  }
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    .marks {
      span {
        width: 50%;
      }
    }
  }
  @media screen and (min-width: 1025px) {
    .marks {
      span {
        width: 50%;
      }
    }
  }
`
