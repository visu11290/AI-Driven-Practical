import { configureStore } from '@reduxjs/toolkit';
import shiftReducer from './shiftSlice';

export const store = configureStore({
  reducer: {
    shifts: shiftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 