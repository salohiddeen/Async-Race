import { configureStore } from '@reduxjs/toolkit';
import garageReducer from './slices/garageSlice';
import raceReducer from './slices/raceSlice';
import winnersReducer from './slices/winnersSlice';

export const store = configureStore({
  reducer: {
    garage: garageReducer,
    race: raceReducer,
    winners: winnersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
