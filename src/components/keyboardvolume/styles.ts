import styled from 'styled-components'

export const KeyboardVolumeStyled = styled.div`
  display: flex;
  width: 5%;
  position: relative;
  height: 100%;
  margin: 0 0.25em;
  @media screen and (max-width: 767px) {
    width: 15%;
  }
  @media screen and (min-width: 768px) and (max-width: 1023px) {
  }
  @media screen and (min-width: 1024px) {
  }
`
export const Thumb = styled.button.attrs<{ $position: number; $slide: number }>(
  (props) => ({
    style: {
      transform: `translateY(-${(props.$position / 100) * props.$slide}px)`
    }
  })
)`
  background-color: blue;
  border: none;
  width: 100%;
  height: 10%;
  position: absolute;
  pointer-events: none;
  bottom: 0;
`
