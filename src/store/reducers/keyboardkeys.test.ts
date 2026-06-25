import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import reducer, {
  setKeyByCode,
  setKeyById,
  setChromaticKeyById,
  setNaturalKeyById,
  addPlayingKey,
  removePlayingKey
} from './keyboardkeys'

const init = () => reducer(undefined, { type: '@@INIT' })

describe('keyboardkeys reducer', () => {
  // KEYS-AC-01
  it('KEYS-AC-01: setKeyByCode marca pressed nas 3 listas por keycode; keycode inexistente não muda nada', () => {
    const s0 = init()
    // 'Digit2' existe em flatkeys (id 100)
    const r = reducer(s0, setKeyByCode({ keycode: 'Digit2', pressed: true }))
    const alvo = r.flatkeys.find((k) => k.keycode === 'Digit2')
    expect(alvo?.pressed).toBe(true)
    // nenhuma outra tecla mudou
    const aindaFalse = [
      ...r.naturalkeys,
      ...r.sharpkeys,
      ...r.flatkeys.filter((k) => k.keycode !== 'Digit2')
    ].every((k) => k.pressed === false)
    expect(aindaFalse).toBe(true)

    // keycode inexistente: estado inalterado
    const inex = reducer(s0, setKeyByCode({ keycode: 'KeyZ', pressed: true }))
    expect(inex).toEqual(s0)
  })

  // KEYS-AC-02
  it('KEYS-AC-02: setKeyById marca pressed só em naturalkeys por id', () => {
    const s0 = init()
    const r = reducer(s0, setKeyById({ keyid: 5, pressed: true }))
    expect(r.naturalkeys.find((k) => k.id === 5)?.pressed).toBe(true)
    // flat/sharp inalteradas
    expect(r.flatkeys).toEqual(s0.flatkeys)
    expect(r.sharpkeys).toEqual(s0.sharpkeys)
  })

  // KEYS-AC-03
  it('KEYS-AC-03: setChromaticKeyById marca pressed só em sharpkeys', () => {
    const s0 = init()
    const r = reducer(s0, setChromaticKeyById({ keyid: 110, pressed: true }))
    expect(r.sharpkeys.find((k) => k.id === 110)?.pressed).toBe(true)
    expect(r.naturalkeys).toEqual(s0.naturalkeys)
    expect(r.flatkeys).toEqual(s0.flatkeys)
  })

  // KEYS-AC-04
  it('KEYS-AC-04: setNaturalKeyById com flat===true marca flatkeys, senão sharpkeys', () => {
    const s0 = init()
    const flat = reducer(
      s0,
      setNaturalKeyById({ keyid: 100, pressed: true, flat: true })
    )
    expect(flat.flatkeys.find((k) => k.id === 100)?.pressed).toBe(true)
    expect(flat.sharpkeys).toEqual(s0.sharpkeys)
    expect(flat.naturalkeys).toEqual(s0.naturalkeys)

    const sharp = reducer(
      s0,
      setNaturalKeyById({ keyid: 110, pressed: true })
    )
    expect(sharp.sharpkeys.find((k) => k.id === 110)?.pressed).toBe(true)
    expect(sharp.flatkeys).toEqual(s0.flatkeys)
    expect(sharp.naturalkeys).toEqual(s0.naturalkeys)
  })

  // KEYS-AC-05 (não-regressão)
  it('KEYS-AC-05: initialState esperado (cardinalidades e ids), todos pressed:false; ações preservam listas não-alvo', () => {
    const s0 = init()
    expect(s0.naturalkeys).toHaveLength(12)
    expect(s0.flatkeys).toHaveLength(11)
    expect(s0.sharpkeys).toHaveLength(11)

    expect(s0.naturalkeys.map((k) => k.id)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
    ])
    expect(s0.flatkeys.map((k) => k.id)).toEqual([
      100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 1010
    ])
    expect(s0.sharpkeys.map((k) => k.id)).toEqual([
      110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 1110
    ])

    const todasFalse = [
      ...s0.naturalkeys,
      ...s0.flatkeys,
      ...s0.sharpkeys
    ].every((k) => k.pressed === false)
    expect(todasFalse).toBe(true)
  })

  // KEYS-AC-06
  it('KEYS-AC-06: playing inicia em []; addPlayingKey insere e removePlayingKey remove ids sem tocar nas listas de teclas', () => {
    const s0 = init()
    expect(s0.playing).toEqual([])

    const um = reducer(s0, addPlayingKey({ keyid: 5 }))
    expect(um.playing).toEqual([5])
    const dois = reducer(um, addPlayingKey({ keyid: 110 }))
    expect(dois.playing).toEqual([5, 110])

    const volta = reducer(dois, removePlayingKey({ keyid: 5 }))
    expect(volta.playing).toEqual([110])

    // nenhuma das três listas de teclas é alterada
    expect(dois.naturalkeys).toEqual(s0.naturalkeys)
    expect(dois.flatkeys).toEqual(s0.flatkeys)
    expect(dois.sharpkeys).toEqual(s0.sharpkeys)
  })

  // KEYS-AC-06 (complemento)
  it('KEYS-AC-06: removePlayingKey de um id inexistente é no-op (lista intacta)', () => {
    const s0 = init()
    const comAlgumas = reducer(
      reducer(s0, addPlayingKey({ keyid: 5 })),
      addPlayingKey({ keyid: 110 })
    )
    const semMudanca = reducer(comAlgumas, removePlayingKey({ keyid: 999 }))
    expect(semMudanca.playing).toEqual([5, 110])
    expect(semMudanca).toEqual(comAlgumas)
  })

  // KEYS-AC-06 (complemento)
  it('KEYS-AC-06: soltar uma tecla entre 3+ simultâneas preserva as demais (não corta o resto)', () => {
    const s0 = init()
    const tres = [5, 110, 7].reduce(
      (st, id) => reducer(st, addPlayingKey({ keyid: id })),
      s0
    )
    expect(tres.playing).toEqual([5, 110, 7])

    // solta a do meio
    const soltaMeio = reducer(tres, removePlayingKey({ keyid: 110 }))
    expect(soltaMeio.playing).toEqual([5, 7])

    // solta a primeira das duas restantes
    const soltaPrimeira = reducer(soltaMeio, removePlayingKey({ keyid: 5 }))
    expect(soltaPrimeira.playing).toEqual([7])

    // a última continua tocando
    expect(soltaPrimeira.playing).toHaveLength(1)
    expect(soltaPrimeira.playing).toContain(7)
  })

  // KEYS-AC-07
  it('KEYS-AC-07: id 0 conta como tecla tocando (silêncio é por length, não por valor)', () => {
    const s0 = init()

    const com0 = reducer(s0, addPlayingKey({ keyid: 0 }))
    expect(com0.playing).toEqual([0])
    expect(com0.playing.length).toBe(1)

    const sem0 = reducer(com0, removePlayingKey({ keyid: 0 }))
    expect(sem0.playing).toEqual([])
    expect(sem0.playing.length).toBe(0)
  })

  // Propriedade: cardinalidade preservada após qualquer ação
  it('propriedade: cardinalidade das 3 listas é preservada por qualquer ação por id', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 11 }),
        fc.boolean(),
        (id, pressed) => {
          const s0 = init()
          const r1 = reducer(s0, setKeyById({ keyid: id, pressed }))
          const r2 = reducer(s0, setChromaticKeyById({ keyid: 110 + (id % 11), pressed }))
          ;[r1, r2].forEach((r) => {
            expect(r.naturalkeys).toHaveLength(12)
            expect(r.flatkeys).toHaveLength(11)
            expect(r.sharpkeys).toHaveLength(11)
          })
        }
      )
    )
  })

  // Propriedade: toggle reversível (true depois false restaura initialState)
  it('propriedade: pressionar e despressionar por keycode restaura o estado inicial', () => {
    const codigos = [
      'KeyA',
      'KeyS',
      'Digit2',
      'Minus',
      'KeyW',
      'BracketRight'
    ]
    fc.assert(
      fc.property(fc.constantFrom(...codigos), (keycode) => {
        const s0 = init()
        const on = reducer(s0, setKeyByCode({ keycode, pressed: true }))
        const off = reducer(on, setKeyByCode({ keycode, pressed: false }))
        expect(off).toEqual(s0)
      })
    )
  })
})
