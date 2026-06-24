import { useSelector } from 'react-redux'
import { RootReducer } from '../store'
import { useMemo } from 'react'
import Keyboard from '../classes/keyboard'

/**
 * Constrói o teclado de frequências (Hz) da escala ativa a partir de `recipe`.
 *
 * @returns os planos da escala no formato `[plano][oitava][nota]`: `natural` tem
 *   3 planos (naturais, bemóis, sustenidos), `chromatic` tem 2 (naturais,
 *   acidentes) e `pitagoric` tem 1.
 */
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
