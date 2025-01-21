class FundamentalWave {
  type: string
  constructor(type: string) {
    this.type = type
  }

  getInfo() {
    console.log(this.type)
  }
}

export default FundamentalWave
