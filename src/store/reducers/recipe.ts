import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type WaveRecipe = {
  pitch: number
  intensity: number
  scale: string
  waves: Array<{ type: string; intensities: number[] }>
}

const initialState: WaveRecipe = {
  pitch: 440,
  intensity: 0.7,
  scale: 'chromatic',
  waves: [
    {
      intensities: [1, 0.5, 0.25, 0.1],
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
    setIntensity: (state, action: PayloadAction<number>) => {
      state.intensity = action.payload
    },
    setScale: (state, action: PayloadAction<string>) => {
      state.scale = action.payload
    }
  }
})

export const { setPitch, setIntensity, setScale } = WaveRecipeSlice.actions
export default WaveRecipeSlice.reducer
