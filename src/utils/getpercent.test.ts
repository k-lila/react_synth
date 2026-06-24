import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import getPercent from './getpercent'

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v))

describe('getPercent', () => {
  // PCT-AC-01
  it('PCT-AC-01: clean===true retorna floor(clamp(num*100/range, min, max))', () => {
    // num=50 range=200 -> 25%, dentro de [0,100]
    expect(getPercent(50, 200, 0, 100, true)).toBe(25)
    // num=150 range=200 -> 75%
    expect(getPercent(150, 200, 0, 100, true)).toBe(75)
  })

  // PCT-AC-02
  it('PCT-AC-02: clean falsy retorna floor(100 - clamp(...))', () => {
    // 25% cru -> 100-25 = 75
    expect(getPercent(50, 200, 0, 100)).toBe(75)
    expect(getPercent(50, 200, 0, 100, false)).toBe(75)
  })

  // PCT-AC-03
  it('PCT-AC-03: clamp satura o percent cru em [min,max] antes do floor/inversão', () => {
    // 150% cru saturado a max=100 -> clean true = 100
    expect(getPercent(150, 100, 0, 100, true)).toBe(100)
    // saturado a min=10: num negativo -> clamp eleva para 10
    expect(getPercent(-50, 100, 10, 90, true)).toBe(10)
    // sem clean, com saturação a max: 100 - 100 = 0
    expect(getPercent(150, 100, 0, 100)).toBe(0)
  })

  // PCT-AC-04
  it('PCT-AC-04: o retorno é sempre inteiro nos 2 modos', () => {
    expect(Number.isInteger(getPercent(33.3, 99.9, 0, 100, true))).toBe(true)
    expect(Number.isInteger(getPercent(33.3, 99.9, 0, 100, false))).toBe(true)
  })

  // PCT-AC-05 (não-regressão)
  it('PCT-AC-05: num=range, min0, max100 -> clean true=100, sem clean=0', () => {
    expect(getPercent(200, 200, 0, 100, true)).toBe(100)
    expect(getPercent(200, 200, 0, 100)).toBe(0)
  })

  // Propriedade: Number.isInteger sempre
  it('propriedade: o retorno é sempre inteiro', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1000, max: 1000, noNaN: true }),
        fc.double({ min: 1, max: 1000, noNaN: true }),
        fc.boolean(),
        (num, range, clean) => {
          expect(Number.isInteger(getPercent(num, range, 0, 100, clean))).toBe(
            true
          )
        }
      )
    )
  })

  // Propriedade: saturação -- o percent interno respeita [min,max] (modo clean)
  it('propriedade: no modo clean o resultado fica em [floor(min), max]', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1000, max: 1000, noNaN: true }),
        fc.double({ min: 1, max: 1000, noNaN: true }),
        fc.double({ min: 0, max: 40, noNaN: true }),
        fc.double({ min: 60, max: 100, noNaN: true }),
        (num, range, min, max) => {
          const r = getPercent(num, range, min, max, true)
          expect(r).toBeGreaterThanOrEqual(Math.floor(min))
          expect(r).toBeLessThanOrEqual(max)
        }
      )
    )
  })

  // Propriedade: complementaridade floor(p)+floor(100-p) em {99,100}
  it('propriedade: clean + não-clean somam 99 ou 100 (com min0/max100)', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1000, max: 1000, noNaN: true }),
        fc.double({ min: 1, max: 1000, noNaN: true }),
        (num, range) => {
          const p = clamp((num * 100) / range, 0, 100)
          const a = getPercent(num, range, 0, 100, true) // floor(p)
          const b = getPercent(num, range, 0, 100, false) // floor(100-p)
          expect(a).toBe(Math.floor(p))
          expect(b).toBe(Math.floor(100 - p))
          expect([99, 100]).toContain(a + b)
        }
      )
    )
  })
})
