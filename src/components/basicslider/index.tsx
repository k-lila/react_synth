import { useEffect, useState } from 'react'
import { BasicSliderStyled } from './styles'
import { BasicSliderProps } from '../../types/props/propstypes'

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
        step={1}
        min={0}
        max={100}
        className={props.horizontal ? '' : 'vertical'}
      />
    </BasicSliderStyled>
  )
}

export default BasicSlider
