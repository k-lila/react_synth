import { useEffect } from 'react'
import BasicSlider from '../basicslider/index'
import { KeyboardVolumeStyled } from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { RootReducer } from '../../store'
import { setIntensity } from '../../store/reducers/recipe'

const KeyboardVolume = () => {
  const intensity = useSelector((state: RootReducer) => state.recipe.intensity)
  const dispatch = useDispatch()

  const handleGain = (gain: number) => {
    dispatch(setIntensity(gain))
  }
  useEffect(() => {
    const block = true
    if (block) {
      console.log(intensity)
    }
  }, [intensity])
  return (
    <KeyboardVolumeStyled>
      <BasicSlider defaultgain={intensity * 100} onGainChange={handleGain} />
    </KeyboardVolumeStyled>
  )
}

export default KeyboardVolume
