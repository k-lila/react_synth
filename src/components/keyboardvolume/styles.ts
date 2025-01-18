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
export const Thumb = styled.button.attrs<{ $gain: number }>((props) => ({
  style: {
    top: `${props.$gain - 4}%`
  }
}))`
  background-color: blue;
  border: none;
  width: 100%;
  height: 8%;
  position: absolute;
  pointer-events: none;
  transform: translateY(-50%, 50%);
`
