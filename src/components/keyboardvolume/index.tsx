import { useRef } from 'react'
import { KeyboardVolumeStyled, Thumb } from './styles'
import useGain from '../../hooks/useGain'

const KeyboardVolume = () => {
  const volumeRef = useRef<HTMLDivElement>(null)
  const { gain, handleDown, handleMove, handleUp } = useGain({
    ref: volumeRef,
    defaultgain: 70,
    min: 0,
    max: 100
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
      onMouseOut={handleUp}
    >
      <Thumb
        $gain={gain}
        $slide={volumeRef.current ? volumeRef.current.clientHeight : 0}
      />
    </KeyboardVolumeStyled>
  )
}

export default KeyboardVolume
