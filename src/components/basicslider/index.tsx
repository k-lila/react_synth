import { useEffect, useRef, useState } from 'react'
import useGain from '../../hooks/useGain'
import getPercent from '../../utils/getpercent'
import { BasicSliderStyled, Thumb } from './styles'

type BasicSliderProps = {
  defaultgain: number
  horizontal?: boolean
  onGainChange?: (gain: number) => void
}

const BasicSlider = ({ ...props }: BasicSliderProps) => {
  const volumeRef = useRef<HTMLDivElement>(null)
  const { gain, handleDown, handleMove, handleUp } = useGain({
    horizontal: props.horizontal,
    ref: volumeRef,
    defaultgain: props.defaultgain
  })
  const [thumb, setThumb] = useState(Number)

  useEffect(() => {
    if (props.onGainChange) {
      props.onGainChange(gain)
    }
    if (volumeRef.current) {
      const position = getPercent(gain, 100, 0, 89, true)
      setThumb(position)
    }
  }, [gain, thumb, props.horizontal, props])

  const handleTouchInfo = (event: React.TouchEvent<HTMLDivElement>) => {
    if (props.horizontal) {
      return event.touches[0].clientX
    } else {
      return event.touches[0].clientY
    }
  }

  const handleMouseInfo = (event: React.MouseEvent<HTMLDivElement>) => {
    if (props.horizontal) {
      return event.clientX
    } else {
      return event.clientY
    }
  }

  return (
    <BasicSliderStyled
      className="slider__container"
      $horizontal={props.horizontal}
      ref={volumeRef}
      onTouchStart={(e) => handleDown(handleTouchInfo(e))}
      onTouchMove={(e) => handleMove(handleTouchInfo(e))}
      onTouchEnd={handleUp}
      onMouseDown={(e) => handleDown(handleMouseInfo(e))}
      onMouseMove={(e) => handleMove(handleMouseInfo(e))}
      onMouseUp={handleUp}
    >
      <Thumb
        className="slider__thumb"
        $horizontal={props.horizontal}
        $position={thumb}
        $slide={
          volumeRef.current
            ? props.horizontal
              ? volumeRef.current.clientWidth
              : volumeRef.current.clientHeight
            : 0
        }
      />
      <div className="markers">
        <div className="marker-item" />
        <div className="marker-item" />
        <div className="marker-item" />
        <div className="marker-item" />
        <div className="marker-item" />
        <div className="marker-item" />
        <div className="marker-item" />
        <div className="marker-item" />
        <div className="marker-item" />
      </div>
    </BasicSliderStyled>
  )
}

export default BasicSlider
