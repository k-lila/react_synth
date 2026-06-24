import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import getKeyboardKey from './getkeyboardkey'

describe('getKeyboardKey', () => {
  // GKK-AC-01
  it('GKK-AC-01: Digit2->2, KeyA->A, KeyW->W', () => {
    expect(getKeyboardKey('Digit2')).toBe('2')
    expect(getKeyboardKey('KeyA')).toBe('A')
    expect(getKeyboardKey('KeyW')).toBe('W')
  })

  // GKK-AC-02
  it('GKK-AC-02: símbolos mapeiam corretamente', () => {
    expect(getKeyboardKey('Semicolon')).toBe('Ç')
    expect(getKeyboardKey('Quote')).toBe('~')
    expect(getKeyboardKey('Backslash')).toBe(']')
    expect(getKeyboardKey('BracketRight')).toBe('[')
    expect(getKeyboardKey('Minus')).toBe('-')
    expect(getKeyboardKey('BracketLeft')).toBe('´')
    expect(getKeyboardKey('Equal')).toBe('=')
  })

  // GKK-AC-03
  it('GKK-AC-03: keycode sem token reconhecido retorna inalterado', () => {
    expect(getKeyboardKey('Space')).toBe('Space')
    expect(getKeyboardKey('Enter')).toBe('Enter')
    expect(getKeyboardKey('')).toBe('')
  })

  // GKK-AC-04 (não-regressão): conjunto completo de keycodes de keyboardkeys.ts
  it('GKK-AC-04: o conjunto completo de keycodes de keyboardkeys.ts produz os rótulos esperados', () => {
    const esperado: Record<string, string> = {
      // naturalkeys
      KeyA: 'A',
      KeyS: 'S',
      KeyD: 'D',
      KeyF: 'F',
      KeyG: 'G',
      KeyH: 'H',
      KeyJ: 'J',
      KeyK: 'K',
      KeyL: 'L',
      Semicolon: 'Ç',
      Quote: '~',
      Backslash: ']',
      // flatkeys
      Digit2: '2',
      Digit3: '3',
      Digit4: '4',
      Digit5: '5',
      Digit6: '6',
      Digit7: '7',
      Digit8: '8',
      Digit9: '9',
      Digit0: '0',
      Minus: '-',
      Equal: '=',
      // sharpkeys
      KeyW: 'W',
      KeyE: 'E',
      KeyR: 'R',
      KeyT: 'T',
      KeyY: 'Y',
      KeyU: 'U',
      KeyI: 'I',
      KeyO: 'O',
      KeyP: 'P',
      BracketLeft: '´',
      BracketRight: '['
    }
    Object.entries(esperado).forEach(([code, rotulo]) => {
      expect(getKeyboardKey(code)).toBe(rotulo)
    })
  })

  // Propriedade: nunca lança, sempre retorna string
  it('propriedade: nunca lança e sempre retorna string', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        let r: string | undefined
        expect(() => {
          r = getKeyboardKey(s)
        }).not.toThrow()
        expect(typeof r).toBe('string')
      })
    )
  })

  // Propriedade: 'Digit'+d não contém mais 'Digit'
  it("propriedade: o rótulo de 'Digit'+d remove o prefixo Digit", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 9 }), (d) => {
        const r = getKeyboardKey(`Digit${d}`)
        expect(r.includes('Digit')).toBe(false)
        expect(r).toBe(String(d))
      })
    )
  })
})
