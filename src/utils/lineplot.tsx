import * as d3 from 'd3'

export default function LinePlot(
  data: number[][],
  width: number,
  height: number,
  marginTop: number,
  marginRight: number,
  marginBottom: number,
  marginLeft: number,
  id?: number
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
        strokeWidth="2"
      />
      {data.map((m, i) => {
        let stroke = 'gray'
        let strokeWidth = 0.5
        if (
          data.length === 1 ||
          id === i ||
          (id === -1 && i === data.length - 1)
        ) {
          stroke = 'black'
          strokeWidth = 3
        }
        return (
          <path
            key={i}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            d={line(m) || undefined}
          />
        )
      })}
    </svg>
  )
}
