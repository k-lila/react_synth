import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: SynthRecipe = {
  pitch: 440,
  gain: 0.7,
  scale: 'natural',
  waves: [
    {
      amplitudes: [1, 0.1, 0.3, 0.1, 0, 0.1],
      type: 'sin'
    }
  ]
}

const WaveRecipeSlice = createSlice({
  name: 'wave_recipe',
  initialState,
  reducers: {
    setPitch: (state, action: PayloadAction<number>) => {
      state.pitch = action.payload
    },
    setGain: (state, action: PayloadAction<number>) => {
      state.gain = action.payload
    },
    setScale: (state, action: PayloadAction<string>) => {
      state.scale = action.payload
    }
  }
})

export const { setPitch, setGain, setScale } = WaveRecipeSlice.actions
export default WaveRecipeSlice.reducer
