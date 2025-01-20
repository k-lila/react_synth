import { useEffect, useState } from 'react'
import { BasicSliderStyled } from './styles'

type BasicSliderProps = {
  defaultgain: number
  horizontal?: boolean
  onGainChange?: (gain: number) => void
}

const BasicSlider = ({ ...props }: BasicSliderProps) => {
  const [gain, setGain] = useState(props.defaultgain)

  useEffect(() => {
    if (props.onGainChange) {
      props.onGainChange(gain)
    }
  }, [gain, props])

  return (
    <BasicSliderStyled>
      <input
        id="slider"
        type="range"
        value={gain}
        onChange={(e) => setGain(Number(e.target.value))}
        min={0}
        max={100}
      />
    </BasicSliderStyled>
  )
}

export default BasicSlider
