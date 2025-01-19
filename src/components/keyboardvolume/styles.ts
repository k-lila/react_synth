import styled from 'styled-components'

export const KeyboardVolumeStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0.25em;
  height: 100%;
  width: 7%;

  .slider__container {
  }

  .slider__thumb {
    background-color: black;
  }

  .marker-item {
    width: 70%;
    height: 1px;
    background-color: black;
  }

  @media screen and (max-width: 767px) {
    width: 20%;
  }
  @media screen and (min-width: 768px) and (max-width: 1023px) {
    width: 10%;
  }
  @media screen and (min-width: 1024px) {
  }
`
