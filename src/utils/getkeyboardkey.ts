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
