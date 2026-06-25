import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import HareOm from './hareom'

// helper: monta um WaveRecipe com defaults sensatos
const makeRecipe = (over: Partial<WaveRecipe> = {}): WaveRecipe => ({
  type: 'sin',
  gain: 1,
  phase: 0,
  amplitudes: [1],
  phases: [0],
  ...over
})

// magnitude do harmônico n: sqrt(real^2 + imag^2)
const mag = (
  c: { real: Float32Array; imag: Float32Array },
  n: number
) => Math.hypot(c.real[n], c.imag[n])

describe('HareOm', () => {
  // HAREOM-AC-01
  it('HAREOM-AC-01: sin com 1 parcial concentra a energia no harmônico 1; DC e resto ~0', () => {
    const h = new HareOm(makeRecipe(), 16)
    const { real, imag } = h.toCoefficients()
    // sin(0) => real=A*sin(0)=0, imag=A*cos(0)=A; A = gain*amp*c = 1
    expect(imag[1]).toBeCloseTo(1, 12)
    expect(real[1]).toBeCloseTo(0, 12)
    expect(real[0]).toBe(0)
    expect(imag[0]).toBe(0)
    for (let n = 2; n <= 16; n++) {
      expect(mag({ real, imag }, n)).toBeCloseTo(0, 12)
    }
  })

  // HAREOM-AC-02
  it('HAREOM-AC-02: comprimento dos arrays = maxHarmonics + 1 e índice 0 (DC) é sempre 0', () => {
    const maxHarmonics = 64
    const h = new HareOm(makeRecipe({ type: 'saw' }), maxHarmonics)
    const { real, imag } = h.toCoefficients()
    expect(real).toHaveLength(maxHarmonics + 1)
    expect(imag).toHaveLength(maxHarmonics + 1)
    expect(real[0]).toBe(0)
    expect(imag[0]).toBe(0)
  })

  // HAREOM-AC-03
  it('HAREOM-AC-03: square tem só harmônicos ímpares (pares ~0) decaindo proporcional a 1/k', () => {
    const h = new HareOm(makeRecipe({ type: 'square' }), 16)
    const c = h.toCoefficients()
    for (let n = 2; n <= 16; n += 2) {
      expect(mag(c, n)).toBeCloseTo(0, 12)
    }
    expect(mag(c, 1)).toBeGreaterThan(0)
    expect(mag(c, 3)).toBeGreaterThan(0)
    // 1/k: razão entre harmônico 1 e 3 é ~3
    expect(mag(c, 1) / mag(c, 3)).toBeCloseTo(3, 6)
  })

  // HAREOM-AC-04
  it('HAREOM-AC-04: tri tem só harmônicos ímpares decaindo proporcional a 1/k^2', () => {
    const h = new HareOm(makeRecipe({ type: 'tri' }), 16)
    const c = h.toCoefficients()
    for (let n = 2; n <= 16; n += 2) {
      expect(mag(c, n)).toBeCloseTo(0, 12)
    }
    // 1/k^2: razão entre harmônico 1 e 3 é ~9
    expect(mag(c, 1) / mag(c, 3)).toBeCloseTo(9, 6)
  })

  // HAREOM-AC-05
  it('HAREOM-AC-05: saw tem todos os harmônicos presentes decaindo proporcional a 1/k', () => {
    const h = new HareOm(makeRecipe({ type: 'saw' }), 16)
    const c = h.toCoefficients()
    for (let n = 1; n <= 16; n++) {
      expect(mag(c, n)).toBeGreaterThan(0)
    }
    expect(mag(c, 1) / mag(c, 2)).toBeCloseTo(2, 6)
    expect(mag(c, 1) / mag(c, 3)).toBeCloseTo(3, 6)
  })

  // HAREOM-AC-06
  it('HAREOM-AC-06: parcial i posiciona a energia nos múltiplos de m = i+1', () => {
    // amplitudes=[0,1] => só o 2o parcial (m=2), tipo sin => energia só no harmônico 2
    const h = new HareOm(
      makeRecipe({ amplitudes: [0, 1], phases: [0, 0] }),
      16
    )
    const c = h.toCoefficients()
    expect(mag(c, 2)).toBeCloseTo(1, 12)
    expect(mag(c, 1)).toBeCloseTo(0, 12)
    for (let n = 3; n <= 16; n++) {
      expect(mag(c, n)).toBeCloseTo(0, 12)
    }
  })

  // HAREOM-AC-07
  it('HAREOM-AC-07: type desconhecido cai em sin', () => {
    const desconhecido = new HareOm(makeRecipe({ type: '???' }), 16)
    const seno = new HareOm(makeRecipe({ type: 'sin' }), 16)
    expect(Array.from(desconhecido.toCoefficients().imag)).toEqual(
      Array.from(seno.toCoefficients().imag)
    )
  })

  // HAREOM-AC-08
  it('HAREOM-AC-08: setRecipe troca o timbre compilado', () => {
    const h = new HareOm(makeRecipe({ type: 'sin' }), 16)
    const antes = h.toCoefficients()
    h.setRecipe(makeRecipe({ type: 'saw' }))
    const depois = h.toCoefficients()
    // saw tem energia no harmônico 2; sin não
    expect(mag(antes, 2)).toBeCloseTo(0, 12)
    expect(mag(depois, 2)).toBeGreaterThan(0)
  })

  // HAREOM-AC-09: propriedade — linearidade do gain
  it('HAREOM-AC-09: dobrar o gain dobra todo coeficiente', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('sin', 'square', 'saw', 'tri'),
        fc.double({ min: 0.1, max: 1, noNaN: true }),
        (type, gain) => {
          const recipe = makeRecipe({
            type,
            gain,
            amplitudes: [0.5, 0.3, 0.2],
            phases: [0.1, 0.4, 0.7]
          })
          const single = new HareOm(recipe, 32).toCoefficients()
          const doubled = new HareOm(
            { ...recipe, gain: gain * 2 },
            32
          ).toCoefficients()
          for (let n = 0; n <= 32; n++) {
            // Float32Array => precisão ~1e-7; compara em nível compatível
            expect(doubled.real[n]).toBeCloseTo(single.real[n] * 2, 5)
            expect(doubled.imag[n]).toBeCloseTo(single.imag[n] * 2, 5)
          }
        }
      )
    )
  })

  // HAREOM-AC-10: propriedade — a fase preserva a magnitude por harmônico
  it('HAREOM-AC-10: variar fase global/parcial preserva a magnitude de cada harmônico', () => {
    // Um único parcial: seus harmônicos (k·m) são todos distintos, sem sobreposição.
    // Aí a fase só gira cada harmônico, sem alterar a magnitude — válido p/ os 4 tipos.
    // (Com parciais sobrepostos a fase muda a soma vetorial, então a invariância cai.)
    fc.assert(
      fc.property(
        fc.constantFrom('sin', 'square', 'saw', 'tri'),
        fc.double({ min: 0, max: 1, noNaN: true }),
        fc.double({ min: 0, max: 1, noNaN: true }),
        (type, phase, partialPhase) => {
          const base = new HareOm(
            makeRecipe({ type, amplitudes: [1], phases: [0] }),
            32
          ).toCoefficients()
          const shifted = new HareOm(
            makeRecipe({ type, phase, amplitudes: [1], phases: [partialPhase] }),
            32
          ).toCoefficients()
          for (let n = 0; n <= 32; n++) {
            // Float32Array => precisão ~1e-7; compara em nível compatível
            expect(mag(shifted, n)).toBeCloseTo(mag(base, n), 5)
          }
        }
      )
    )
  })

  // HAREOM-AC-11: propriedade — amplitude do parcial escala a energia do seu harmônico
  it('HAREOM-AC-11: amplitudes[i] escala linearmente a energia nos harmônicos de m=i+1', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.1, max: 1, noNaN: true }),
        (amp) => {
          // tipo sin, 2o parcial (m=2): magnitude do harmônico 2 = gain*amp
          const c = new HareOm(
            makeRecipe({ amplitudes: [0, amp], phases: [0, 0] }),
            16
          ).toCoefficients()
          // Float32Array => precisão ~1e-7; compara em nível compatível
          expect(mag(c, 2)).toBeCloseTo(amp, 5)
        }
      )
    )
  })
})
