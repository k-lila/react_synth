import { useCallback, useState } from 'react'
import useComponentSizes from './useComponentSizes'
import getPercent from '../utils/getpercent'

const useGain = ({ ...props }: UseGainProps) => {
  const [gain, setGain] = useState(70)
  const [toggle, setToggle] = useState(false)
  const sizes = useComponentSizes(props.ref)
  const calculateGain = useCallback(
    (clientNum: number) => {
      if (props.ref.current) {
        const range = props.horizontal ? sizes.width : sizes.height
        const num = props.horizontal
          ? clientNum - sizes.left
          : clientNum - sizes.top
        const percent = getPercent(num, range, 0, 100, props.horizontal)
        setGain(percent)
      }
    },
    [
      props.ref,
      sizes.height,
      sizes.top,
      props.horizontal,
      sizes.width,
      sizes.left
    ]
  )
  const handleDown = useCallback(
    (clientNum: number) => {
      setToggle(true)
      calculateGain(clientNum)
    },
    [calculateGain]
  )
  const handleMove = useCallback(
    (clientNum: number) => {
      if (toggle) {
        calculateGain(clientNum)
      }
    },
    [toggle, calculateGain]
  )
  const handleUp = useCallback(() => {
    setToggle(false)
  }, [])
  return { gain, handleDown, handleMove, handleUp }
}

export default useGain
