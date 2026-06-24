import { useEffect, useState } from 'react'

/**
 * Acompanha o tamanho da viewport, em px, atualizando a cada `resize`.
 */
function useWindowSize() {
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
