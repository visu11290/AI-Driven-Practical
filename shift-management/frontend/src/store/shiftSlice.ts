import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Shift } from '../types';

interface ShiftState {
  shifts: Shift[];
  priceRange: {
    min: number;
    max: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: ShiftState = {
  shifts: [],
  priceRange: {
    min: 0,
    max: 1000,
  },
  loading: false,
  error: null,
};

const API_URL = 'http://localhost:3000';

export const fetchShifts = createAsyncThunk(
  'shifts/fetchShifts',
  async () => {
    const response = await axios.get(`${API_URL}/shifts`);
    return response.data;
  }
);

export const fetchPriceRange = createAsyncThunk(
  'shifts/fetchPriceRange',
  async () => {
    const response = await axios.get(`${API_URL}/shifts/price-range`);
    return response.data;
  }
);

export const createShift = createAsyncThunk(
  'shifts/createShift',
  async (shift: Partial<Shift>) => {
    const response = await axios.post(`${API_URL}/shifts`, shift);
    return response.data;
  }
);

export const updateShift = createAsyncThunk(
  'shifts/updateShift',
  async ({ id, shift }: { id: string; shift: Partial<Shift> }) => {
    const response = await axios.patch(`${API_URL}/shifts/${id}`, shift);
    return response.data;
  }
);

export const deleteShift = createAsyncThunk(
  'shifts/deleteShift',
  async (id: string) => {
    await axios.delete(`${API_URL}/shifts/${id}`);
    return id;
  }
);

const shiftSlice = createSlice({
  name: 'shifts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShifts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = action.payload;
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch shifts';
      })
      .addCase(fetchPriceRange.fulfilled, (state, action) => {
        state.priceRange = action.payload;
      })
      .addCase(createShift.fulfilled, (state, action) => {
        state.shifts.push(action.payload);
      })
      .addCase(updateShift.fulfilled, (state, action) => {
        const index = state.shifts.findIndex((shift) => shift.id === action.payload.id);
        if (index !== -1) {
          state.shifts[index] = action.payload;
        }
      })
      .addCase(deleteShift.fulfilled, (state, action) => {
        state.shifts = state.shifts.filter((shift) => shift.id !== action.payload);
      });
  },
});

export default shiftSlice.reducer; 