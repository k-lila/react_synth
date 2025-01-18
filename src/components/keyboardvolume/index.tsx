import { useEffect, useRef, useState } from 'react'
import { KeyboardVolumeStyled, Thumb } from './styles'

const KeyboardVolume = () => {
  const volumeRef = useRef<HTMLDivElement>(null)
  const [down, setDown] = useState(false)
  const [top, setTop] = useState(Number)
  const [height, setHeight] = useState(Number)

  const [gain, setGain] = useState(70)

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (down) {
      const num = event.clientY - top
      let percent = (num * 100) / height
      if (percent < 4) {
        percent = 4
      } else if (percent > 96) {
        percent = 96
      }
      setGain(percent)
      console.log(percent)
    }
  }
  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (down) {
      const num = event.touches[0].clientY - top
      let percent = (num * 100) / height
      if (percent < 4) {
        percent = 4
      } else if (percent > 96) {
        percent = 96
      }
      setGain(percent)
      console.log(percent)
    }
  }

  useEffect(() => {
    if (volumeRef.current) {
      const { top, height } = volumeRef.current.getBoundingClientRect()
      setTop(top)
      setHeight(height)
    }
  }, [])

  const handleDown = () => {
    setDown(true)
  }
  const handleUp = () => {
    setDown(false)
  }

  return (
    <KeyboardVolumeStyled
      ref={volumeRef}
      onMouseOut={handleUp}
      onTouchStart={handleDown}
      onTouchMove={(e) => handleTouchMove(e)}
      onTouchEnd={handleUp}
      onMouseDown={handleDown}
      onMouseMove={(e) => handleMove(e)}
      onMouseUp={handleUp}
    >
      <Thumb $gain={gain} />
    </KeyboardVolumeStyled>
  )
}

export default KeyboardVolume
