import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import ScaleGenerator from './scalegenerator'

const semitom = 2 ** (1 / 12)

describe('ScaleGenerator', () => {
  // SCALE-AC-01
  it('SCALE-AC-01: chromaticscale tem 12 notas, [0]=1, razão sucessiva 2^(1/12) e é crescente', () => {
    const sg = new ScaleGenerator()
    expect(sg.chromaticscale).toHaveLength(12)
    expect(sg.chromaticscale[0]).toBeCloseTo(1, 10)
    for (let i = 1; i < sg.chromaticscale.length; i++) {
      expect(sg.chromaticscale[i] / sg.chromaticscale[i - 1]).toBeCloseTo(
        semitom,
        10
      )
      expect(sg.chromaticscale[i]).toBeGreaterThan(sg.chromaticscale[i - 1])
    }
  })

  // SCALE-AC-02
  it('SCALE-AC-02: índices [0,2,4,5,7,9,11] vão para naturais (7) e o resto para não-naturais (5); a união reconstrói os 12', () => {
    const sg = new ScaleGenerator()
    const naturalindexes = [0, 2, 4, 5, 7, 9, 11]
    expect(sg.chromaticnaturalscale).toHaveLength(7)
    expect(sg.chromaticunnaturalscale).toHaveLength(5)
    expect(sg.chromaticnaturalscale).toEqual(
      naturalindexes.map((i) => sg.chromaticscale[i])
    )
    expect(sg.chromaticunnaturalscale).toEqual(
      sg.chromaticscale.filter((_, i) => !naturalindexes.includes(i))
    )
    // união (como multiconjunto) reconstrói os 12 valores cromáticos
    const uniao = [
      ...sg.chromaticnaturalscale,
      ...sg.chromaticunnaturalscale
    ].sort((a, b) => a - b)
    expect(uniao).toEqual([...sg.chromaticscale].sort((a, b) => a - b))
  })

  // SCALE-AC-03
  it('SCALE-AC-03: naturalscale tem 7 valores, todos em [1,2)', () => {
    const sg = new ScaleGenerator()
    expect(sg.naturalscale).toHaveLength(7)
    sg.naturalscale.forEach((n) => {
      expect(n).toBeGreaterThanOrEqual(1)
      expect(n).toBeLessThan(2)
    })
  })

  // SCALE-AC-04
  it('SCALE-AC-04: naturalscale segue a ordem [c,d,e,f,g,a,b] com as razões justas conhecidas', () => {
    const sg = new ScaleGenerator()
    // Razões justas LITERAIS e independentes do fonte (não derivadas das suas
    // fórmulas): c, d, e, f, g, a, b da afinação justa em [1,2).
    // Se a afinação do fonte mudar, este teste FALHA (não é tautológico).
    const esperado = [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8]
    expect(sg.naturalscale).toHaveLength(esperado.length)
    sg.naturalscale.forEach((n, i) => expect(n).toBeCloseTo(esperado[i], 10))
    // Asserção independente: a ordem [c,d,e,f,g,a,b] coincide com a ordem
    // ascendente por magnitude (a ressalva da spec "não ordenada" não se
    // verifica nestes dados — comportamento atual documentado, não é bug).
    const ordenada = [...sg.naturalscale].sort((x, y) => x - y)
    expect(sg.naturalscale).toEqual(ordenada)
  })

  // SCALE-AC-05
  it('SCALE-AC-05: naturalsharps tem 7 valores, crescente e todos <= 2.1', () => {
    const sg = new ScaleGenerator()
    expect(sg.naturalsharps).toHaveLength(7)
    sg.naturalsharps.forEach((s) => expect(s).toBeLessThanOrEqual(2.1))
    for (let i = 1; i < sg.naturalsharps.length; i++) {
      expect(sg.naturalsharps[i]).toBeGreaterThanOrEqual(sg.naturalsharps[i - 1])
    }
  })

  // SCALE-AC-06
  it('SCALE-AC-06: naturalflats tem 7 valores, crescente e todos >= 0.9', () => {
    const sg = new ScaleGenerator()
    expect(sg.naturalflats).toHaveLength(7)
    sg.naturalflats.forEach((f) => expect(f).toBeGreaterThanOrEqual(0.9))
    for (let i = 1; i < sg.naturalflats.length; i++) {
      expect(sg.naturalflats[i]).toBeGreaterThanOrEqual(sg.naturalflats[i - 1])
    }
  })

  // SCALE-AC-07
  it('SCALE-AC-07: pitagoricscale tem 7 valores do ciclo 3^i reduzido (<= 2.2), ordenado e contém 1', () => {
    const sg = new ScaleGenerator()
    expect(sg.pitagoricscale).toHaveLength(7)
    sg.pitagoricscale.forEach((p) => expect(p).toBeLessThanOrEqual(2.2))
    for (let i = 1; i < sg.pitagoricscale.length; i++) {
      expect(sg.pitagoricscale[i]).toBeGreaterThanOrEqual(
        sg.pitagoricscale[i - 1]
      )
    }
    // 3^0 = 1 está no ciclo
    expect(sg.pitagoricscale.some((p) => Math.abs(p - 1) < 1e-9)).toBe(true)
  })

  // SCALE-AC-08 (não-regressão)
  it('SCALE-AC-08: comprimentos fixos (12/7/5/7/7/7/7) e duas instâncias idênticas (determinismo)', () => {
    const a = new ScaleGenerator()
    const b = new ScaleGenerator()
    expect(a.chromaticscale).toHaveLength(12)
    expect(a.chromaticnaturalscale).toHaveLength(7)
    expect(a.chromaticunnaturalscale).toHaveLength(5)
    expect(a.naturalscale).toHaveLength(7)
    expect(a.naturalsharps).toHaveLength(7)
    expect(a.naturalflats).toHaveLength(7)
    expect(a.pitagoricscale).toHaveLength(7)
    // determinismo: sem entrada, duas instâncias produzem escalas idênticas
    expect(a.chromaticscale).toEqual(b.chromaticscale)
    expect(a.naturalscale).toEqual(b.naturalscale)
    expect(a.naturalsharps).toEqual(b.naturalsharps)
    expect(a.naturalflats).toEqual(b.naturalflats)
    expect(a.pitagoricscale).toEqual(b.pitagoricscale)
  })

  // Propriedade: razão constante entre vizinhos cromáticos
  it('propriedade: a razão entre vizinhos cromáticos é sempre 2^(1/12)', () => {
    const sg = new ScaleGenerator()
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 11 }), (i) => {
        expect(sg.chromaticscale[i] / sg.chromaticscale[i - 1]).toBeCloseTo(
          semitom,
          10
        )
      })
    )
  })

  // Propriedade: faixa [1,2) do natural
  it('propriedade: todo valor de naturalscale está em [1,2)', () => {
    const sg = new ScaleGenerator()
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 6 }), (i) => {
        expect(sg.naturalscale[i]).toBeGreaterThanOrEqual(1)
        expect(sg.naturalscale[i]).toBeLessThan(2)
      })
    )
  })

  // Propriedade: ordenação ascendente de sharps/flats/pitagoric
  it('propriedade: sharps, flats e pitagoric são monotonicamente não-decrescentes', () => {
    const sg = new ScaleGenerator()
    const asc = (arr: number[]) =>
      arr.every((v, i) => i === 0 || v >= arr[i - 1])
    fc.assert(
      fc.property(fc.constant(null), () => {
        expect(asc(sg.naturalsharps)).toBe(true)
        expect(asc(sg.naturalflats)).toBe(true)
        expect(asc(sg.pitagoricscale)).toBe(true)
      })
    )
  })

  // Propriedade: partição cromática = multiconjunto completo
  it('propriedade: naturais + não-naturais reconstroem o multiconjunto cromático completo', () => {
    const sg = new ScaleGenerator()
    const uniao = [
      ...sg.chromaticnaturalscale,
      ...sg.chromaticunnaturalscale
    ].sort((a, b) => a - b)
    const todos = [...sg.chromaticscale].sort((a, b) => a - b)
    expect(uniao).toEqual(todos)
  })
})
