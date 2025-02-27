import { SVGContainerStyled } from './style'

const SVGContainer = ({ ...props }: SVGContainerProps) => {
  return <SVGContainerStyled src={props.src} alt={props.alt} />
}

export default SVGContainer
