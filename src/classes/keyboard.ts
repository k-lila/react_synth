import ScaleGenerator from './scalegenerator'

type KeyboardScales = {
  chromatic: number[][]
  natural: number[][]
  naturalsharps: number[][]
  naturalflats: number[][]
  pitagoric: number[][]
}

class Keyboard extends ScaleGenerator {
  public pitch: number
  public keyboard: KeyboardScales
  constructor(pitch: number) {
    super()
    this.pitch = pitch
    this.keyboard = this.getKeyboard()
  }

  private getKeyboard(): KeyboardScales {
    const _chromatic: number[][] = []
    const _natural: number[][] = []
    const _sharps: number[][] = []
    const _flats: number[][] = []
    const _pitagoric: number[][] = []
    let chromaticC = this.pitch / this.chromaticscale[9]
    let naturalC = this.pitch / this.naturalscale[5]
    let pitagoricC = this.pitch / this.pitagoricscale[5]

    while (chromaticC > 20) {
      chromaticC = chromaticC / 2
      naturalC = naturalC / 2
      pitagoricC = pitagoricC / 2
    }

    while (chromaticC < 5000) {
      const chromaticscale = this.chromaticscale.map((num) => {
        return num * chromaticC
      })
      const naturalscale = this.naturalscale.map((num) => {
        return num * naturalC
      })
      const sharps = this.naturalsharps.map((num) => {
        return num * naturalC
      })
      const flats = this.naturalflats.map((num) => {
        return num * naturalC
      })
      const pitagoricscale = this.pitagoricscale.map((num) => {
        return num * pitagoricC
      })

      _chromatic.push(chromaticscale)
      _natural.push(naturalscale)
      _sharps.push(sharps)
      _flats.push(flats)
      _pitagoric.push(pitagoricscale)

      chromaticC = chromaticC * 2
      naturalC = naturalC * 2
      pitagoricC = pitagoricC * 2
    }

    return {
      chromatic: _chromatic,
      natural: _natural,
      naturalsharps: _sharps,
      naturalflats: _flats,
      pitagoric: _pitagoric
    }
  }
}

export default Keyboard
