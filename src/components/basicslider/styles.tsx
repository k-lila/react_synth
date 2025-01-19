import styled from 'styled-components'

export const BasicSliderStyled = styled.div<{ $horizontal?: boolean }>`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;

  .markers {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }

  .marker-item {
    height: 1px;
    background-color: black;
  }

  @media screen and (max-width: 767px) {
  }
  @media screen and (min-width: 768px) and (max-width: 1023px) {
  }
  @media screen and (min-width: 1024px) {
  }
`
export const Thumb = styled.div.attrs<{
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
  border: 2px solid black;
  border-radius: 0.25em;
  width: ${(props) => (props.$horizontal ? '10%' : '100%')};
  height: ${(props) => (props.$horizontal ? '100%' : '10%')};
  position: absolute;
  pointer-events: none;
  transition: all 0.125s;
  bottom: 0;
`
