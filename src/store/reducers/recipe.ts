import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: SynthRecipe = {
  pitch: 440,
  gain: 0.7,
  scale: 'natural',
  waves: [
    {
      amplitudes: [1, 0.1, 0.4, 0.3, 0.1, 0.1],
      type: 'sin'
    },
    {
      amplitudes: [1, 0.1, 0.2],
      type: 'tri'
    },
    {
      amplitudes: [0.1, 0.05, 0.1],
      type: 'square'
    },
    {
      amplitudes: [0.1, 0.05, 0.1],
      type: 'saw'
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
    },
    adjustGain: (
      state,
      action: PayloadAction<{ index: number; j: number; gain: number }>
    ) => {
      state.waves[action.payload.index].amplitudes[action.payload.j] =
        action.payload.gain
    },
    addHarmonic: (state, action: PayloadAction<number>) => {
      state.waves[action.payload].amplitudes.push(
        1 / (state.waves[action.payload].amplitudes.length + 1)
      )
    },
    removeHarmonic: (state, action: PayloadAction<number>) => {
      if (state.waves[action.payload].amplitudes.length > 1) {
        state.waves[action.payload].amplitudes = state.waves[
          action.payload
        ].amplitudes.slice(0, -1)
      }
    },
    addFundamental: (state) => {
      state.waves.push({ type: 'sin', amplitudes: [1] })
    },
    removeFundamental: (state, action: PayloadAction<number>) => {
      state.waves = state.waves.filter((_, i) => i != action.payload)
    },
    setWaveType: (
      state,
      action: PayloadAction<{ id: number; type: string }>
    ) => {
      state.waves[action.payload.id].type = action.payload.type
    }
  }
})

export const {
  setPitch,
  setGain,
  setScale,
  adjustGain,
  addHarmonic,
  removeHarmonic,
  addFundamental,
  removeFundamental,
  setWaveType
} = WaveRecipeSlice.actions
export default WaveRecipeSlice.reducer
