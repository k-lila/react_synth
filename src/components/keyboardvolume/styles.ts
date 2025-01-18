import styled from 'styled-components'

export const KeyboardVolumeStyled = styled.div`
  display: flex;
  width: 5%;
  position: relative;
  height: 100%;
`
export const Thumb = styled.button<{ $gain: number }>`
  background-color: blue;
  border: none;
  width: 100%;
  height: 8%;
  position: absolute;
  pointer-events: none;
  top: ${(props) => props.$gain - 4}%;
  transform: translateY(-50%, 50%);
`
