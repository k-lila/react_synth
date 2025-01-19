const getPercent = (
  num: number,
  range: number,
  min: number,
  max: number,
  clean?: boolean
) => {
  let percent = (num * 100) / range
  percent = Math.max(min, Math.min(max, percent))
  if (clean) {
    return Math.floor(percent)
  } else {
    return Math.floor(100 - percent)
  }
}

export default getPercent
