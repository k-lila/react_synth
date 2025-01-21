const getSingleOscilationSize = (samplerate: number, pitch: number): number => {
  const num = samplerate / pitch
  return num
}

export default getSingleOscilationSize
