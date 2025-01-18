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
        const range = sizes.height
        const percent = getPercent(
          clientNum - sizes.top,
          range,
          props.min,
          props.max
        )
        console.log(percent)
        setGain(percent)
      }
    },
    [props.min, props.max, props.ref, sizes.height, sizes.top]
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
