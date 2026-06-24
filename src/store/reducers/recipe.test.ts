import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import reducer, {
  setPitch,
  setGain,
  setScale,
  setWaveGain,
  setWavePhase,
  setWaveType,
  adjustGain,
  adjustPhase,
  addHarmonic,
  removeHarmonic,
  addFundamental,
  removeFundamental
} from './recipe'

const initial: SynthRecipe = {
  pitch: 440,
  gain: 0.75,
  scale: 'chromatic',
  octaves: [3, 4],
  waves: [
    {
      type: 'sin',
      gain: 0.9,
      phase: 0,
      amplitudes: [0.66, -0.33, 0, -0.2, 0, 0.1],
      phases: [0, 0, 0, 0.5, 0, 0]
    }
  ]
}

// estado de partida com 2 ondas para testar isolamento de índice
const dois: SynthRecipe = {
  ...initial,
  waves: [
    { type: 'sin', gain: 0.9, phase: 0, amplitudes: [1, 0.5], phases: [0, 0] },
    {
      type: 'square',
      gain: 0.5,
      phase: 0.2,
      amplitudes: [0.3, 0.2, 0.1],
      phases: [0.1, 0.2, 0.3]
    }
  ]
}

const clone = (s: SynthRecipe): SynthRecipe =>
  JSON.parse(JSON.stringify(s)) as SynthRecipe

describe('recipe reducer', () => {
  // RECIPE-AC-01
  it('RECIPE-AC-01: setPitch/setGain/setScale setam o campo e não tocam waves', () => {
    const p = reducer(initial, setPitch(220))
    expect(p.pitch).toBe(220)
    expect(p.waves).toEqual(initial.waves)

    const g = reducer(initial, setGain(0.5))
    expect(g.gain).toBe(0.5)
    expect(g.waves).toEqual(initial.waves)

    const s = reducer(initial, setScale('natural'))
    expect(s.scale).toBe('natural')
    expect(s.waves).toEqual(initial.waves)
  })

  // RECIPE-AC-02
  it('RECIPE-AC-02: setWaveGain/setWavePhase/setWaveType alteram só a onda do índice alvo', () => {
    const g = reducer(dois, setWaveGain({ waveid: 1, gain: 0.42 }))
    expect(g.waves[1].gain).toBe(0.42)
    expect(g.waves[0]).toEqual(dois.waves[0])

    const ph = reducer(dois, setWavePhase({ waveid: 0, phase: 0.7 }))
    expect(ph.waves[0].phase).toBe(0.7)
    expect(ph.waves[1]).toEqual(dois.waves[1])

    const ty = reducer(dois, setWaveType({ id: 1, type: 'tri' }))
    expect(ty.waves[1].type).toBe('tri')
    expect(ty.waves[0]).toEqual(dois.waves[0])
  })

  // RECIPE-AC-03
  it('RECIPE-AC-03: adjustGain altera só amplitudes[j] do waveindex', () => {
    const r = reducer(
      dois,
      adjustGain({ waveindex: 1, amplitudeindex: 2, gain: 0.99 })
    )
    expect(r.waves[1].amplitudes).toEqual([0.3, 0.2, 0.99])
    expect(r.waves[1].phases).toEqual(dois.waves[1].phases)
    expect(r.waves[0]).toEqual(dois.waves[0])
  })

  // RECIPE-AC-04
  it('RECIPE-AC-04: adjustPhase altera só phases[j] do waveindex', () => {
    const r = reducer(
      dois,
      adjustPhase({ waveindex: 1, phaseindex: 0, phase: 0.88 })
    )
    expect(r.waves[1].phases).toEqual([0.88, 0.2, 0.3])
    expect(r.waves[1].amplitudes).toEqual(dois.waves[1].amplitudes)
    expect(r.waves[0]).toEqual(dois.waves[0])
  })

  // RECIPE-AC-05
  it('RECIPE-AC-05: addHarmonic acrescenta amp=1/(len+1) (len antes) e phase 0; ambos crescem 1 e ficam pareados', () => {
    const lenAntes = initial.waves[0].amplitudes.length
    const r = reducer(initial, addHarmonic(0))
    expect(r.waves[0].amplitudes).toHaveLength(lenAntes + 1)
    expect(r.waves[0].phases).toHaveLength(lenAntes + 1)
    expect(r.waves[0].amplitudes[lenAntes]).toBe(1 / (lenAntes + 1))
    expect(r.waves[0].phases[lenAntes]).toBe(0)
    expect(r.waves[0].amplitudes.length).toBe(r.waves[0].phases.length)
  })

  // RECIPE-AC-06
  it('RECIPE-AC-06: removeHarmonic remove o último de amplitudes E phases juntos, exceto se length===1 (guarda)', () => {
    const r = reducer(dois, removeHarmonic(1))
    expect(r.waves[1].amplitudes).toEqual([0.3, 0.2])
    expect(r.waves[1].phases).toEqual([0.1, 0.2])
    expect(r.waves[0]).toEqual(dois.waves[0])

    // guarda: onda com 1 amplitude permanece inalterada
    const umAmp: SynthRecipe = {
      ...initial,
      waves: [
        { type: 'sin', gain: 1, phase: 0, amplitudes: [0.5], phases: [0] }
      ]
    }
    const guard = reducer(umAmp, removeHarmonic(0))
    expect(guard.waves[0].amplitudes).toEqual([0.5])
    expect(guard.waves[0].phases).toEqual([0])
  })

  // RECIPE-AC-07
  it('RECIPE-AC-07: addFundamental acrescenta onda sin gain1 phase0 amplitudes[1] phases[0]', () => {
    const r = reducer(initial, addFundamental())
    expect(r.waves).toHaveLength(initial.waves.length + 1)
    expect(r.waves[r.waves.length - 1]).toEqual({
      type: 'sin',
      gain: 1,
      phase: 0,
      amplitudes: [1],
      phases: [0]
    })
    expect(r.waves[0]).toEqual(initial.waves[0])
  })

  // RECIPE-AC-08
  it('RECIPE-AC-08: removeFundamental remove o índice exceto se resta 1 onda (guarda)', () => {
    const r = reducer(dois, removeFundamental(0))
    expect(r.waves).toHaveLength(1)
    expect(r.waves[0]).toEqual(dois.waves[1])

    // guarda: com 1 onda, removeFundamental não altera nada
    const guard = reducer(initial, removeFundamental(0))
    expect(guard.waves).toHaveLength(1)
    expect(guard.waves[0]).toEqual(initial.waves[0])
  })

  // RECIPE-AC-09
  it('RECIPE-AC-09: índice fora de faixa não altera nada nem lança', () => {
    expect(() => reducer(dois, setWaveGain({ waveid: 99, gain: 1 }))).not.toThrow()
    const r = reducer(dois, setWaveGain({ waveid: 99, gain: 1 }))
    expect(r.waves).toEqual(dois.waves)

    const a = reducer(dois, adjustGain({ waveindex: 99, amplitudeindex: 0, gain: 1 }))
    expect(a.waves).toEqual(dois.waves)

    const h = reducer(dois, addHarmonic(99))
    expect(h.waves).toEqual(dois.waves)

    const rem = reducer(dois, removeHarmonic(99))
    expect(rem.waves).toEqual(dois.waves)
  })

  // RECIPE-AC-10 (não-regressão)
  it('RECIPE-AC-10: initialState esperado e imutabilidade (o state anterior não muta)', () => {
    // initialState observado via reducer(undefined, init)
    const state = reducer(undefined, { type: '@@INIT' })
    expect(state).toEqual(initial)

    // imutabilidade: o objeto de entrada não é alterado pelas actions
    const entrada = clone(dois)
    const congelado = clone(dois)
    reducer(entrada, setPitch(111))
    reducer(entrada, addHarmonic(0))
    reducer(entrada, removeFundamental(0))
    expect(entrada).toEqual(congelado)
  })

  // Propriedade: amplitudes.length === phases.length após qualquer sequência add/removeHarmonic
  it('propriedade: amplitudes e phases ficam pareados após qualquer sequência add/removeHarmonic', () => {
    fc.assert(
      fc.property(
        fc.array(fc.boolean(), { minLength: 0, maxLength: 30 }),
        (ops) => {
          let state = clone(initial)
          ops.forEach((add) => {
            state = reducer(state, add ? addHarmonic(0) : removeHarmonic(0))
          })
          expect(state.waves[0].amplitudes.length).toBe(
            state.waves[0].phases.length
          )
          expect(state.waves[0].amplitudes.length).toBeGreaterThanOrEqual(1)
          expect(state.waves.length).toBeGreaterThanOrEqual(1)
        }
      )
    )
  })

  // Propriedade: isolamento do índice -- ondas fora do alvo nunca mudam
  it('propriedade: setWaveGain isola o índice alvo (demais ondas inalteradas)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1 }),
        fc.double({ min: 0, max: 1, noNaN: true }),
        (alvo, gain) => {
          const r = reducer(dois, setWaveGain({ waveid: alvo, gain }))
          r.waves.forEach((w, i) => {
            if (i === alvo) expect(w.gain).toBe(gain)
            else expect(w).toEqual(dois.waves[i])
          })
        }
      )
    )
  })
})
