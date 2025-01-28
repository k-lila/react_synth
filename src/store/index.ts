import { configureStore } from '@reduxjs/toolkit'

import recipeReducer from './reducers/recipe'

const store = configureStore({
  reducer: {
    recipe: recipeReducer
  }
})

export type RootReducer = ReturnType<typeof store.getState>
export default store
