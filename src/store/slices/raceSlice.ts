import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type CarStatus = 'idle' | 'starting' | 'driving' | 'stopping' | 'broken' | 'finished' | 'stopped';

interface CarRace {
  id: number;
  status: CarStatus;
  progress: number;
}

interface RaceState {
  isRacing: boolean;
  isResetting: boolean;
  winner: { id: number; name: string; time: number } | null;
  showWinner: boolean;
  cars: Record<number, CarRace>;
}

const initialState: RaceState = {
  isRacing: false,
  isResetting: false,
  winner: null,
  showWinner: false,
  cars: {},
};

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    initCars(state, action: PayloadAction<number[]>) {
      action.payload.forEach((id) => {
        state.cars[id] = { id, status: 'idle', progress: 0 };
      });
    },
    setCarStatus(
      state,
      action: PayloadAction<{ id: number; status: CarStatus }>,
    ) {
      const { id, status } = action.payload;
      if (state.cars[id]) state.cars[id].status = status;
    },
    setCarProgress(
      state,
      action: PayloadAction<{ id: number; progress: number }>,
    ) {
      const { id, progress } = action.payload;
      if (state.cars[id]) state.cars[id].progress = progress;
    },
    setRacing(state, action: PayloadAction<boolean>) {
      state.isRacing = action.payload;
    },
    setResetting(state, action: PayloadAction<boolean>) {
      state.isResetting = action.payload;
    },
    setWinner(
      state,
      action: PayloadAction<{ id: number; name: string; time: number } | null>,
    ) {
      state.winner = action.payload;
      state.showWinner = action.payload !== null;
    },
    hideWinner(state) {
      state.showWinner = false;
    },
    resetAll(state) {
      Object.keys(state.cars).forEach((key) => {
        const id = Number(key);
        state.cars[id] = { id, status: 'idle', progress: 0 };
      });
      state.isRacing = false;
      state.isResetting = false;
      state.winner = null;
      state.showWinner = false;
    },
    removeCar(state, action: PayloadAction<number>) {
      delete state.cars[action.payload];
    },
  },
});

export const {
  initCars,
  setCarStatus,
  setCarProgress,
  setRacing,
  setResetting,
  setWinner,
  hideWinner,
  resetAll,
  removeCar,
} = raceSlice.actions;

export default raceSlice.reducer;
