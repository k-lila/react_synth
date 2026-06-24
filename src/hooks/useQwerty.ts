import { useEffect } from 'react'

/**
 * Hook base que escuta `keydown`/`keyup` no `document` e repassa o `event.code`.
 *
 * @param onKeyDown - callback ao pressionar; recebe o `code` da tecla (layout físico)
 * @param onKeyUp - callback ao soltar; recebe o `code` da tecla
 * @remarks Usa `event.code` (posição física), não `event.key` (caractere). Os
 *   listeners são removidos no cleanup; memoize os callbacks para não reanexar.
 */
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
