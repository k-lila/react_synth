import * as d3 from 'd3'

function waveEditorPlot(
  data: number[][],
  width: number,
  height: number,
  marginTop: number,
  marginRight: number,
  marginBottom: number,
  marginLeft: number
) {
  const x = d3.scaleLinear(
    [0, data[0].length - 1],
    [marginLeft, width - marginRight]
  )
  const y = d3.scaleLinear([-1, 1], [height - marginBottom, marginTop])
  const line = d3
    .line<number>()
    .x((_, i) => x(i))
    .y((d) => y(d))
  return (
    <svg width={width} height={height}>
      <line
        x1={x(0)}
        x2={width - marginRight}
        y1={height / 2}
        y2={height / 2}
        stroke="black"
        strokeWidth="1"
      />
      {data.map((m, i) => {
        return (
          <path
            key={i}
            fill="none"
            stroke="black"
            strokeWidth="1"
            d={line(m) || undefined}
          />
        )
      })}
    </svg>
  )
}

export default waveEditorPlot
