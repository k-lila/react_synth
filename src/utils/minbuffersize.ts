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
