import { useCallback, useEffect, useState } from 'react'

const useComponentSizes = (ref: React.RefObject<HTMLDivElement>) => {
  const [sizes, setSizes] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: 0,
    width: 0
  })
  const updateInfo = useCallback(() => {
    if (ref.current) {
      const { top, right, bottom, left, height, width } =
        ref.current.getBoundingClientRect()
      setSizes({
        top: top,
        right: right,
        bottom: bottom,
        left: left,
        height: height,
        width: width
      })
    }
  }, [ref])
  useEffect(() => {
    updateInfo()
    window.addEventListener('resize', updateInfo)
    return () => window.removeEventListener('resize', updateInfo)
  }, [updateInfo])
  return sizes
}

export default useComponentSizes
