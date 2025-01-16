class ScaleGenerator {
  public pitch: number;
  private octaves: number[];
  private naturalscale: number[];
  private naturalsharps: number[];
  private naturalflats: number[];
  private chromaticscale: number[];
  private pitagoricscale: number[];

  constructor(pitch: number) {
    this.pitch = pitch
    this.octaves = this.getOctaves()
    this.naturalscale = this.getNaturalScale()
    this.naturalsharps = this.getNaturalSharps()
    this.naturalflats = this.getNaturalFlats()
    this.chromaticscale = this.getChromaticScale()
    this.pitagoricscale = this.getPitagoricScale()
  }

  private getOctaves(): number[] {
    const octaveList = [this.pitch]
    let lowOctave = this.pitch
    let highOctave = this.pitch
    while (lowOctave > 1) {
      lowOctave = lowOctave / 2
      octaveList.push(lowOctave)
    }
    while (highOctave < 20000) {
      highOctave = highOctave * 2
      octaveList.push(highOctave)
    }
    octaveList.sort((x, y) => x - y)
    return octaveList.filter((f) => f > 20 && f < 8000)
  }

  private getNaturalScale(): number[] {
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

  private getNaturalSharps(): number[] {
    const sharpNum = this.naturalscale[this.naturalscale.length - 1]
    const sharpList = []
    for (let i = 1; i <= 7; i++) {
      let sharp = (3 ** i) * sharpNum
      while (sharp > 2.1) {
        sharp = sharp / 2
      }
      sharpList.push(sharp)
    }
    return sharpList.sort((x, y) => x - y)
  }

  private getNaturalFlats(): number[] {
    const flatNum = this.naturalscale[3]
    const flatList = []
    for (let i = 1; i <= 7; i++) {
      let flat = (1 / (3 ** i)) * flatNum
      while (flat < 0.9) {
        flat = flat * 2
      }
      flatList.push(flat)
    }
    return flatList.sort((x, y) => x - y)
  }

  private getChromaticScale(): number[] {
    const semitom = 2 ** (1 / 12)
    const chromaticscale = []
    for (let i = 0; i < 11; i++) {
      chromaticscale.push(semitom ** i)
    }
    return chromaticscale
  }

  private getPitagoricScale(): number[] {
    const pitagoricscale = []
    for (let i = 0; i < 7; i++) {
      let note = 1 * (3 ** i)
      while (note > 2.2) {
        note = note / 2
      }
      pitagoricscale.push(note)
    }
    return pitagoricscale.sort((x, y) => x - y)
  }

  public getInfo(): void {
    console.log('info')
  }
}

export default ScaleGenerator
