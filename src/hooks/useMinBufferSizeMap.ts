import { useMemo } from 'react'
import minBufferSize from '../utils/minbuffersize'

function useMinBufferSizeMap(
  audioCtxSampleRate: number,
  keyboard: number[][][],
  scale: string
) {
  return useMemo(() => {
    const map = new Map<number, { buffersize: number; num: number }>()
    for (let i = 3; i < 5; i++) {
      for (let j = 0; j < keyboard[0][i].length; j++) {
        const frequency = keyboard[0][i][j]
        map.set(frequency, minBufferSize(audioCtxSampleRate, frequency))
      }
      if (scale !== 'pitagoric') {
        for (let j = 0; j < keyboard[1][i].length; j++) {
          const frequency = keyboard[1][i][j]
          map.set(frequency, minBufferSize(audioCtxSampleRate, frequency))
        }
        if (keyboard.length === 3) {
          for (let j = 0; j < keyboard[2][i].length; j++) {
            const frequency = keyboard[2][i][j]
            map.set(frequency, minBufferSize(audioCtxSampleRate, frequency))
          }
        }
      }
    }
    return map
  }, [audioCtxSampleRate, keyboard, scale])
}

export default useMinBufferSizeMap
