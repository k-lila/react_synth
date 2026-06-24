import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import minBufferSize from './minbuffersize'

describe('minBufferSize', () => {
  it('quando o período é inteiro, fecha em 1 ciclo exato', () => {
    // 48000 / 480 = 100 amostras por oscilação, sem parte fracionária
    expect(minBufferSize(48000, 480)).toEqual({ buffersize: 100, num: 1 })
  })

  it('invariante: o buffer cobre `num` ciclos quase inteiros (loop sem clique)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 8000, max: 192000 }),
        fc.integer({ min: 20, max: 5000 }),
        (samplerate, pitch) => {
          const { buffersize, num } = minBufferSize(samplerate, pitch)
          // num é um contador de ciclos válido, limitado pela busca (<= 25)
          expect(Number.isInteger(num)).toBe(true)
          expect(num).toBeGreaterThanOrEqual(1)
          expect(num).toBeLessThanOrEqual(25)
          // o tamanho é um número inteiro positivo de amostras
          expect(Number.isInteger(buffersize)).toBe(true)
          expect(buffersize).toBeGreaterThan(0)
          // garantia central: buffersize ≈ `num` períodos inteiros (erro só de arredondamento)
          const periodo = samplerate / pitch
          expect(Math.abs(buffersize - periodo * num)).toBeLessThanOrEqual(0.5)
        }
      )
    )
  })
})
