import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import * as api from '../../api';
import type { Car } from '../../types';
import { randomCarName, randomColor } from '../../utils';

const CARS_PER_PAGE = 7;
const RANDOM_CARS_COUNT = 100;
const BATCH_SIZE = 10;

interface GarageState {
  cars: Car[];
  total: number;
  page: number;
  loading: boolean;
  error: string | null;
  selectedCar: Car | null;
  createName: string;
  createColor: string;
  editName: string;
  editColor: string;
}

const initialState: GarageState = {
  cars: [],
  total: 0,
  page: 1,
  loading: false,
  error: null,
  selectedCar: null,
  createName: '',
  createColor: '#e66465',
  editName: '',
  editColor: '#e66465',
};

export const fetchCars = createAsyncThunk(
  'garage/fetchCars',
  async (page: number) => api.getCars(page),
);

export const createCar = createAsyncThunk(
  'garage/createCar',
  async ({ name, color }: { name: string; color: string }) => api.createCar(name, color),
);

export const updateCar = createAsyncThunk(
  'garage/updateCar',
  async ({ id, name, color }: { id: number; name: string; color: string }) => api.updateCar(id, name, color),
);

export const deleteCar = createAsyncThunk(
  'garage/deleteCar',
  async ({ id, page }: { id: number; page: number }) => {
    await api.deleteCar(id);
    try { await api.deleteWinner(id); } catch (_) { /* not a winner */ }
    return { id, page };
  },
);

// Send 10 at a time to prevent server/browser freeze from 100 parallel requests
const createBatch = (count: number): Promise<Car[]> => Promise.all(
  Array.from({ length: count }, () => api.createCar(randomCarName(), randomColor())),
);

export const createRandomCars = createAsyncThunk(
  'garage/createRandomCars',
  async () => {
    const results: Car[] = [];
    const batches = Math.ceil(RANDOM_CARS_COUNT / BATCH_SIZE);
    for (let i = 0; i < batches; i += 1) {
      const count = Math.min(BATCH_SIZE, RANDOM_CARS_COUNT - i * BATCH_SIZE);
      // eslint-disable-next-line no-await-in-loop
      const batch = await createBatch(count);
      results.push(...batch);
    }
    return results;
  },
);

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    selectCar(state, action: PayloadAction<Car>) {
      state.selectedCar = action.payload;
      state.editName = action.payload.name;
      state.editColor = action.payload.color;
    },
    clearSelected(state) {
      state.selectedCar = null;
      state.editName = '';
      state.editColor = '#e66465';
    },
    setCreateName(state, action: PayloadAction<string>) {
      state.createName = action.payload;
    },
    setCreateColor(state, action: PayloadAction<string>) {
      state.createColor = action.payload;
    },
    setEditName(state, action: PayloadAction<string>) {
      state.editName = action.payload;
    },
    setEditColor(state, action: PayloadAction<string>) {
      state.editColor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.cars = action.payload.cars;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load cars. The server may be waking up — please retry.';
      })
      .addCase(createCar.fulfilled, (state, action) => {
        state.total += 1;
        const pageCount = Math.ceil(state.total / CARS_PER_PAGE);
        if (state.page === pageCount || state.total <= CARS_PER_PAGE) {
          state.cars.push(action.payload);
        }
        state.createName = '';
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        const idx = state.cars.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.cars[idx] = action.payload;
        state.selectedCar = null;
        state.editName = '';
        state.editColor = '#e66465';
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.cars = state.cars.filter((c) => c.id !== action.payload.id);
        state.total -= 1;
        const maxPage = Math.max(1, Math.ceil(state.total / CARS_PER_PAGE));
        if (state.page > maxPage) state.page = maxPage;
      })
      .addCase(createRandomCars.fulfilled, (state) => {
        state.total += RANDOM_CARS_COUNT;
      });
  },
});

export const {
  setPage, selectCar, clearSelected,
  setCreateName, setCreateColor,
  setEditName, setEditColor,
} = garageSlice.actions;

export default garageSlice.reducer;
