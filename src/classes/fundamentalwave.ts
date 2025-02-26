class FundamentalWave {
  samplerate: number
  intensities: number[]
  phases: number[]
  wavelist: number[][]
  minbuffersize: { minbuffer: number; num: number }
  constructor(samplerate: number) {
    this.samplerate = samplerate
    this.intensities = [1]
    this.phases = [1]
    this.wavelist = []
    this.minbuffersize = { minbuffer: this.samplerate, num: 1 }
  }

  setIntensities(intensities: number[]) {
    return (this.intensities = intensities)
  }

  setPhases(phases: number[]) {
    return (this.phases = phases)
  }

  setMinBufferSize(buffersize: number, num: number) {
    return (this.minbuffersize = { minbuffer: buffersize, num: num })
  }

  createSin(intensity: number, phase: number, multiplier: number): number[] {
    const { minbuffer, num } = this.minbuffersize
    const num_list: number[] = []
    for (let i = 0; i <= minbuffer; i++) {
      const sinPosition =
        Math.sin(
          ((2 * Math.PI * i) / minbuffer) * (num * multiplier) +
            phase * 2 * Math.PI
        ) * intensity
      num_list.push(sinPosition)
    }
    return num_list
  }

  createSquare(intensity: number, phase: number, multiplier: number): number[] {
    const sin = this.createSin(1, phase, multiplier)
    const num_list = sin.map((m) => {
      const square = m >= 0 ? 1 : -1
      return square * intensity
    })
    return num_list
  }

  createSawThooth(
    intensity: number,
    phase: number,
    multiplier: number
  ): number[] {
    const { minbuffer, num } = this.minbuffersize
    const num_list = []
    for (let i = 0; i <= minbuffer; i++) {
      const t = (i / minbuffer) * num * multiplier
      const value = 2 * (t - Math.floor(t + 0.5))
      const thooth = value * intensity
      num_list.push(thooth)
    }
    const phaseNum = Math.floor(num_list.length * phase)
    const sliceA = num_list.slice(0, phaseNum)
    const sliceB = num_list.slice(phaseNum)
    return [...sliceB, ...sliceA]
  }

  createTriangle(
    intensity: number,
    phase: number,
    multiplier: number
  ): number[] {
    const { minbuffer, num } = this.minbuffersize
    const num_list = []
    for (let i = 0; i <= minbuffer; i++) {
      const t = (i / minbuffer) * num * multiplier + 0.25
      const value = 2 * Math.abs(2 * (t - Math.floor(t + 0.5))) - 1
      const thooth = value * intensity
      num_list.push(thooth)
    }
    const phaseNum = Math.floor(num_list.length * phase)
    const sliceA = num_list.slice(0, phaseNum)
    const sliceB = num_list.slice(phaseNum)
    return [...sliceB, ...sliceA]
  }

  createSinContext() {
    const waveList = this.intensities.map((m, i) => {
      return this.createSin(m, this.phases[i], i + 1)
    })
    this.wavelist = waveList
  }

  createSquareContext() {
    const waveList = this.intensities.map((m, i) => {
      return this.createSquare(m, this.phases[i], i + 1)
    })
    this.wavelist = waveList
  }

  createSawThoothContext() {
    const waveList = this.intensities.map((m, i) => {
      return this.createSawThooth(m, this.phases[i], i + 1)
    })
    this.wavelist = waveList
  }

  createTriangleContext() {
    const waveList = this.intensities.map((m, i) => {
      return this.createTriangle(m, this.phases[i], i + 1)
    })
    this.wavelist = waveList
  }

  createContext(typewave: string) {
    switch (typewave) {
      case 'sin':
        this.createSinContext()
        break
      case 'square':
        this.createSquareContext()
        break
      case 'saw':
        this.createSawThoothContext()
        break
      case 'tri':
        this.createTriangleContext()
        break
      default:
        this.createSinContext()
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
