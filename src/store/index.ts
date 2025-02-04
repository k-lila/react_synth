import { configureStore } from '@reduxjs/toolkit'

import recipeReducer from './reducers/recipe'
import synthDataReducer from './reducers/synthdata'
import keyboardKeysReducer from './reducers/keyboardkeys'

const store = configureStore({
  reducer: {
    recipe: recipeReducer,
    synthdata: synthDataReducer,
    keyboardkeys: keyboardKeysReducer
  }
})

export type RootReducer = ReturnType<typeof store.getState>
export default store
