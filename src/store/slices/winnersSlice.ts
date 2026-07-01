import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import * as api from '../../api';
import type { WinnerWithCar, SortField, SortOrder } from '../../types';

interface WinnersState {
  winners: WinnerWithCar[];
  total: number;
  page: number;
  sort: SortField;
  order: SortOrder;
  loading: boolean;
}

const initialState: WinnersState = {
  winners: [],
  total: 0,
  page: 1,
  sort: 'wins',
  order: 'DESC',
  loading: false,
};

export const fetchWinners = createAsyncThunk(
  'winners/fetchWinners',
  async ({
    page,
    sort,
    order,
  }: {
    page: number;
    sort: SortField;
    order: SortOrder;
  }) => {
    const { winners, total } = await api.getWinners(page, sort, order);
    const withCars = await Promise.all(
      winners.map(async (w) => ({
        ...w,
        car: await api.getCar(w.id),
      })),
    );
    return { winners: withCars, total };
  },
);

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSort(state, action: PayloadAction<{ sort: SortField; order: SortOrder }>) {
      state.sort = action.payload.sort;
      state.order = action.payload.order;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWinners.pending, (state) => { state.loading = true; })
      .addCase(fetchWinners.fulfilled, (state, action) => {
        state.winners = action.payload.winners;
        state.total = action.payload.total;
        state.loading = false;
      });
  },
});

export const { setPage, setSort } = winnersSlice.actions;
export default winnersSlice.reducer;
