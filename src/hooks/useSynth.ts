import { useSelector } from 'react-redux'
import { RootReducer } from '../store'
import { useMemo, useRef } from 'react'
import FundamentalWave from '../classes/fundamentalwave'
import useKeyboard from './useKeyboard'
import useMinBufferSizeMap from './useMinBufferSizeMap'

function generateNote(waveRecipe: WaveRecipe[], fundamental: FundamentalWave) {
  let result: number[] = []
  for (let k = 0; k < waveRecipe.length; k++) {
    fundamental.setIntensities(waveRecipe[k].amplitudes)
    fundamental.setPhases(waveRecipe[k].phases)
    fundamental.createContext(waveRecipe[k].type)
    const wave = fundamental.getWave(waveRecipe[k].gain, waveRecipe[k].phase)
    if (k === 0) {
      result = wave
    } else {
      for (let j = 0; j < result.length; j++) {
        result[j] += wave[j]
      }
    }
  }

  let max = result[0]
  let min = result[0]
  for (let k = 1; k < result.length; k++) {
    if (result[k] > max) max = result[k]
    if (result[k] < min) min = result[k]
  }
  const diff = (max - min) / 2
  return result.map((m) => m / diff)
}

/**
 * Pré-renderiza o PCM de todas as notas tocáveis sempre que a `recipe` muda.
 *
 * @returns o `recipe`, o `audioCtx` compartilhado e, para as oitavas de
 *   `recipe.octaves`, o PCM e as frequências (Hz) separados em naturais
 *   (`naturalKeys`/`naturalFrequencies`) e não-naturais
 *   (`unnaturalKeys`/`unnaturalFrequencies`, vazios quando a escala é `pitagoric`),
 *   paralelos por índice e prontos para tocar em loop sem ressíntese.
 * @remarks O `useMemo` aqui é otimização medida, não reflexo: recalcular o
 *   conjunto inteiro a cada edição da onda é o custo aceito do modelo.
 * @see ADR-0001 — PCM pré-renderizado em loop
 */
function useSynth() {
  const recipe = useSelector((state: RootReducer) => state.recipe)
  const keyboard = useKeyboard()
  const audioCtxRef = useRef<AudioContext | null>(null)
  if (!audioCtxRef.current) {
    audioCtxRef.current = new AudioContext()
  }
  const audioCtx = audioCtxRef.current

  const minBufferSizeMap = useMinBufferSizeMap(
    audioCtx.sampleRate,
    keyboard,
    recipe.scale,
    recipe.octaves
  )

  const {
    naturalKeys,
    unnaturalKeys,
    naturalFrequencies,
    unnaturalFrequencies
  } = useMemo(() => {
    const naturalKeys: number[][] = []
    const unnaturalKeys: number[][][] = []
    const naturalFrequencies: number[] = []
    const unnaturalFrequencies: number[][] = []
    const fundamental = new FundamentalWave(audioCtx.sampleRate)
    for (let i = recipe.octaves[0]; i <= recipe.octaves[1]; i++) {
      for (let j = 0; j < keyboard[0][i].length; j++) {
        const { buffersize, num } = minBufferSizeMap.get(keyboard[0][i][j]) || {
          buffersize: 1,
          num: 1
        }
        fundamental.setMinBufferSize(buffersize, num)
        const note = generateNote(recipe.waves, fundamental)
        naturalKeys.push(note)
        naturalFrequencies.push(keyboard[0][i][j])
      }
      if (recipe.scale != 'pitagoric') {
        for (let j = 0; j < keyboard[1][i].length; j++) {
          const unnaturalSet: number[][] = []
          const unnaturalFreq: number[] = []
          if (keyboard.length >= 2) {
            const { buffersize, num } = minBufferSizeMap.get(
              keyboard[1][i][j]
            ) || { buffersize: 1, num: 1 }
            fundamental.setMinBufferSize(buffersize, num)
            unnaturalSet.push(generateNote(recipe.waves, fundamental))
            unnaturalFreq.push(keyboard[1][i][j])
          }
          if (keyboard.length === 3) {
            const { buffersize, num } = minBufferSizeMap.get(
              keyboard[2][i][j]
            ) || { buffersize: 1, num: 1 }
            fundamental.setMinBufferSize(buffersize, num)
            unnaturalSet.push(generateNote(recipe.waves, fundamental))
            unnaturalFreq.push(keyboard[2][i][j])
          }
          unnaturalKeys.push(unnaturalSet)
          unnaturalFrequencies.push(unnaturalFreq)
        }
      }
    }
    return {
      naturalKeys,
      unnaturalKeys,
      naturalFrequencies,
      unnaturalFrequencies
    }
  }, [
    audioCtx.sampleRate,
    recipe.waves,
    keyboard,
    recipe.scale,
    recipe.octaves,
    minBufferSizeMap
  ])

  return {
    recipe,
    audioCtx,
    naturalKeys,
    unnaturalKeys,
    naturalFrequencies,
    unnaturalFrequencies
  }
}

export default useSynth
