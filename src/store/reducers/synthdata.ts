import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type SynthData = {
  naturalkeyboard: number[][]
}

const initialState: SynthData = {
  naturalkeyboard: []
}
const SynthDataSlice = createSlice({
  name: 'synthdata',
  initialState,
  reducers: {
    setNaturalKeyboard: (state, action: PayloadAction<number[][]>) => {
      state.naturalkeyboard = action.payload
    }
  }
})

export const { setNaturalKeyboard } = SynthDataSlice.actions
export default SynthDataSlice.reducer
