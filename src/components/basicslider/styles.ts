import styled from 'styled-components'

export const BasicSliderStyled = styled.div<{ $horizontal?: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

  .marks {
    position: absolute;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    color: red;
    justify-content: space-around;
    align-items: center;
    z-index: 0;
    span {
      border-top: 1px solid rgba(0, 0, 0, 0.25);
      min-width: 1em;
    }
  }

  .vertical {
    writing-mode: vertical-lr;
    direction: rtl;
  }

  #slider {
    height: 100%;
    -webkit-appearance: none;
    appearance: none;
    background: lightgray;
    cursor: pointer;
    width: 100%;
  }

  #slider::-moz-range-track {
    background-color: lightgray;
  }
  #slider::-webkit-slider-thumb {
    background-color: #606060;
    z-index: 1;
    position: relative;
  }
  #slider:focus::-webkit-slider-thumb {
    outline: 3px solid #606060;
  }
  #slider::-moz-range-track {
    background-color: lightgray;
  }
  #slider::-moz-range-thumb {
    background-color: #606060;
    z-index: 1;
    position: relative;
  }
`
