import { useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootReducer } from '../store'
import {
  addPlayingKey,
  removePlayingKey
} from '../store/reducers/keyboardkeys'
import HareOm from '../classes/hareom'
import HareSom from '../classes/haresom'

const MAX_HARMONICS = 2048

/**
 * Orquestra a rota do **oscilador nativo**: compila a `recipe` num único `PeriodicWave`
 * (via {@link HareOm}) e toca/para notas polifônicas com vozes {@link HareSom}.
 *
 * @returns `audioCtx` próprio do motor e `play(frequency, keyid)` / `stop(keyid)`:
 *   `play` dispara a nota `frequency` (Hz) e marca `keyid` em `keyboardkeys.playing`;
 *   `stop` solta e descarta a voz daquele `keyid`. `play` ignora um `keyid` já tocando.
 * @remarks **Motor de áudio do app** (ADR-0003): o timbre (`PeriodicWave`) é recompilado só
 *   quando `recipe.waves` muda (`useMemo`) — os `waves[]` são **somados** num só espectro
 *   (cada um compilado por um {@link HareOm}; agregar `waves[]` é justamente o que o `HareOm`
 *   deixou para o orquestrador). Cada tecla pressionada instancia uma voz monofônica
 *   {@link HareSom}, descartada no `stop`; **polifonia = uma `HareSom` por `keyid`**. Reflete
 *   o efeito em `keyboardkeys.playing`. Mudanças de `recipe.waves` (timbre) e `recipe.gain`
 *   (volume) são **propagadas às vozes já soando** (modulação ao vivo, ver ADR-0004): o novo
 *   `PeriodicWave`/ganho entra na nota em andamento, não só no próximo `play`.
 *
 *   Dono do único `AudioContext`, instanciado uma vez no `PianoKeyboard` e com `play`/`stop`
 *   distribuídos a todas as teclas (brancas e pretas). As frequências de cada tecla vêm do
 *   {@link useKeyboardLayout}.
 * @see ADR-0003 — síntese por oscilador nativo (substitui o ADR-0001)
 * @see {@link HareOm} — timbre · {@link HareSom} — reprodução
 */
function useHareSynth() {
  const waves = useSelector((state: RootReducer) => state.recipe.waves)
  const gain = useSelector((state: RootReducer) => state.recipe.gain)
  const dispatch = useDispatch()

  const audioCtxRef = useRef<AudioContext | null>(null)
  if (!audioCtxRef.current) {
    audioCtxRef.current = new AudioContext()
  }
  const audioCtx = audioCtxRef.current

  // soma os coeficientes de Fourier de cada wave[] num único espectro e empacota num
  // PeriodicWave; só recompila quando o timbre (waves) muda. A normalização padrão do
  // PeriodicWave neutraliza o gain absoluto — o volume vem do GainNode em cada HareSom.
  const wave = useMemo(() => {
    const real = new Float32Array(MAX_HARMONICS + 1)
    const imag = new Float32Array(MAX_HARMONICS + 1)
    for (const w of waves) {
      const c = new HareOm(w, MAX_HARMONICS).toCoefficients()
      for (let n = 0; n <= MAX_HARMONICS; n++) {
        real[n] += c.real[n]
        imag[n] += c.imag[n]
      }
    }
    return audioCtx.createPeriodicWave(real, imag)
  }, [waves, audioCtx])

  // pool de vozes ativas, uma por keyid (cada HareSom é monofônica → polifonia = N vozes)
  const voicesRef = useRef<Map<number, HareSom>>(new Map())

  // modulação ao vivo: recompilar o timbre / mudar o volume propaga às notas já soando
  useEffect(() => {
    for (const voz of voicesRef.current.values()) voz.setWave(wave)
  }, [wave])
  useEffect(() => {
    for (const voz of voicesRef.current.values()) voz.setGain(gain * 0.5)
  }, [gain])

  const play = (frequency: number, keyid: number) => {
    if (voicesRef.current.has(keyid)) return
    // gain * 0.5: teto anti-clipping ao somar harmônicos
    const voz = new HareSom(audioCtx, wave, { gain: gain * 0.5 })
    voicesRef.current.set(keyid, voz)
    voz.play(frequency)
    dispatch(addPlayingKey({ keyid }))
  }

  const stop = (keyid: number) => {
    const voz = voicesRef.current.get(keyid)
    if (!voz) return
    voicesRef.current.delete(keyid)
    voz.stop()
    dispatch(removePlayingKey({ keyid }))
  }

  return { audioCtx, play, stop }
}

export default useHareSynth
