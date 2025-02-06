import minBufferSize from '../utils/minbuffersize'

class FundamentalWave {
  samplerate: number
  intensities: number[]
  wavelist: number[][]
  constructor(samplerate: number) {
    this.samplerate = samplerate
    this.intensities = [1]
    this.wavelist = []
  }

  setIntensities(intensities: number[]) {
    return (this.intensities = intensities)
  }

  createSin(pitch: number, intensity: number, multiplier: number): number[] {
    const { buffersize, num } = minBufferSize(this.samplerate, pitch)
    const num_list: number[] = []
    for (let i = 0; i <= buffersize; i++) {
      const sinPosition =
        Math.sin(((2 * Math.PI * i) / buffersize) * (num * multiplier)) *
        intensity
      num_list.push(sinPosition)
    }
    return num_list
  }

  createSquare(pitch: number, intensity: number, multiplier: number): number[] {
    const sin = this.createSin(pitch, 1, multiplier)
    const num_list = sin.map((m) => {
      const square = m >= 0 ? 1 : -1
      return square * intensity
    })
    return num_list
  }

  createSawThooth(
    pitch: number,
    intensity: number,
    multiplier: number,
    invert?: boolean
  ): number[] {
    const invertNum = invert ? -1 : 1
    const { buffersize, num } = minBufferSize(this.samplerate, pitch)
    const num_list = []
    for (let i = 0; i <= buffersize; i++) {
      const t = (i / this.samplerate) * num * multiplier
      const value = 2 * (t * pitch - Math.floor(t * pitch + 0.5))
      const thooth = value * intensity * invertNum
      num_list.push(thooth)
    }
    return num_list
  }

  createTriangle(
    pitch: number,
    intensity: number,
    multiplier: number
  ): number[] {
    const { buffersize, num } = minBufferSize(this.samplerate, pitch)
    const num_list = []
    for (let i = 0; i <= buffersize; i++) {
      const t = (i / this.samplerate) * num * multiplier + 0.25 / pitch
      const value =
        2 * Math.abs(2 * (t * pitch - Math.floor(t * pitch + 0.5))) - 1
      const thooth = value * intensity
      num_list.push(thooth)
    }
    return num_list
  }

  createSinContext(pitch: number) {
    const waveList = this.intensities.map((m, i) => {
      return this.createSin(pitch, m, i + 1)
    })
    this.wavelist = waveList
  }

  createSquareContext(pitch: number) {
    const waveList = this.intensities.map((m, i) => {
      return this.createSquare(pitch, m, i + 1)
    })
    this.wavelist = waveList
  }

  createSawThoothContext(pitch: number, invert?: boolean) {
    const waveList = this.intensities.map((m, i) => {
      return this.createSawThooth(pitch, m, i + 1, invert)
    })
    this.wavelist = waveList
  }

  createTriangleContext(pitch: number) {
    const waveList = this.intensities.map((m, i) => {
      return this.createTriangle(pitch, m, i + 1)
    })
    this.wavelist = waveList
  }

  createContext(pitch: number, typewave: string) {
    switch (typewave) {
      case 'sin':
        this.createSinContext(pitch)
        break
      case 'square':
        this.createSquareContext(pitch)
        break
      case 'saw':
        this.createSawThoothContext(pitch)
        break
      case 'tri':
        this.createTriangleContext(pitch)
        break
      default:
        this.createSinContext(pitch)
    }
  }

  getWave(): number[] {
    let wave: number[] = []
    if (this.wavelist.length > 0) {
      const harmonic_wave = new Array(this.wavelist[0].length).fill(0)
      for (let i = 0; i < this.wavelist.length; i++) {
        for (let j = 0; j < harmonic_wave.length; j++) {
          harmonic_wave[j] += this.wavelist[i][j]
        }
      }
      wave = harmonic_wave
    }
    return wave
  }
}

export default FundamentalWave
