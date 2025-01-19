import styled from 'styled-components'

export const BasicSliderStyled = styled.div<{ $horizontal?: boolean }>`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 0.25em;
  @media screen and (max-width: 767px) {
  }
  @media screen and (min-width: 768px) and (max-width: 1023px) {
  }
  @media screen and (min-width: 1024px) {
  }
`
export const Thumb = styled.button.attrs<{
  $position: number
  $slide: number
  $horizontal?: boolean
}>((props) => ({
  style: {
    transform: props.$horizontal
      ? `translateX(${(props.$position / 100) * props.$slide}px)`
      : `translateY(-${(props.$position / 100) * props.$slide}px)`
  }
}))`
  background-color: blue;
  border: none;
  width: ${(props) => (props.$horizontal ? '10%' : '100%')};
  height: ${(props) => (props.$horizontal ? '100%' : '10%')};
  position: absolute;
  pointer-events: none;
  bottom: 0;
`
