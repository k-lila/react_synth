import { useEffect, useState } from 'react'
import BasicSlider from '../basicslider'
import { KeyboardVolumeStyled } from './styles'

const KeyboardVolume = () => {
  const [volume, setVolume] = useState(70)
  const handleGain = (gain: number) => {
    setVolume(gain)
  }
  useEffect(() => {
    console.log(volume)
  }, [volume])
  return (
    <KeyboardVolumeStyled>
      <BasicSlider defaultgain={70} onGainChange={handleGain} />
    </KeyboardVolumeStyled>
  )
}

export default KeyboardVolume
