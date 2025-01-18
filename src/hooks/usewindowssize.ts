import { useEffect, useState } from 'react'

const useWindowSize = () => {
  const [size, setSize] = useState({
    windowsize: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  })
  useEffect(() => {
    const handleResize = () => {
      setSize({
        windowsize: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      })
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return size
}

export default useWindowSize
