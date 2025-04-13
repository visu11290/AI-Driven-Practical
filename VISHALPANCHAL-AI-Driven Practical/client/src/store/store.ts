import { configureStore } from '@reduxjs/toolkit';
import shiftsReducer from './shiftsSlice';

export const store = configureStore({
  reducer: {
    shifts: shiftsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
