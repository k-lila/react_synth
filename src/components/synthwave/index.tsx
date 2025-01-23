import { useRef } from 'react'
import useComponentSizes from '../../hooks/useComponentSizes'
import { SynthWaveProps } from '../../types/props/propstypes'
import LinePlot from '../../utils/d3exemple'
import { SynthWaveStyled } from './styles'

const SynthWave = ({ ...props }: SynthWaveProps) => {
  const graphref = useRef<HTMLDivElement>(null)
  const { height, width } = useComponentSizes(graphref)
  return (
    <SynthWaveStyled>
      <div ref={graphref}>
        {props.datavisualization
          ? LinePlot([props.datavisualization], width, height, 5, 1, 5, 1)
          : null}
      </div>
    </SynthWaveStyled>
  )
}

export default SynthWave
