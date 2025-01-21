import styled from 'styled-components'

export const BasicSliderStyled = styled.div<{ $horizontal?: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  #slider {
    height: 100%;
    -webkit-appearance: none;
    appearance: none;
    background: lightgray;
    cursor: pointer;
    width: 100%;
  }
  #slider:focus {
    outline: none;
  }

  .vertical {
    writing-mode: vertical-lr;
    direction: rtl;
  }

  /*********** Firefox styles ***********/
  #slider::-moz-range-track {
    background-color: lightgray;
  }
`
