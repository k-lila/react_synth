import { useSelector } from 'react-redux'
import { RootReducer } from '../store'
import { useMemo, useRef } from 'react'
import FundamentalWave from '../classes/fundamentalwave'
import useKeyboard from './useKeyboard'

function useSynth() {
  const recipe = useSelector((state: RootReducer) => state.recipe)
  const keyboard = useKeyboard()
  const audioCtxRef = useRef<AudioContext | null>(null)
  if (!audioCtxRef.current) {
    audioCtxRef.current = new AudioContext()
  }
  const audioCtx = audioCtxRef.current

  const { naturalKeys, unnaturalKeys, naturalFrequencies } = useMemo(() => {
    const naturalKeys: number[][] = []
    const unnaturalKeys: number[] = []
    const naturalFrequencies: number[] = []
    for (let i = 2; i < 5; i++) {
      for (let j = 0; j < keyboard[i].length; j++) {
        const fundamental = new FundamentalWave(audioCtx.sampleRate)
        fundamental.setIntensities(recipe.waves[0].amplitudes)
        switch (recipe.waves[0].type) {
          case 'sin':
            fundamental.createSinContext(keyboard[i][j])
            break
          case 'square':
            fundamental.createSquareContext(keyboard[i][j])
            break
          case 'saw':
            fundamental.createSawThoothContext(keyboard[i][j])
            break
          case 'tri':
            fundamental.createTriangleContext(keyboard[i][j])
            break
          default:
            fundamental.createSinContext(keyboard[i][j])
        }
        naturalFrequencies.push(keyboard[i][j])
        naturalKeys.push(fundamental.getWave())
      }
    }
    return { naturalKeys, unnaturalKeys, naturalFrequencies }
  }, [audioCtx.sampleRate, recipe.waves, keyboard])

  return { audioCtx, naturalKeys, unnaturalKeys, naturalFrequencies }
}

export default useSynth
