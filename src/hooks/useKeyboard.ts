import { useSelector } from 'react-redux'
import { RootReducer } from '../store'
import { useMemo } from 'react'
import Keyboard from '../classes/keyboard'

function useKeyboard() {
  const recipe = useSelector((state: RootReducer) => state.recipe)
  const scale = useMemo(() => {
    const keyboard = new Keyboard(recipe.pitch)
    switch (recipe.scale) {
      case 'natural':
        return [
          keyboard.keyboard.natural,
          keyboard.keyboard.naturalflats,
          keyboard.keyboard.naturalsharps
        ]
      case 'pitagoric':
        return [keyboard.keyboard.pitagoric]
      case 'chromatic':
        return [
          keyboard.keyboard.chromaticnatural,
          keyboard.keyboard.chromaticunnatural
        ]
      default:
        return [
          keyboard.keyboard.chromaticnatural,
          keyboard.keyboard.chromaticunnatural
        ]
    }
  }, [recipe.pitch, recipe.scale])
  return scale
}

export default useKeyboard
