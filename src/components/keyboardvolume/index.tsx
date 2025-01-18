import { useEffect, useRef, useState } from 'react'
import { KeyboardVolumeStyled, Thumb } from './styles'

const KeyboardVolume = () => {
  const volumeRef = useRef<HTMLDivElement>(null)
  const [down, setDown] = useState(false)
  const [sizes, setSizes] = useState({
    height: 0,
    top: 0
  })
  const [gain, setGain] = useState(70)

  const updateSizes = () => {
    if (volumeRef.current) {
      const { top, height } = volumeRef.current.getBoundingClientRect()
      setSizes({
        height: height,
        top: top
      })
    }
  }

  const getPercent = (num: number) => {
    let percent = (num * 100) / sizes.height
    if (percent < 4) {
      percent = 4
    } else if (percent > 96) {
      percent = 96
    }
    return percent
  }

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (down) {
      const num = event.clientY - sizes.top
      setGain(getPercent(num))
    }
  }
  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (down) {
      const num = event.touches[0].clientY - sizes.top
      setGain(getPercent(num))
    }
  }

  const handleDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setDown(true)
    const num = event.clientY - sizes.top
    setGain(getPercent(num))
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setDown(true)
    const num = event.touches[0].clientY - sizes.top
    setGain(getPercent(num))
  }

  const handleUp = () => {
    setDown(false)
  }

  useEffect(() => {
    updateSizes()
    window.addEventListener('resize', updateSizes)
    return () => window.removeEventListener('resize', updateSizes)
  }, [])

  return (
    <KeyboardVolumeStyled
      ref={volumeRef}
      onTouchStart={(e) => handleTouchStart(e)}
      onTouchMove={(e) => handleTouchMove(e)}
      onTouchEnd={handleUp}
      onMouseDown={(e) => handleDown(e)}
      onMouseMove={(e) => handleMove(e)}
      onMouseUp={handleUp}
    >
      <Thumb $gain={gain} />
    </KeyboardVolumeStyled>
  )
}

export default KeyboardVolume
