import { useEffect } from 'react'

function useQWERTY(
  onKeyDown?: (key: string) => void,
  onKeyUp?: (key: string) => void
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (onKeyDown) onKeyDown(event.code)
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      if (onKeyUp) onKeyUp(event.code)
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [onKeyDown, onKeyUp])
}

export default useQWERTY
