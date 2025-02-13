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
    const fundamental = new FundamentalWave(audioCtx.sampleRate)
    for (let i = 3; i < 5; i++) {
      for (let j = 0; j < keyboard[i].length; j++) {
        const _list: number[][] = []
        for (let k = 0; k < recipe.waves.length; k++) {
          fundamental.setIntensities(recipe.waves[k].amplitudes)
          fundamental.setPhases(recipe.waves[k].phases)
          fundamental.createContext(keyboard[i][j], recipe.waves[k].type)
          const wave = fundamental.getWave(
            recipe.waves[k].gain,
            recipe.waves[k].phase
          )
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
        naturalKeys.push(result.map((m) => m / diff))
        naturalFrequencies.push(keyboard[i][j])
      }
    }
    return { naturalKeys, unnaturalKeys, naturalFrequencies }
  }, [audioCtx.sampleRate, recipe.waves, keyboard])

  return { recipe, audioCtx, naturalKeys, unnaturalKeys, naturalFrequencies }
}

export default useSynth
