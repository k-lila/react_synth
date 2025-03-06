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
        min={props.min}
        max={props.max}
        className={props.horizontal ? '' : 'vertical'}
      />
      <div className="marks">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </BasicSliderStyled>
  )
}

export default BasicSlider
