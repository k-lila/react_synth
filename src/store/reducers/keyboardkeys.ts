import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type KeyboardQWERTY = {
  naturalkeys: Array<{
    id: number
    keycode: string
    pressed: boolean
  }>
}

const initialState: KeyboardQWERTY = {
  naturalkeys: [
    { id: 0, keycode: 'KeyA', pressed: false },
    { id: 1, keycode: 'KeyS', pressed: false },
    { id: 2, keycode: 'KeyD', pressed: false },
    { id: 3, keycode: 'KeyF', pressed: false },
    { id: 4, keycode: 'KeyG', pressed: false },
    { id: 5, keycode: 'KeyH', pressed: false },
    { id: 6, keycode: 'KeyJ', pressed: false },
    { id: 7, keycode: 'KeyK', pressed: false },
    { id: 8, keycode: 'KeyL', pressed: false },
    { id: 9, keycode: 'Semicolon', pressed: false },
    { id: 10, keycode: 'Quote', pressed: false },
    { id: 11, keycode: 'Backslash', pressed: false }
  ]
}

const KeyboardQWERTYSlice = createSlice({
  name: 'KeyboardQWERTY',
  initialState,
  reducers: {
    setKeyByCode: (
      state,
      action: PayloadAction<{ keycode: string; pressed: boolean }>
    ) => {
      state.naturalkeys = state.naturalkeys.map((m) => {
        if (m.keycode == action.payload.keycode) {
          return {
            id: m.id,
            keycode: action.payload.keycode,
            pressed: action.payload.pressed
          }
        } else {
          return m
        }
      })
    }
  }
})

export const { setKeyByCode } = KeyboardQWERTYSlice.actions
export default KeyboardQWERTYSlice.reducer
