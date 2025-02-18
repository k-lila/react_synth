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
      state.waves = state.waves.map((wave, i) =>
        i === action.payload.waveid
          ? { ...wave, gain: action.payload.gain }
          : wave
      )
    },
    setWavePhase: (
      state,
      action: PayloadAction<{ waveid: number; phase: number }>
    ) => {
      state.waves = state.waves.map((wave, i) =>
        i === action.payload.waveid
          ? { ...wave, phase: action.payload.phase }
          : wave
      )
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
      state.waves = state.waves.map((wave, i) =>
        i === action.payload.waveindex
          ? {
              ...wave,
              amplitudes: wave.amplitudes.map((amp, j) =>
                j === action.payload.amplitudeindex ? action.payload.gain : amp
              )
            }
          : wave
      )
    },
    adjustPhase: (
      state,
      action: PayloadAction<{
        waveindex: number
        phaseindex: number
        phase: number
      }>
    ) => {
      state.waves = state.waves.map((wave, i) =>
        i === action.payload.waveindex
          ? {
              ...wave,
              phases: wave.phases.map((ph, j) =>
                j === action.payload.phaseindex ? action.payload.phase : ph
              )
            }
          : wave
      )
    },
    addHarmonic: (state, action: PayloadAction<number>) => {
      state.waves = state.waves.map((wave, i) =>
        i === action.payload
          ? {
              ...wave,
              amplitudes: [
                ...wave.amplitudes,
                1 / (wave.amplitudes.length + 1)
              ],
              phases: [...wave.phases, 0]
            }
          : wave
      )
    },
    removeHarmonic: (state, action: PayloadAction<number>) => {
      state.waves = state.waves.map((wave, i) =>
        i === action.payload && wave.amplitudes.length > 1
          ? {
              ...wave,
              amplitudes: wave.amplitudes.slice(0, -1),
              phases: wave.phases.slice(0, -1)
            }
          : wave
      )
    },
    addFundamental: (state) => {
      state.waves = [
        ...state.waves,
        {
          type: 'sin',
          gain: 1,
          phase: 0,
          amplitudes: [1],
          phases: [0]
        }
      ]
    },
    removeFundamental: (state, action: PayloadAction<number>) => {
      if (state.waves.length > 1) {
        state.waves = state.waves.filter((_, i) => i !== action.payload)
      }
    },
    setWaveType: (
      state,
      action: PayloadAction<{ id: number; type: string }>
    ) => {
      state.waves = state.waves.map((wave, i) =>
        i === action.payload.id ? { ...wave, type: action.payload.type } : wave
      )
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
