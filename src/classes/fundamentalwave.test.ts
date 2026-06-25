import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import FundamentalWave from './fundamentalwave'

// helper: instancia uma onda com minbuffer pequeno e inteiro
const makeWave = (minbuffer: number, num = 1) => {
  const w = new FundamentalWave(48000)
  w.setMinBufferSize(minbuffer, num)
  return w
}

const maxAbs = (arr: number[]) => Math.max(...arr.map((v) => Math.abs(v)))

describe('FundamentalWave', () => {
  // WAVE-AC-01
  it('WAVE-AC-01: createSin tem comprimento minbuffer+1, valores em [-int,int] e completa num*multiplier ciclos (phase=0,int=1)', () => {
    const minbuffer = 100
    const w = makeWave(minbuffer, 3)
    const multiplier = 2
    const sin = w.createSin(1, 0, multiplier)
    expect(sin).toHaveLength(minbuffer + 1)
    expect(maxAbs(sin)).toBeLessThanOrEqual(1 + 1e-9)
    // primeira amostra (i=0) com phase=0 é sin(0)=0
    expect(sin[0]).toBeCloseTo(0, 10)
    // i=minbuffer fecha num*multiplier ciclos inteiros -> volta a ~0
    expect(sin[minbuffer]).toBeCloseTo(0, 9)
  })

  // WAVE-AC-02
  it('WAVE-AC-02: phase desloca a fase angular sem mudar comprimento nem exceder a amplitude', () => {
    const minbuffer = 64
    const w = makeWave(minbuffer, 1)
    const semFase = w.createSin(1, 0, 1)
    const comFase = w.createSin(1, 0.25, 1)
    expect(comFase).toHaveLength(semFase.length)
    expect(maxAbs(comFase)).toBeLessThanOrEqual(1 + 1e-9)
    // fase 0.25 (90 graus) transforma sin(0)=0 em sin(pi/2)=1 na primeira amostra
    expect(comFase[0]).toBeCloseTo(1, 9)
    expect(comFase).not.toEqual(semFase)
  })

  // WAVE-AC-03
  it('WAVE-AC-03: createSquare só assume valores em {-int,+int}', () => {
    const w = makeWave(80, 2)
    const intensity = 0.7
    const square = w.createSquare(intensity, 0, 1)
    expect(square).toHaveLength(81)
    square.forEach((v) => {
      expect([intensity, -intensity]).toContainEqual(v)
    })
  })

  // WAVE-AC-04
  it('WAVE-AC-04: createSawTooth é rampa em [-int,int]; a fase é rotação cíclica (slice em floor(length*phase)) preservando comprimento', () => {
    const minbuffer = 50
    const w = makeWave(minbuffer, 1)
    const intensity = 0.8
    const semFase = w.createSawTooth(intensity, 0, 1)
    expect(semFase).toHaveLength(minbuffer + 1)
    expect(maxAbs(semFase)).toBeLessThanOrEqual(intensity + 1e-9)
    // rotação cíclica: reconstrói o conteúdo deslocado
    const phase = 0.3
    const comFase = w.createSawTooth(intensity, phase, 1)
    expect(comFase).toHaveLength(semFase.length)
    const k = Math.floor(semFase.length * phase)
    const esperado = [...semFase.slice(k), ...semFase.slice(0, k)]
    expect(comFase).toEqual(esperado)
  })

  // WAVE-AC-05
  it('WAVE-AC-05: createTriangle em [-int,int], pico em +/-int e fase rotação cíclica preserva comprimento', () => {
    const minbuffer = 60
    const w = makeWave(minbuffer, 1)
    const intensity = 0.9
    const tri = w.createTriangle(intensity, 0, 1)
    expect(tri).toHaveLength(minbuffer + 1)
    expect(maxAbs(tri)).toBeLessThanOrEqual(intensity + 1e-9)
    // a triangular atinge o pico de amplitude
    expect(maxAbs(tri)).toBeCloseTo(intensity, 6)
    // fase é rotação cíclica
    const phase = 0.4
    const comFase = w.createTriangle(intensity, phase, 1)
    expect(comFase).toHaveLength(tri.length)
    const k = Math.floor(tri.length * phase)
    expect(comFase).toEqual([...tri.slice(k), ...tri.slice(0, k)])
  })

  // WAVE-AC-06
  it('WAVE-AC-06: createContext despacha sin/square/saw/tri; string não reconhecida cai na senoidal (default)', () => {
    const minbuffer = 40
    const intensities = [1, 0.5]

    const buildExpected = (type: string) => {
      const w = makeWave(minbuffer, 1)
      w.setIntensities(intensities)
      w.setPhases([0, 0])
      w.createContext(type)
      return w.wavelist
    }

    // square
    const sq = makeWave(minbuffer, 1)
    sq.setIntensities(intensities)
    sq.setPhases([0, 0])
    sq.createContext('square')
    sq.wavelist.flat().forEach((v) => {
      expect([1, -1, 0.5, -0.5]).toContainEqual(v)
    })

    // wavelist tem 1 array por intensity; harmônico i usa multiplier i+1
    const sinW = makeWave(minbuffer, 1)
    sinW.setIntensities(intensities)
    sinW.setPhases([0, 0])
    sinW.createContext('sin')
    expect(sinW.wavelist).toHaveLength(intensities.length)
    // o segundo parcial (i=1) usa multiplier 2 -> deve igualar createSin(int,phase,2)
    const parcial2 = makeWave(minbuffer, 1).createSin(intensities[1], 0, 2)
    expect(sinW.wavelist[1]).toEqual(parcial2)

    // saw -> cada parcial i iguala createSawTooth(int,0,i+1)
    const sawW = makeWave(minbuffer, 1)
    sawW.setIntensities(intensities)
    sawW.setPhases([0, 0])
    sawW.createContext('saw')
    intensities.forEach((m, i) => {
      const parcial = makeWave(minbuffer, 1).createSawTooth(m, 0, i + 1)
      expect(sawW.wavelist[i]).toEqual(parcial)
    })

    // tri -> cada parcial i iguala createTriangle(int,0,i+1)
    const triW = makeWave(minbuffer, 1)
    triW.setIntensities(intensities)
    triW.setPhases([0, 0])
    triW.createContext('tri')
    intensities.forEach((m, i) => {
      const parcial = makeWave(minbuffer, 1).createTriangle(m, 0, i + 1)
      expect(triW.wavelist[i]).toEqual(parcial)
    })

    // string desconhecida -> senoidal (default), igual ao contexto 'sin'
    expect(buildExpected('qualquer-coisa')).toEqual(buildExpected('sin'))
  })

  // WAVE-AC-07
  it('WAVE-AC-07: getWave soma parciais ponto-a-ponto, rotaciona por phase, multiplica por gain e mantém comprimento dos parciais', () => {
    const minbuffer = 32
    const w = makeWave(minbuffer, 1)
    w.setIntensities([1, 0.5])
    w.setPhases([0, 0])
    w.createContext('sin')
    const parciais = w.wavelist
    const gain = 0.5

    const wave = w.getWave(gain, 0)
    expect(wave).toHaveLength(parciais[0].length)
    // soma ponto-a-ponto * gain (phase=0 -> sem rotação)
    for (let j = 0; j < wave.length; j++) {
      const soma = parciais.reduce((acc, p) => acc + p[j], 0)
      expect(wave[j]).toBeCloseTo(soma * gain, 9)
    }

    // phase rotaciona ciclicamente o resultado somado
    const somado = parciais[0].map((_, j) =>
      parciais.reduce((acc, p) => acc + p[j], 0)
    )
    const phase = 0.25
    const comFase = w.getWave(1, phase)
    const k = Math.floor(somado.length * phase)
    const esperado = [...somado.slice(k), ...somado.slice(0, k)]
    comFase.forEach((v, j) => expect(v).toBeCloseTo(esperado[j], 9))
  })

  // WAVE-AC-08
  it('WAVE-AC-08: wavelist vazia faz getWave retornar []', () => {
    const w = makeWave(50, 1)
    expect(w.wavelist).toEqual([])
    expect(w.getWave(1, 0)).toEqual([])
    expect(w.getWave(0.5, 0.3)).toEqual([])
  })

  // WAVE-AC-09 (não-regressão)
  it('WAVE-AC-09: determinismo de createContext+getWave; setters substituem apenas seu campo', () => {
    const build = () => {
      const w = makeWave(48, 2)
      w.setIntensities([1, 0.4, 0.2])
      w.setPhases([0, 0.1, 0.2])
      w.createContext('saw')
      return w.getWave(0.7, 0.15)
    }
    expect(build()).toEqual(build())

    const w = makeWave(48, 1)
    w.setIntensities([0.3])
    expect(w.intensities).toEqual([0.3])
    expect(w.phases).toEqual([1]) // inalterado
    w.setPhases([0.9])
    expect(w.phases).toEqual([0.9])
    expect(w.intensities).toEqual([0.3]) // inalterado
    w.setMinBufferSize(10, 5)
    expect(w.minbuffersize).toEqual({ minbuffer: 10, num: 5 })
    expect(w.intensities).toEqual([0.3]) // inalterado
    expect(w.phases).toEqual([0.9]) // inalterado
  })

  // Propriedade: comprimento minbuffer+1 para qualquer minbuffer >= 1
  it('propriedade: todo create* produz comprimento minbuffer+1', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 8, max: 256 }),
        fc.integer({ min: 1, max: 5 }),
        (minbuffer, mult) => {
          const w = makeWave(minbuffer, 1)
          expect(w.createSin(1, 0, mult)).toHaveLength(minbuffer + 1)
          expect(w.createSquare(1, 0, mult)).toHaveLength(minbuffer + 1)
          expect(w.createSawTooth(1, 0, mult)).toHaveLength(minbuffer + 1)
          expect(w.createTriangle(1, 0, mult)).toHaveLength(minbuffer + 1)
        }
      )
    )
  })

  // Propriedade: limite de amplitude
  it('propriedade: nenhum create* excede a intensidade em módulo', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 8, max: 256 }),
        fc.double({ min: 0.01, max: 5, noNaN: true }),
        fc.double({ min: 0, max: 1, noNaN: true }),
        (minbuffer, intensity, phase) => {
          const w = makeWave(minbuffer, 1)
          const lim = intensity + 1e-9
          expect(maxAbs(w.createSin(intensity, phase, 1))).toBeLessThanOrEqual(
            lim
          )
          expect(
            maxAbs(w.createSquare(intensity, phase, 1))
          ).toBeLessThanOrEqual(lim)
          expect(
            maxAbs(w.createSawTooth(intensity, phase, 1))
          ).toBeLessThanOrEqual(lim)
          expect(
            maxAbs(w.createTriangle(intensity, phase, 1))
          ).toBeLessThanOrEqual(lim)
        }
      )
    )
  })

  // Propriedade: escala linear por intensity -- create*(k*int) = k*create*(int)
  it('propriedade: create* é linear na intensidade -> create(k*int) = k*create(int)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 8, max: 128 }),
        fc.double({ min: 0.1, max: 3, noNaN: true }),
        fc.double({ min: 0.1, max: 3, noNaN: true }),
        fc.double({ min: 0, max: 1, noNaN: true }),
        (minbuffer, intensity, k, phase) => {
          const w = makeWave(minbuffer, 1)
          const base = w.createSin(intensity, phase, 1)
          const escalada = w.createSin(k * intensity, phase, 1)
          base.forEach((v, j) =>
            expect(escalada[j]).toBeCloseTo(k * v, 6)
          )
        }
      )
    )
  })

  // Propriedade: rotação por phase preserva o multiconjunto (saw)
  it('propriedade: a rotação por phase preserva o multiconjunto de amostras (saw)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 8, max: 128 }),
        fc.double({ min: 0, max: 1, noNaN: true }),
        (minbuffer, phase) => {
          const w = makeWave(minbuffer, 1)
          const semFase = w.createSawTooth(1, 0, 1).sort((a, b) => a - b)
          const comFase = w.createSawTooth(1, phase, 1).sort((a, b) => a - b)
          expect(comFase).toEqual(semFase)
        }
      )
    )
  })

  // Propriedade: linearidade de gain em getWave -> getWave(k*gain) = k*getWave(gain)
  it('propriedade: getWave é linear no gain -> getWave(k*gain) = k*getWave(gain)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 8, max: 64 }),
        fc.double({ min: 0.1, max: 2, noNaN: true }),
        fc.double({ min: 0.1, max: 3, noNaN: true }),
        (minbuffer, gain, k) => {
          const w = makeWave(minbuffer, 1)
          w.setIntensities([1, 0.5])
          w.setPhases([0, 0])
          w.createContext('sin')
          const base = w.getWave(gain, 0)
          const escalada = w.getWave(k * gain, 0)
          base.forEach((v, j) => expect(escalada[j]).toBeCloseTo(k * v, 6))
        }
      )
    )
  })
})
