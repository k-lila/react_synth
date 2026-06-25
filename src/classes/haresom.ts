/**
 * Toca e para uma nota com um `OscillatorNode` nativo da Web Audio, dado o timbre já
 * compilado num `PeriodicWave` (tipicamente vindo de {@link HareOm}).
 *
 * @remarks Reprodução da rota do **oscilador nativo**, motor de áudio **em produção**. O
 *   timbre (`PeriodicWave`) é reutilizável e independe da nota; cada toque varia apenas a
 *   frequência. Coerente com o ciclo de vida da Web Audio, o `OscillatorNode` é
 *   **descartável**: criado em {@link play}, parado e desconectado em {@link stop}. Voz
 *   **monofônica** (uma nota por instância); acordes/polifonia = várias instâncias (o
 *   {@link useHareSynth} mantém uma por `keyid`).
 *
 *   Classe pura de Web Audio: não conhece Redux nem o estado `keyboardkeys.playing` — essa
 *   fiação pertence a um hook que consuma esta classe (ver {@link useHareSynth}).
 * @see ADR-0003 — síntese por oscilador nativo (substitui o ADR-0001)
 * @see {@link HareOm} — compila o {@link WaveRecipe} no `PeriodicWave` que esta classe toca.
 */
class HareSom {
  audioCtx: BaseAudioContext
  /** Timbre a tocar; aplicado no oscilador do próximo {@link play}. */
  wave: PeriodicWave
  /** Amplitude de pico do envelope (0–1); padrão 0.5 para evitar clipping. */
  gain: number
  /** Duração do attack, em segundos (rampa linear de 0 ao `gain`). */
  attack: number
  /** Duração do release, em segundos (rampa linear do `gain` a 0). */
  release: number
  private osc: OscillatorNode | null
  private gainNode: GainNode | null

  /**
   * @param audioCtx - contexto de áudio que fabrica oscilador e ganho
   * @param wave - timbre a tocar (um `PeriodicWave`, ex.: de {@link HareOm.toPeriodicWave})
   * @param options - `gain` (pico, 0–1; padrão 0.5), `attack` e `release` em segundos
   *   (padrão 0.01 cada), o envelope de rampa linear da voz
   */
  constructor(
    audioCtx: BaseAudioContext,
    wave: PeriodicWave,
    options: { gain?: number; attack?: number; release?: number } = {}
  ) {
    this.audioCtx = audioCtx
    this.wave = wave
    this.gain = options.gain ?? 0.5
    this.attack = options.attack ?? 0.01
    this.release = options.release ?? 0.01
    this.osc = null
    this.gainNode = null
  }

  /**
   * Troca o timbre tocado, **inclusive de uma nota em andamento**.
   *
   * @param wave - novo `PeriodicWave`
   * @remarks Se houver oscilador tocando, aplica o novo timbre na hora
   *   (`OscillatorNode.setPeriodicWave`, contínuo em fase); senão, vale a partir do próximo
   *   {@link play}. É a base da modulação de timbre ao vivo orquestrada por
   *   {@link useHareSynth} ao arrastar um slider.
   */
  setWave(wave: PeriodicWave) {
    this.wave = wave
    if (this.osc) this.osc.setPeriodicWave(wave)
  }

  /**
   * Ajusta o ganho de pico, **inclusive de uma nota em andamento**.
   *
   * @param gain - novo pico do envelope (0–1)
   * @remarks Se houver nota soando, faz uma rampa curta (~0.02s) do valor corrente ao novo
   *   `gain`, evitando clique; senão, só atualiza o alvo do próximo {@link play}. Não altera
   *   `attack`/`release`. Base da modulação de volume ao vivo (ver {@link useHareSynth}).
   */
  setGain(gain: number) {
    this.gain = gain
    if (!this.gainNode) return
    const now = this.audioCtx.currentTime
    this.gainNode.gain.cancelScheduledValues(now)
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now)
    this.gainNode.gain.linearRampToValueAtTime(gain, now + 0.02)
  }

  /**
   * Dispara a nota: cria oscilador + ganho, aplica o timbre e a frequência, sobe o attack
   * e começa a tocar.
   *
   * @param frequency - altura da nota, em Hz
   * @remarks Ignora a chamada se já houver uma nota ativa (monofônico). O oscilador criado
   *   é dedicado a este toque e descartado em {@link stop}.
   */
  play(frequency: number) {
    if (this.osc) return
    const osc = this.audioCtx.createOscillator()
    const gainNode = this.audioCtx.createGain()
    osc.setPeriodicWave(this.wave)
    osc.frequency.value = frequency
    const now = this.audioCtx.currentTime
    gainNode.gain.cancelScheduledValues(now)
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(this.gain, now + this.attack)
    osc.connect(gainNode)
    gainNode.connect(this.audioCtx.destination)
    this.osc = osc
    this.gainNode = gainNode
    osc.start()
  }

  /**
   * Encerra a nota ativa: desce o release e agenda o descarte do oscilador.
   *
   * @remarks Não faz nada se nada estiver tocando. O `OscillatorNode` é parado em
   *   `now + release` e desconectado no seu `onended`; depois desta chamada a instância
   *   volta a aceitar um novo {@link play}.
   */
  stop() {
    const osc = this.osc
    const gainNode = this.gainNode
    if (!osc || !gainNode) return
    this.osc = null
    this.gainNode = null
    const now = this.audioCtx.currentTime
    gainNode.gain.cancelScheduledValues(now)
    gainNode.gain.setValueAtTime(gainNode.gain.value, now)
    gainNode.gain.linearRampToValueAtTime(0, now + this.release)
    osc.stop(now + this.release)
    osc.onended = () => {
      osc.disconnect()
      gainNode.disconnect()
    }
  }
}

export default HareSom
