import { configureStore } from '@reduxjs/toolkit'

import recipeReducer from './reducers/recipe'
import synthDataReducer from './reducers/synthdata'

const store = configureStore({
  reducer: {
    recipe: recipeReducer,
    synthdata: synthDataReducer
  }
})

export type RootReducer = ReturnType<typeof store.getState>
export default store
