/**
 * Compila um {@link WaveRecipe} nos coeficientes de Fourier de um oscilador nativo
 * (`real`/`imag` de um `PeriodicWave` da Web Audio), em vez de materializar PCM.
 *
 * @remarks Cada parcial `i` do recipe vira o harmônico `(i+1)×fundamental`; o tipo
 *   (`sin`/`square`/`saw`/`tri`) é expandido em sua **série de Fourier ideal
 *   band-limited** — logo `square`/`saw`/`tri` saem sem aliasing (mais limpos que os
 *   geradores de {@link FundamentalWave}). O timbre é independente da frequência: o
 *   mesmo `PeriodicWave` serve qualquer nota, bastando ao oscilador variar a frequência.
 *   Fluxo: configure com {@link setRecipe}, obtenha o núcleo puro com
 *   {@link toCoefficients} (testável sem Web Audio) ou o objeto nativo com
 *   {@link toPeriodicWave}.
 * @see ADR-0003 — síntese por oscilador nativo (substitui o ADR-0001); esta classe
 *   é o compilador de timbre **em produção**, consumido por {@link useHareSynth}.
 * @see {@link HareSom} — toca o `PeriodicWave` que esta classe compila.
 */
class HareOm {
  recipe: WaveRecipe
  maxHarmonics: number
  /** Amplitude do harmônico `k` do tipo-base (0 se ausente); tipo desconhecido → `sin`. */
  generators: Record<string, (k: number) => number>

  /**
   * @param recipe - timbre a compilar (um {@link WaveRecipe})
   * @param maxHarmonics - teto de harmônicos do espectro; o motor ainda corta acima de
   *   Nyquist por nota. Padrão 2048, suficiente para qualquer fundamental audível.
   */
  constructor(recipe: WaveRecipe, maxHarmonics = 2048) {
    this.recipe = recipe
    this.maxHarmonics = maxHarmonics
    this.generators = {
      sin: (k) => (k === 1 ? 1 : 0),
      square: (k) => (k % 2 === 1 ? 4 / Math.PI / k : 0),
      saw: (k) => ((-1) ** (k + 1) * 2) / Math.PI / k,
      tri: (k) =>
        k % 2 === 1 ? ((-1) ** ((k - 1) / 2) * 8) / Math.PI ** 2 / k ** 2 : 0
    }
  }

  /**
   * Troca o timbre compilado.
   *
   * @param recipe - novo {@link WaveRecipe}
   */
  setRecipe(recipe: WaveRecipe) {
    this.recipe = recipe
  }

  /**
   * Compila o recipe nos coeficientes de Fourier do `PeriodicWave`.
   *
   * @returns `real` (cossenos) e `imag` (senos), ambos com `maxHarmonics + 1` posições;
   *   índice 0 é o DC (sempre 0) e o índice `n` é o harmônico `n` da fundamental
   * @remarks Núcleo puro, sem Web Audio. Convenção: uma componente
   *   `A·sin(2π n t + θ)` entra como `real[n] += A·sin θ` e `imag[n] += A·cos θ`. A fase
   *   global desloca o harmônico `n` por `n·phase`; a fase do parcial, por `k·phases[i]`.
   */
  toCoefficients(): { real: Float32Array; imag: Float32Array } {
    const real = new Float32Array(this.maxHarmonics + 1)
    const imag = new Float32Array(this.maxHarmonics + 1)
    const { type, gain, phase, amplitudes, phases } = this.recipe
    const base = this.generators[type] ?? this.generators.sin

    for (let i = 0; i < amplitudes.length; i++) {
      const m = i + 1
      const a = amplitudes[i]
      const partialPhase = phases[i]
      for (let k = 1; k * m <= this.maxHarmonics; k++) {
        const c = base(k)
        if (c === 0) continue
        const n = k * m
        const amp = gain * a * c
        const theta = 2 * Math.PI * (phase * n + partialPhase * k)
        real[n] += amp * Math.sin(theta)
        imag[n] += amp * Math.cos(theta)
      }
    }
    return { real, imag }
  }

  /**
   * Empacota os coeficientes num `PeriodicWave` nativo, pronto para
   * `OscillatorNode.setPeriodicWave`.
   *
   * @param audioCtx - contexto de áudio que fabrica o `PeriodicWave`
   * @param disableNormalization - se `true`, preserva as amplitudes; se `false` (padrão),
   *   o motor normaliza o pico da onda para ~1
   * @returns o `PeriodicWave` correspondente ao timbre
   * @remarks Única chamada Web Audio da classe; não produz som (o `PeriodicWave` é só a
   *   forma de onda que um oscilador consome depois).
   */
  toPeriodicWave(
    audioCtx: BaseAudioContext,
    disableNormalization = false
  ): PeriodicWave {
    const { real, imag } = this.toCoefficients()
    return audioCtx.createPeriodicWave(real, imag, { disableNormalization })
  }
}

export default HareOm
