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

    for (let i = 2; i < 5; i++) {
      for (let j = 0; j < keyboard[i].length; j++) {
        const _list: number[][] = []
        recipe.waves.forEach((wave) => {
          fundamental.setIntensities(wave.amplitudes)
          switch (wave.type) {
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
          _list.push(fundamental.getWave())
        })
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

  return { audioCtx, naturalKeys, unnaturalKeys, naturalFrequencies }
}

export default useSynth
