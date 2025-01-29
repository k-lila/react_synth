import BasicSlider from '../basicslider/index'
import { KeyboardVolumeStyled } from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { RootReducer } from '../../store'
import { setGain } from '../../store/reducers/recipe'

const KeyboardVolume = () => {
  const dispatch = useDispatch()
  const gain = useSelector((state: RootReducer) => state.recipe.gain)
  const handleGain = (_gain: number) => {
    dispatch(setGain(_gain))
  }
  return (
    <KeyboardVolumeStyled>
      <BasicSlider defaultgain={gain} onGainChange={handleGain} />
    </KeyboardVolumeStyled>
  )
}

export default KeyboardVolume
