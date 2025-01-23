import minBufferSize from "../utils/minbuffersize"

class FundamentalWave {
  samplerate: number
  intensities: number[]
  wavelist: number[][]
  wave: number[]
  constructor(samplerate: number) {
    this.samplerate = samplerate
    this.intensities = [1]
    this.wavelist = []
    this.wave = []
  }

  setIntensities(intensities: number[]) {
    return this.intensities = intensities
  }

  createSin(pitch: number, intensity: number, multiplier: number) {
    const { buffersize, num } = minBufferSize(this.samplerate, pitch)
    console.log(buffersize, num)
    const num_list: number[] = []
    for (let i = 0; i <= buffersize; i++) {
      const sinPosition = Math.sin(((2 * Math.PI * i) / buffersize) * (num * multiplier)) * intensity
      num_list.push(sinPosition)
    }
    return num_list
  }

  createSinContext(pitch: number) {
    const waveList = this.intensities.map((m, i) => {
      return this.createSin(pitch, m,  i + 1)
    })
    this.wavelist = waveList
  }

  getWave() {
    if (this.wavelist.length > 0) {
      const wave = this.wavelist[0]
      for (let i = 1; i < this.wavelist.length; i++) {
        for (let j=0; j < wave.length; j++) {
          wave[j] += this.wavelist[i][j]
        }
      }
      const diff = (Math.max(...wave) - Math.min(...wave)) / 2
      const wave2 = wave.map((m) => m / diff)
      return wave2
    }
  }

  getVisualization() {
    const visualization = new FundamentalWave(1000)
    visualization.setIntensities(this.intensities)
    visualization.createSinContext(1)
    return visualization.getWave()
  }

}

export default FundamentalWave
