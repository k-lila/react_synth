import minBufferSize from '../utils/minbuffersize'

class FundamentalWave {
  samplerate: number
  intensities: number[]
  phases: number[]
  wavelist: number[][]
  constructor(samplerate: number) {
    this.samplerate = samplerate
    this.intensities = [1]
    this.phases = [1]
    this.wavelist = []
  }

  setIntensities(intensities: number[]) {
    return (this.intensities = intensities)
  }

  setPhases(phases: number[]) {
    return (this.phases = phases)
  }

  createSin(
    pitch: number,
    intensity: number,
    phase: number,
    multiplier: number
  ): number[] {
    const { buffersize, num } = minBufferSize(this.samplerate, pitch)
    const num_list: number[] = []
    for (let i = 0; i <= buffersize; i++) {
      const sinPosition =
        Math.sin(
          ((2 * Math.PI * i) / buffersize) * (num * multiplier) +
            phase * 2 * Math.PI
        ) * intensity
      num_list.push(sinPosition)
    }
    return num_list
  }

  createSquare(
    pitch: number,
    intensity: number,
    phase: number,
    multiplier: number
  ): number[] {
    const sin = this.createSin(pitch, 1, phase, multiplier)
    const num_list = sin.map((m) => {
      const square = m >= 0 ? 1 : -1
      return square * intensity
    })
    return num_list
  }

  createSawThooth(
    pitch: number,
    intensity: number,
    phase: number,
    multiplier: number
  ): number[] {
    const { buffersize, num } = minBufferSize(this.samplerate, pitch)
    const num_list = []
    for (let i = 0; i <= buffersize; i++) {
      const t = (i / this.samplerate) * num * multiplier
      const value = 2 * (t * pitch - Math.floor(t * pitch + 0.5))
      const thooth = value * intensity
      num_list.push(thooth)
    }
    const phaseNum = Math.floor(num_list.length * phase)
    const sliceA = num_list.slice(0, phaseNum)
    const sliceB = num_list.slice(phaseNum)
    return [...sliceB, ...sliceA]
  }

  createTriangle(
    pitch: number,
    intensity: number,
    phase: number,
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
    const phaseNum = Math.floor(num_list.length * phase)
    const sliceA = num_list.slice(0, phaseNum)
    const sliceB = num_list.slice(phaseNum)
    return [...sliceB, ...sliceA]
  }

  createSinContext(pitch: number) {
    const waveList = this.intensities.map((m, i) => {
      return this.createSin(pitch, m, this.phases[i], i + 1)
    })
    this.wavelist = waveList
  }

  createSquareContext(pitch: number) {
    const waveList = this.intensities.map((m, i) => {
      return this.createSquare(pitch, m, this.phases[i], i + 1)
    })
    this.wavelist = waveList
  }

  createSawThoothContext(pitch: number) {
    const waveList = this.intensities.map((m, i) => {
      return this.createSawThooth(pitch, m, this.phases[i], i + 1)
    })
    this.wavelist = waveList
  }

  createTriangleContext(pitch: number) {
    const waveList = this.intensities.map((m, i) => {
      return this.createTriangle(pitch, m, this.phases[i], i + 1)
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

  getWave(gain: number, phase: number): number[] {
    let wave: number[] = []
    if (this.wavelist.length > 0) {
      const harmonic_wave = new Array(this.wavelist[0].length).fill(0)
      for (let i = 0; i < this.wavelist.length; i++) {
        for (let j = 0; j < harmonic_wave.length; j++) {
          harmonic_wave[j] += this.wavelist[i][j]
        }
      }
      const phaseNum = Math.floor(harmonic_wave.length * phase)
      const sliceA = harmonic_wave.slice(0, phaseNum)
      const sliceB = harmonic_wave.slice(phaseNum)
      wave = [...sliceB, ...sliceA]
    }
    return wave.map((m) => m * gain)
  }
}

export default FundamentalWave
