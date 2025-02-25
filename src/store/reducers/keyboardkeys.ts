import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Key = {
  id: number
  keycode: string
  pressed: boolean
}

type KeyboardQWERTY = {
  naturalkeys: Array<Key>
  flatkeys: Array<Key>
  sharpkeys: Array<Key>
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
  ],
  flatkeys: [
    { id: 100, keycode: 'Digit2', pressed: false },
    { id: 101, keycode: 'Digit3', pressed: false },
    { id: 102, keycode: 'Digit4', pressed: false },
    { id: 103, keycode: 'Digit5', pressed: false },
    { id: 104, keycode: 'Digit6', pressed: false },
    { id: 105, keycode: 'Digit7', pressed: false },
    { id: 106, keycode: 'Digit8', pressed: false },
    { id: 107, keycode: 'Digit9', pressed: false },
    { id: 108, keycode: 'Digit0', pressed: false },
    { id: 109, keycode: 'Minus', pressed: false },
    { id: 1010, keycode: 'Equal', pressed: false }
  ],
  sharpkeys: [
    { id: 110, keycode: 'KeyW', pressed: false },
    { id: 111, keycode: 'KeyE', pressed: false },
    { id: 112, keycode: 'KeyR', pressed: false },
    { id: 113, keycode: 'KeyT', pressed: false },
    { id: 114, keycode: 'KeyY', pressed: false },
    { id: 115, keycode: 'KeyU', pressed: false },
    { id: 116, keycode: 'KeyI', pressed: false },
    { id: 117, keycode: 'KeyO', pressed: false },
    { id: 118, keycode: 'KeyP', pressed: false },
    { id: 119, keycode: 'BracketLeft', pressed: false },
    { id: 1110, keycode: 'BracketRight', pressed: false }
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
      const updateKeys = (keys: Key[]) =>
        keys.map((key) =>
          key.keycode === action.payload.keycode
            ? { ...key, pressed: action.payload.pressed }
            : key
        )
      state.naturalkeys = updateKeys(state.naturalkeys)
      state.flatkeys = updateKeys(state.flatkeys)
      state.sharpkeys = updateKeys(state.sharpkeys)
    },
    setKeyById: (
      state,
      action: PayloadAction<{ keyid: number; pressed: boolean }>
    ) => {
      const updateKeys = (keys: Key[]) =>
        keys.map((key) =>
          key.id === action.payload.keyid
            ? { ...key, pressed: action.payload.pressed }
            : key
        )
      state.naturalkeys = updateKeys(state.naturalkeys)
    },
    setChromaticKeyById: (
      state,
      action: PayloadAction<{ keyid: number; pressed: boolean }>
    ) => {
      state.sharpkeys = state.sharpkeys.map((key) =>
        key.id === action.payload.keyid
          ? { ...key, pressed: action.payload.pressed }
          : key
      )
    },
    setNaturalKeyById: (
      state,
      action: PayloadAction<{ keyid: number; pressed: boolean; flat?: boolean }>
    ) => {
      const keyList = action.payload.flat ? 'flatkeys' : 'sharpkeys'
      state[keyList] = state[keyList].map((key) =>
        key.id === action.payload.keyid
          ? { ...key, pressed: action.payload.pressed }
          : key
      )
    }
  }
})

export const {
  setKeyByCode,
  setKeyById,
  setChromaticKeyById,
  setNaturalKeyById
} = KeyboardQWERTYSlice.actions
export default KeyboardQWERTYSlice.reducer
