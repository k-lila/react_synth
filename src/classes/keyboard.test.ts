import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import Keyboard from './keyboard'
import ScaleGenerator from './scalegenerator'

const ESCALAS = [
  'chromatic',
  'chromaticnatural',
  'chromaticunnatural',
  'natural',
  'naturalsharps',
  'naturalflats',
  'pitagoric'
] as const

const COMPRIMENTOS: Record<(typeof ESCALAS)[number], number> = {
  chromatic: 12,
  chromaticnatural: 7,
  chromaticunnatural: 5,
  natural: 7,
  naturalsharps: 7,
  naturalflats: 7,
  pitagoric: 7
}

describe('Keyboard', () => {
  // KBD-AC-01
  it('KBD-AC-01: getKeyboard retorna as 7 escalas, cada uma como number[][]', () => {
    const kb = new Keyboard(440).keyboard
    ESCALAS.forEach((nome) => {
      expect(Array.isArray(kb[nome])).toBe(true)
      kb[nome].forEach((oitava) => {
        expect(Array.isArray(oitava)).toBe(true)
        oitava.forEach((n) => expect(typeof n).toBe('number'))
      })
    })
  })

  // KBD-AC-02
  it('KBD-AC-02: todas as 7 escalas têm o mesmo número de oitavas', () => {
    const kb = new Keyboard(440).keyboard
    const numOitavas = kb.chromatic.length
    expect(numOitavas).toBeGreaterThan(0)
    ESCALAS.forEach((nome) => {
      expect(kb[nome].length).toBe(numOitavas)
    })
  })

  // KBD-AC-03
  it('KBD-AC-03: cada oitava tem o comprimento da escala-base (12/7/5/7/7/7/7)', () => {
    const kb = new Keyboard(440).keyboard
    ESCALAS.forEach((nome) => {
      kb[nome].forEach((oitava) => {
        expect(oitava).toHaveLength(COMPRIMENTOS[nome])
      })
    })
  })

  // KBD-AC-04
  it('KBD-AC-04: oitava[n+1][k] = 2 * oitava[n][k] em todas as escalas', () => {
    const kb = new Keyboard(440).keyboard
    ESCALAS.forEach((nome) => {
      const oitavas = kb[nome]
      for (let n = 0; n < oitavas.length - 1; n++) {
        for (let k = 0; k < oitavas[n].length; k++) {
          expect(oitavas[n + 1][k]).toBeCloseTo(2 * oitavas[n][k], 6)
        }
      }
    })
  })

  // KBD-AC-05
  it('KBD-AC-05: o C está ancorado -> chromaticscale[9]*chromaticC reconstrói o pitch (a nota A) em alguma oitava', () => {
    const pitch = 440
    const kb = new Keyboard(pitch).keyboard
    // o índice 9 cromático é o A; em alguma oitava ele deve coincidir com o pitch
    const algumA = kb.chromatic.some(
      (oitava) => Math.abs(oitava[9] - pitch) < 1e-6
    )
    expect(algumA).toBe(true)
  })

  // KBD-AC-06
  it('KBD-AC-06: a base chromaticC resulta do laço de redução `while (chromaticC > 20)`', () => {
    const sg = new ScaleGenerator()
    const pitch = 440
    const kb = new Keyboard(pitch).keyboard
    // chromaticC da primeira oitava = chromatic[0][0] (escala começa em 1)
    const chromaticC = kb.chromatic[0][0] / sg.chromaticscale[0]
    // OBSERVADO: o laço divide ENQUANTO chromaticC > 20, logo a base final cai
    // em (10, 20] — para pitch 440 dá ~16.35, ABAIXO de 20. A spec dizia ">= 20",
    // o que NÃO se confirma: o limiar é teto de saída, não piso. Comportamento
    // atual documentado (decisão do PM: testar como está, não é bug).
    expect(chromaticC).toBeLessThanOrEqual(20)
    expect(chromaticC).toBeGreaterThan(10)
  })

  // KBD-AC-07 (não-regressão)
  it('KBD-AC-07: determinismo para o mesmo pitch e herança das escalas-base', () => {
    const a = new Keyboard(440)
    const b = new Keyboard(440)
    expect(a.keyboard).toEqual(b.keyboard)
    // herda escalas-base de ScaleGenerator
    expect(a.chromaticscale).toHaveLength(12)
    expect(a.naturalscale).toHaveLength(7)
    expect(a.pitagoricscale).toHaveLength(7)
  })

  // Propriedade: relação de oitava ponto-a-ponto para pitch em [110,880]
  it('propriedade: oitava[n+1][k] = 2*oitava[n][k] para pitch em [110,880]', () => {
    fc.assert(
      fc.property(fc.integer({ min: 110, max: 880 }), (pitch) => {
        const kb = new Keyboard(pitch).keyboard
        ESCALAS.forEach((nome) => {
          const oitavas = kb[nome]
          for (let n = 0; n < oitavas.length - 1; n++) {
            for (let k = 0; k < oitavas[n].length; k++) {
              expect(oitavas[n + 1][k]).toBeCloseTo(2 * oitavas[n][k], 4)
            }
          }
        })
      })
    )
  })

  // Propriedade: igualdade de contagem de oitavas e comprimento de cada oitava
  it('propriedade: igual contagem de oitavas entre escalas e comprimento correto por escala', () => {
    fc.assert(
      fc.property(fc.integer({ min: 110, max: 880 }), (pitch) => {
        const kb = new Keyboard(pitch).keyboard
        const numOitavas = kb.chromatic.length
        ESCALAS.forEach((nome) => {
          expect(kb[nome].length).toBe(numOitavas)
          kb[nome].forEach((oitava) =>
            expect(oitava).toHaveLength(COMPRIMENTOS[nome])
          )
        })
      })
    )
  })
})
