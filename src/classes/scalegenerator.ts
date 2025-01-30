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
