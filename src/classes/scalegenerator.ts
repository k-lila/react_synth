/**
 * Gera as escalas musicais do sintetizador como **razões de frequência
 * adimensionais** dentro de uma oitava (intervalo `[1, 2)`), não em Hz — a
 * conversão para Hz acontece em {@link Keyboard}.
 *
 * @remarks As escalas natural/sustenidos/bemóis usam entonação justa (razões de
 *   inteiros, potências de 3 e 5); a cromática usa temperamento igual (semitom
 *   `2^(1/12)`); a pitagórica, apenas potências de 3. O construtor pré-calcula e
 *   guarda todas as escalas nos atributos públicos.
 */
class ScaleGenerator {
  chromaticscale: number[]
  chromaticnaturalscale: number[]
  chromaticunnaturalscale: number[]
  naturalscale: number[]
  naturalsharps: number[]
  naturalflats: number[]
  pitagoricscale: number[]

  constructor() {
    this.chromaticnaturalscale = []
    this.chromaticunnaturalscale = []
    this.chromaticscale = this.getChromaticScale()
    this.naturalscale = this.getNaturalScale()
    this.naturalsharps = this.getNaturalSharps()
    this.naturalflats = this.getNaturalFlats()
    this.pitagoricscale = this.getPitagoricScale()
  }

  /**
   * Gera os 12 graus da escala cromática por temperamento igual (`2^(i/12)`) e,
   * de quebra, particiona-os em naturais e acidentes.
   *
   * @returns as 12 razões da oitava, da fundamental (`1`) ao próximo semitom da oitava
   * @remarks Efeito colateral: preenche `chromaticnaturalscale` e
   *   `chromaticunnaturalscale` conforme cada grau seja natural ou acidente.
   */
  getChromaticScale(): number[] {
    const semitom = 2 ** (1 / 12)
    const chromatic_sequence = [0, 2, 4, 5, 7, 9, 11]
    const chromaticscale = []
    for (let i = 0; i <= 11; i++) {
      const num = semitom ** i
      chromaticscale.push(num)
      if (chromatic_sequence.includes(i)) {
        this.chromaticnaturalscale.push(num)
      } else {
        this.chromaticunnaturalscale.push(num)
      }
    }
    return chromaticscale
  }

  /**
   * Gera as 7 notas naturais por entonação justa, dobradas/dividas até caírem no
   * intervalo `[1, 2)`.
   *
   * @returns as razões de C, D, E, F, G, A, B na ordem da escala
   */
  getNaturalScale(): number[] {
    const c = 1
    const g = c * 3
    const e = c * 5
    const f = c / 3
    const d = g * 3
    const a = f * 5
    const b = g * 5
    const scale = [c, d, e, f, g, a, b]
    const naturalscale = scale.map((n) => {
      let note = n
      while (note > 2 || note < 1) {
        if (note > 2) {
          note = note / 2
        } else {
          note = note * 2
        }
      }
      return note
    })
    return naturalscale
  }

  /**
   * Gera os sustenidos da escala natural empilhando quintas (potências de 3) a
   * partir do último grau natural, normalizados à oitava.
   *
   * @returns as razões dos sustenidos, ordenadas de forma crescente
   * @remarks Requer `naturalscale` já calculada (feito no construtor).
   */
  getNaturalSharps(): number[] {
    const sharpNum = this.naturalscale[this.naturalscale.length - 1]
    const sharpList = []
    for (let i = 1; i <= 7; i++) {
      let sharp = 3 ** i * sharpNum
      while (sharp > 2.1) {
        sharp = sharp / 2
      }
      sharpList.push(sharp)
    }
    return sharpList.sort((x, y) => x - y)
  }

  /**
   * Gera os bemóis da escala natural descendo por quintas (`1/3^i`) a partir de
   * um grau natural, normalizados à oitava.
   *
   * @returns as razões dos bemóis, ordenadas de forma crescente
   * @remarks Requer `naturalscale` já calculada (feito no construtor).
   */
  getNaturalFlats(): number[] {
    const flatNum = this.naturalscale[3]
    const flatList = []
    for (let i = 1; i <= 7; i++) {
      let flat = (1 / 3 ** i) * flatNum
      while (flat < 0.9) {
        flat = flat * 2
      }
      flatList.push(flat)
    }
    return flatList.sort((x, y) => x - y)
  }

  /**
   * Gera os 7 graus da escala pitagórica empilhando quintas puras (potências de
   * 3), normalizados à oitava.
   *
   * @returns as razões da escala pitagórica, ordenadas de forma crescente
   */
  getPitagoricScale(): number[] {
    const pitagoricscale = []
    for (let i = 0; i < 7; i++) {
      let note = 1 * 3 ** i
      while (note > 2.2) {
        note = note / 2
      }
      pitagoricscale.push(note)
    }
    return pitagoricscale.sort((x, y) => x - y)
  }
}

export default ScaleGenerator
