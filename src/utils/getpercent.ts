/**
 * Converte `num` em percentual de `range`, limitado a `[min, max]`.
 *
 * @param num - valor a converter
 * @param range - total que corresponde a 100%
 * @param min - piso do percentual (após o clamp)
 * @param max - teto do percentual (após o clamp)
 * @param clean - quando `true`, retorna o percentual direto; quando ausente/`false`,
 *   retorna o **complemento** `100 - percentual` (útil para coordenadas de tela,
 *   onde a origem fica no topo)
 * @returns o percentual inteiro (arredondado para baixo)
 */
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
