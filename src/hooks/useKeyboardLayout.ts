import { useSelector } from 'react-redux'
import { RootReducer } from '../store'
import { useMemo } from 'react'
import useKeyboard from './useKeyboard'

type KeyboardLayout = {
  naturalFrequencies: number[]
  unnaturalFrequencies: number[][]
}

/**
 * Deriva o layout de frequências (Hz) das teclas tocáveis na faixa `recipe.octaves`,
 * separadas em naturais e acidentais — paralelas por índice à renderização do teclado.
 *
 * @returns `naturalFrequencies` (lista plana) e `unnaturalFrequencies` (uma lista por
 *   posição natural, vazias em `pitagoric`), prontas para virar `frequency` de cada tecla.
 * @remarks Diz apenas **quais** notas existem (escala/oitavas), independente da rota de
 *   síntese — o som em si é responsabilidade do {@link useHareSynth}. Extraído do antigo
 *   `useSynth` ao migrar do PCM pré-renderizado para o oscilador nativo.
 * @see ADR-0003 — síntese por oscilador nativo (substitui o ADR-0001)
 */
function useKeyboardLayout(): KeyboardLayout {
  const scale = useSelector((state: RootReducer) => state.recipe.scale)
  const octaves = useSelector((state: RootReducer) => state.recipe.octaves)
  const keyboard = useKeyboard()
  return useMemo(() => {
    const naturalFrequencies: number[] = []
    const unnaturalFrequencies: number[][] = []
    for (let i = octaves[0]; i <= octaves[1]; i++) {
      for (let j = 0; j < keyboard[0][i].length; j++) {
        naturalFrequencies.push(keyboard[0][i][j])
      }
      if (scale !== 'pitagoric') {
        for (let j = 0; j < keyboard[1][i].length; j++) {
          const unnaturalFreq: number[] = []
          if (keyboard.length >= 2) unnaturalFreq.push(keyboard[1][i][j])
          if (keyboard.length === 3) unnaturalFreq.push(keyboard[2][i][j])
          unnaturalFrequencies.push(unnaturalFreq)
        }
      }
    }
    return { naturalFrequencies, unnaturalFrequencies }
  }, [keyboard, scale, octaves])
}

export default useKeyboardLayout
