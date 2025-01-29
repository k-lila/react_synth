import { useSelector } from 'react-redux'
import { RootReducer } from '../store'
import Keyboard from '../classes/keyboard'
import { useMemo, useRef } from 'react'
import FundamentalWave from '../classes/fundamentalwave'

function useSynth() {
  const recipe = useSelector((state: RootReducer) => state.recipe)
  const audioCtxRef = useRef<AudioContext | null>(null)
  if (!audioCtxRef.current) {
    audioCtxRef.current = new AudioContext()
  }
  const audioCtx = audioCtxRef.current

  const keyboard = new Keyboard(recipe.pitch)
  let scale: number[][]
  if (recipe.scale == 'natural') {
    scale = keyboard.keyboard.natural
  } else if (recipe.scale == 'pitagoric') {
    scale = keyboard.keyboard.pitagoric
  } else {
    scale = keyboard.keyboard.chromatic
  }

  const { naturalKeys, unnaturalKeys, naturalFrequencies } = useMemo(() => {
    const naturalKeys: number[][] = []
    const naturalFrequencies: number[] = []
    const unnaturalKeys: number[] = []
    const chromatic_sequence = [0, 2, 4, 5, 7, 9, 11]
    for (let i = 4; i < 6; i++) {
      for (let j = 0; j < scale[i].length; j++) {
        if (recipe.scale == 'chromatic') {
          if (chromatic_sequence.includes(j)) {
            const fundamental = new FundamentalWave(audioCtx.sampleRate)
            fundamental.setIntensities(recipe.waves[0].amplitudes)
            if (recipe.waves[0].type == 'sin') {
              fundamental.createSinContext(scale[i][j])
            } else if (recipe.waves[0].type == 'square') {
              fundamental.createSquareContext(scale[i][j])
            }
            naturalFrequencies.push(scale[i][j])
            naturalKeys.push(fundamental.getWave())
          } else {
            naturalFrequencies.push(scale[i][j])
            unnaturalKeys.push(scale[i][j])
          }
        } else {
          const fundamental = new FundamentalWave(audioCtx.sampleRate)
          fundamental.setIntensities(recipe.waves[0].amplitudes)
          if (recipe.waves[0].type == 'sin') {
            fundamental.createSinContext(scale[i][j])
          } else if (recipe.waves[0].type == 'square') {
            fundamental.createSquareContext(scale[i][j])
          }
          naturalFrequencies.push(scale[i][j])
          naturalKeys.push(fundamental.getWave())
        }
      }
    }
    return { naturalKeys, unnaturalKeys, naturalFrequencies }
  }, [recipe.scale, scale, audioCtx.sampleRate, recipe.waves])
  return { audioCtx, naturalKeys, unnaturalKeys, naturalFrequencies }
}

export default useSynth
