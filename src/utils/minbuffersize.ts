import getSingleOscilationSize from './getsingleoscilationsize'

const minBufferSize = (
  samplerate: number,
  pitch: number
): { buffersize: number; num: number } => {
  const oscilationFrameSize = getSingleOscilationSize(samplerate, pitch)
  let counter = 1
  let trash = (oscilationFrameSize * counter) % 1
  while (trash > 0.01) {
    if (counter >= pitch * 2) {
      break
    }
    counter++
    trash = (oscilationFrameSize * counter) % 1
  }
  let bufferSize = oscilationFrameSize * counter
  const diff = bufferSize - Math.floor(bufferSize)
  if (diff * 100 > 5) {
    bufferSize = Math.floor(oscilationFrameSize * counter) + 1
  } else {
    bufferSize = Math.floor(oscilationFrameSize * counter)
  }
  return { buffersize: bufferSize, num: counter }
}

export default minBufferSize
