import { useSelector } from 'react-redux'
import { RootReducer } from '../store'
import { useMemo, useRef } from 'react'
import FundamentalWave from '../classes/fundamentalwave'
import useKeyboard from './useKeyboard'

function generateNote(
  frequency: number,
  waveRecipe: WaveRecipe[],
  fundamental: FundamentalWave
) {
  const _list: number[][] = []
  for (let k = 0; k < waveRecipe.length; k++) {
    fundamental.setIntensities(waveRecipe[k].amplitudes)
    fundamental.setPhases(waveRecipe[k].phases)
    fundamental.createContext(frequency, waveRecipe[k].type)
    const wave = fundamental.getWave(waveRecipe[k].gain, waveRecipe[k].phase)
    _list.push(wave)
  }

  const result: number[] = []
  for (let k = 0; k < _list[0].length; k++) {
    let _num = 0
    for (let l = 0; l < _list.length; l++) {
      _num += _list[l][k]
    }
    result.push(_num)
  }
  const diff = (Math.max(...result) - Math.min(...result)) / 2
  return result.map((m) => m / diff)
}

function useSynth() {
  const recipe = useSelector((state: RootReducer) => state.recipe)
  const keyboard = useKeyboard()
  const audioCtxRef = useRef<AudioContext | null>(null)
  if (!audioCtxRef.current) {
    audioCtxRef.current = new AudioContext()
  }
  const audioCtx = audioCtxRef.current
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
    for (let i = 3; i < 5; i++) {
      for (let j = 0; j < keyboard[0][i].length; j++) {
        const note = generateNote(keyboard[0][i][j], recipe.waves, fundamental)
        naturalKeys.push(note)
        naturalFrequencies.push(keyboard[0][i][j])
      }
      if (recipe.scale != 'pitagoric') {
        for (let j = 0; j < keyboard[1][i].length; j++) {
          const unnaturalSet: number[][] = []
          const unnaturalFreq: number[] = []
          if (keyboard.length >= 2) {
            unnaturalSet.push(
              generateNote(keyboard[1][i][j], recipe.waves, fundamental)
            )
            unnaturalFreq.push(keyboard[1][i][j])
          }
          if (keyboard.length === 3) {
            unnaturalSet.push(
              generateNote(keyboard[2][i][j], recipe.waves, fundamental)
            )
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
  }, [audioCtx.sampleRate, recipe.waves, keyboard, recipe.scale])

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
