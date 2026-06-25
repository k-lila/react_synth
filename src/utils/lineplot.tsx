import * as d3 from 'd3'

/**
 * Renderiza, via D3, um SVG com uma ou mais séries sobre um eixo Y fixo `[-1, 1]`.
 *
 * @param data - séries a plotar (`number[][]`), todas do mesmo comprimento e
 *   assumidas normalizadas em ±1
 * @param id - índice da série a destacar com traço grosso; `-1` destaca a última
 * @returns o elemento SVG do gráfico
 * @remarks Eixo X vai de 0 a `data[0].length - 1`; a linha horizontal central
 *   marca o zero. Use {@link waveEditorPlot} quando não houver série a destacar.
 */
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
        let stroke = 'black'
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
