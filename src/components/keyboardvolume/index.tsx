import { useRef } from 'react'
import { KeyboardVolumeStyled, Thumb } from './styles'
import useGain from '../../hooks/useGain'

const KeyboardVolume = () => {
  const volumeRef = useRef<HTMLDivElement>(null)
  const { gain, handleDown, handleMove, handleUp } = useGain({
    ref: volumeRef,
    defaultgain: 70,
    min: 4,
    max: 96
  })

  return (
    <KeyboardVolumeStyled
      ref={volumeRef}
      onTouchStart={(e) => handleDown(e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientY)}
      onTouchEnd={handleUp}
      onMouseDown={(e) => handleDown(e.clientY)}
      onMouseMove={(e) => handleMove(e.clientY)}
      onMouseUp={handleUp}
    >
      <Thumb $gain={gain} />
    </KeyboardVolumeStyled>
  )
}

export default KeyboardVolume
