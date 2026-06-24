/**
 * Síntese aditiva de uma onda periódica pela soma de parciais (série de Fourier).
 *
 * Fluxo de uso: configure os parciais com {@link setIntensities} e {@link setPhases},
 * garanta ciclos inteiros com {@link setMinBufferSize}, gere o contexto de um tipo de
 * onda com {@link createContext} e obtenha o PCM final com {@link getWave}.
 *
 * @remarks O parcial de índice `i` corresponde ao harmônico de frequência
 *   `(i + 1) × fundamental` — ver o multiplicador aplicado em {@link createContext}.
 */
class FundamentalWave {
  samplerate: number
  intensities: number[]
  phases: number[]
  wavelist: number[][]
  minbuffersize: { minbuffer: number; num: number }
  generators: Record<
    string,
    (intensity: number, phase: number, multiplier: number) => number[]
  >
  constructor(samplerate: number) {
    this.samplerate = samplerate
    this.intensities = [1]
    this.phases = [1]
    this.wavelist = []
    this.minbuffersize = { minbuffer: this.samplerate, num: 1 }
    this.generators = {
      sin: this.createSin.bind(this),
      square: this.createSquare.bind(this),
      saw: this.createSawTooth.bind(this),
      tri: this.createTriangle.bind(this)
    }
  }

  /**
   * Define a amplitude de cada parcial (índice `i` = harmônico `(i+1)×fundamental`).
   *
   * @param intensities - amplitudes dos parciais, em paralelo com {@link setPhases}
   */
  setIntensities(intensities: number[]) {
    this.intensities = intensities
  }

  /**
   * Define a fase de cada parcial.
   *
   * @param phases - fases em frações de ciclo (0–1), paralelo a {@link setIntensities}
   */
  setPhases(phases: number[]) {
    this.phases = phases
  }

  /**
   * Fixa o tamanho do buffer de um ciclo, garantindo ciclos inteiros para loop sem cliques.
   *
   * @param buffersize - nº de amostras de um período da fundamental
   * @param num - quantos períodos da fundamental cabem no buffer
   */
  setMinBufferSize(buffersize: number, num: number) {
    this.minbuffersize = { minbuffer: buffersize, num: num }
  }

  private rotate(arr: number[], phase: number): number[] {
    const phaseNum = Math.floor(arr.length * phase)
    return [...arr.slice(phaseNum), ...arr.slice(0, phaseNum)]
  }

  /**
   * Gera um período senoidal do parcial.
   *
   * @param intensity - amplitude do parcial
   * @param phase - deslocamento de fase em frações de ciclo (0–1)
   * @param multiplier - multiplicador de frequência do parcial (harmônico `i+1`)
   * @returns as amostras de um ciclo
   */
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

  /**
   * Gera um período de onda quadrada, derivando o sinal de uma senoide.
   *
   * @returns as amostras de um ciclo
   * @see {@link createSin} para a semântica dos parâmetros
   */
  createSquare(intensity: number, phase: number, multiplier: number): number[] {
    const sin = this.createSin(1, phase, multiplier)
    const num_list = sin.map((m) => {
      const square = m >= 0 ? 1 : -1
      return square * intensity
    })
    return num_list
  }

  /**
   * Gera um período de onda dente de serra.
   *
   * @returns as amostras de um ciclo, já deslocadas pela fase
   * @see {@link createSin} para a semântica dos parâmetros
   */
  createSawTooth(
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
    return this.rotate(num_list, phase)
  }

  /**
   * Gera um período de onda triangular.
   *
   * @returns as amostras de um ciclo, já deslocadas pela fase
   * @see {@link createSin} para a semântica dos parâmetros
   */
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
    return this.rotate(num_list, phase)
  }

  private buildContext(
    generator: (intensity: number, phase: number, multiplier: number) => number[]
  ) {
    this.wavelist = this.intensities.map((m, i) => {
      return generator(m, this.phases[i], i + 1)
    })
  }

  /**
   * Gera os parciais (`wavelist`) para um tipo de onda, um por amplitude/fase configurada.
   *
   * @param typewave - `sin` | `square` | `saw` | `tri`; tipo desconhecido cai em `sin`
   */
  createContext(typewave: string) {
    this.buildContext(this.generators[typewave] ?? this.generators.sin)
  }

  /**
   * Soma todos os parciais já gerados em `wavelist` num único ciclo PCM e
   * desloca a fase global da onda resultante.
   *
   * @param gain - amplitude global aplicada ao somatório (0–1)
   * @param phase - deslocamento de fase em frações de ciclo (0–1; 0.5 = meio ciclo)
   * @returns um período da onda; array vazio se nenhum contexto foi gerado
   * @remarks Requer {@link createContext} antes; sem ele, `wavelist` está vazia.
   */
  getWave(gain: number, phase: number): number[] {
    const wave: number[] = []
    if (this.wavelist.length > 0) {
      const harmonic_wave = new Array(this.wavelist[0].length).fill(0)
      for (let i = 0; i < this.wavelist.length; i++) {
        for (let j = 0; j < harmonic_wave.length; j++) {
          harmonic_wave[j] += this.wavelist[i][j]
        }
      }
      const len = harmonic_wave.length
      const phaseNum = Math.floor(len * phase)
      for (let j = 0; j < len; j++) {
        wave[j] = harmonic_wave[(j + phaseNum) % len] * gain
      }
    }
    return wave
  }
}

export default FundamentalWave
