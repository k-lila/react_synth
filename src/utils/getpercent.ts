const getPercent = (num: number, range: number, min: number, max: number) => {
  let percent = (num * 100) / range
  percent = Math.max(min, Math.min(max, percent))
  return Math.floor(100 - percent)
}

export default getPercent
