import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: SynthRecipe = {
  pitch: 440,
  gain: 0.7,
  scale: 'chromatic',
  waves: [
    {
      type: 'sin',
      gain: 0.9,
      phase: 0,
      amplitudes: [0.66, -0.33],
      phases: [0, 0]
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
    setWaveGain: (
      state,
      action: PayloadAction<{ waveid: number; gain: number }>
    ) => {
      state.waves[action.payload.waveid].gain = action.payload.gain
    },
    setWavePhase: (
      state,
      action: PayloadAction<{ waveid: number; phase: number }>
    ) => {
      state.waves[action.payload.waveid].phase = action.payload.phase
    },
    setScale: (state, action: PayloadAction<string>) => {
      state.scale = action.payload
    },
    adjustGain: (
      state,
      action: PayloadAction<{
        waveindex: number
        amplitudeindex: number
        gain: number
      }>
    ) => {
      state.waves[action.payload.waveindex].amplitudes[
        action.payload.amplitudeindex
      ] = action.payload.gain
    },
    adjustPhase: (
      state,
      action: PayloadAction<{
        waveindex: number
        phaseindex: number
        phase: number
      }>
    ) => {
      state.waves[action.payload.waveindex].phases[action.payload.phaseindex] =
        action.payload.phase
    },
    addHarmonic: (state, action: PayloadAction<number>) => {
      state.waves[action.payload].amplitudes.push(
        1 / (state.waves[action.payload].amplitudes.length + 1)
      )
      state.waves[action.payload].phases.push(0)
    },
    removeHarmonic: (state, action: PayloadAction<number>) => {
      if (state.waves[action.payload].amplitudes.length > 1) {
        state.waves[action.payload].amplitudes = state.waves[
          action.payload
        ].amplitudes.slice(0, -1)
        state.waves[action.payload].phases = state.waves[
          action.payload
        ].phases.slice(0, -1)
      }
    },
    addFundamental: (state) => {
      state.waves.push({
        type: 'sin',
        gain: 1,
        phase: 0,
        amplitudes: [1],
        phases: [0]
      })
    },
    removeFundamental: (state, action: PayloadAction<number>) => {
      if (state.waves.length > 1) {
        state.waves = state.waves.filter((_, i) => i != action.payload)
      }
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
  adjustPhase,
  addHarmonic,
  removeHarmonic,
  addFundamental,
  removeFundamental,
  setWaveType,
  setWaveGain,
  setWavePhase
} = WaveRecipeSlice.actions
export default WaveRecipeSlice.reducer
