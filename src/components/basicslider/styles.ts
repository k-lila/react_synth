import styled from 'styled-components'

export const BasicSliderStyled = styled.div<{ $horizontal?: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  #slider {
    height: 100%;
    writing-mode: vertical-lr;
    direction: rtl;
  }
`
