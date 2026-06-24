/**
 * Converte um `KeyboardEvent.code` no rótulo exibível da tecla.
 *
 * @param keycode - o `code` do evento (ex.: `KeyA`, `Digit1`, `Semicolon`)
 * @returns o caractere/rótulo a mostrar na tecla
 * @remarks Os símbolos seguem o layout ABNT2 (ex.: `Semicolon` → `Ç`,
 *   `Quote` → `~`); outros layouts podem não corresponder.
 * @example getKeyboardKey('Semicolon') // 'Ç'
 */
const getKeyboardKey = (keycode: string) => {
  const keyboardkey = keycode
    .replace('Digit', '')
    .replace('Key', '')
    .replace('Semicolon', 'Ç')
    .replace('Quote', '~')
    .replace('Backslash', ']')
    .replace('BracketRight', '[')
    .replace('Minus', '-')
    .replace('BracketLeft', '´')
    .replace('Equal', '=')
  return keyboardkey
}

export default getKeyboardKey
