import { useMemo } from 'react'
import minBufferSize from '../utils/minbuffersize'

/**
 * Indexa, por frequência, o tamanho de buffer de ciclos inteiros de cada nota
 * tocável — insumo da pré-renderização em {@link useSynth}.
 *
 * @param audioCtxSampleRate - taxa de amostragem do `AudioContext`, em Hz
 * @param keyboard - frequências por escala/oitava (`[escala][oitava][nota]`)
 * @param scale - escala ativa; quando `pitagoric`, ignora os planos não-naturais
 * @param octaves - `[início, fim]` inclusivo das oitavas a mapear
 * @returns um `Map` de frequência (Hz) para `{ buffersize, num }` (ver {@link minBufferSize})
 */
function useMinBufferSizeMap(
  audioCtxSampleRate: number,
  keyboard: number[][][],
  scale: string,
  octaves: number[]
) {
  return useMemo(() => {
    const map = new Map<number, { buffersize: number; num: number }>()
    for (let i = octaves[0]; i <= octaves[1]; i++) {
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
  }, [audioCtxSampleRate, keyboard, scale, octaves])
}

export default useMinBufferSizeMap
