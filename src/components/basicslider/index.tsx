import { useEffect, useState } from 'react'
import { BasicSliderStyled } from './styles'

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
        step={0.01}
        min={-1}
        max={1}
        className={props.horizontal ? '' : 'vertical'}
      />
    </BasicSliderStyled>
  )
}

export default BasicSlider
