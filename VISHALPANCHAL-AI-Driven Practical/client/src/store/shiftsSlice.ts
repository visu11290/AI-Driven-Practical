import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '@/lib/queryClient';
import { ShiftWithDates, ShiftType } from '@shared/schema';

// Define types for the state
interface ShiftsState {
  shifts: ShiftWithDates[];
  filteredShifts: ShiftWithDates[];
  currentShift: ShiftWithDates | null;
  loading: boolean;
  error: string | null;
  priceRange: {
    min: number;
    max: number;
    current: number;
  };
  activeType: string | null;
}

// Initial state
const initialState: ShiftsState = {
  shifts: [],
  filteredShifts: [],
  currentShift: null,
  loading: false,
  error: null,
  priceRange: {
    min: 0,
    max: 500,
    current: 500
  },
  activeType: null
};

// Async thunks
export const fetchShifts = createAsyncThunk(
  'shifts/fetchShifts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('GET', '/api/shifts', undefined);
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createShift = createAsyncThunk(
  'shifts/createShift',
  async (shiftData: any, { rejectWithValue }) => {
    try {
      const response = await apiRequest('POST', '/api/shifts', shiftData);
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateShift = createAsyncThunk(
  'shifts/updateShift',
  async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('PUT', `/api/shifts/${id}`, data);
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteShift = createAsyncThunk(
  'shifts/deleteShift',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiRequest('DELETE', `/api/shifts/${id}`, undefined);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const filterShiftsByPrice = createAsyncThunk(
  'shifts/filterByPrice',
  async ({ minPrice, maxPrice }: { minPrice: number, maxPrice: number }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('POST', '/api/shifts/filter/price', { minPrice, maxPrice });
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const filterShiftsByType = createAsyncThunk(
  'shifts/filterByType',
  async (type: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest('POST', '/api/shifts/filter/type', { type });
      return { shifts: await response.json(), type };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const checkOverlappingShifts = createAsyncThunk(
  'shifts/checkOverlap',
  async (data: { date: string, startTime: string, endTime: string, type: string, excludeShiftId?: number }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('POST', '/api/shifts/check-overlap', data);
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const shiftsSlice = createSlice({
  name: 'shifts',
  initialState,
  reducers: {
    setCurrentShift: (state, action: PayloadAction<ShiftWithDates | null>) => {
      state.currentShift = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<{ min: number, max: number }>) => {
      state.priceRange.min = action.payload.min;
      state.priceRange.max = action.payload.max;
    },
    setCurrentPrice: (state, action: PayloadAction<number>) => {
      state.priceRange.current = action.payload;
    },
    clearTypeFilter: (state) => {
      state.activeType = null;
      state.filteredShifts = state.shifts;
    },
    calculatePriceRange: (state) => {
      // Calculate min and max price from all shifts
      if (state.shifts.length > 0) {
        const prices = state.shifts.map(shift => shift.price);
        state.priceRange.min = Math.min(...prices);
        state.priceRange.max = Math.max(...prices);
        state.priceRange.current = state.priceRange.max;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchShifts
      .addCase(fetchShifts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.shifts = action.payload;
        state.filteredShifts = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle createShift
      .addCase(createShift.pending, (state) => {
        state.loading = true;
      })
      .addCase(createShift.fulfilled, (state, action) => {
        state.shifts.push(action.payload);
        state.filteredShifts = state.shifts;
        state.loading = false;
        state.error = null;
      })
      .addCase(createShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle updateShift
      .addCase(updateShift.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateShift.fulfilled, (state, action) => {
        const index = state.shifts.findIndex(shift => shift.id === action.payload.id);
        if (index !== -1) {
          state.shifts[index] = action.payload;
        }
        state.filteredShifts = state.shifts;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle deleteShift
      .addCase(deleteShift.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteShift.fulfilled, (state, action) => {
        state.shifts = state.shifts.filter(shift => shift.id !== action.payload);
        state.filteredShifts = state.filteredShifts.filter(shift => shift.id !== action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle filterShiftsByPrice
      .addCase(filterShiftsByPrice.pending, (state) => {
        state.loading = true;
      })
      .addCase(filterShiftsByPrice.fulfilled, (state, action) => {
        state.filteredShifts = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(filterShiftsByPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle filterShiftsByType
      .addCase(filterShiftsByType.pending, (state) => {
        state.loading = true;
      })
      .addCase(filterShiftsByType.fulfilled, (state, action) => {
        state.filteredShifts = action.payload.shifts;
        state.activeType = action.payload.type;
        state.loading = false;
        state.error = null;
      })
      .addCase(filterShiftsByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  }
});

export const { 
  setCurrentShift, 
  setPriceRange, 
  setCurrentPrice, 
  clearTypeFilter,
  calculatePriceRange
} = shiftsSlice.actions;

export default shiftsSlice.reducer;
