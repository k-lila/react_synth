/**
 * Calcula um buffer de **ciclos inteiros** para uma frequência, de modo que o PCM
 * possa tocar em loop sem cliques nas bordas.
 *
 * @param samplerate - taxa de amostragem, em Hz
 * @param pitch - frequência da nota, em Hz
 * @returns `buffersize` (nº de amostras, arredondado) e `num` (nº de períodos
 *   contidos no buffer)
 * @remarks Busca o nº de ciclos que minimiza a parte fracionária do período em
 *   amostras; para assim que a fração fica < 0.01 ou ao atingir 25 ciclos.
 */
const minBufferSize = (
  samplerate: number,
  pitch: number
): { buffersize: number; num: number } => {
  const oscilationFrameSize = samplerate / pitch
  let counter = 1
  let bestCounter = counter
  let minFractionalPart = 1
  while (counter < pitch * 2) {
    const fractionalPart = (oscilationFrameSize * counter) % 1
    if (fractionalPart < minFractionalPart) {
      minFractionalPart = fractionalPart
      bestCounter = counter
    }
    if (minFractionalPart < 0.01 || counter === 25) break
    counter++
  }
  const bufferSize = Math.round(oscilationFrameSize * bestCounter)
  return { buffersize: bufferSize, num: bestCounter }
}

export default minBufferSize
