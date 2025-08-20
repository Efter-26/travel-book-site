import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { RootState } from '..';
import { BOOKING_ROUTES } from '@/config/routes';

interface ApiErrorResponse {
  message: string;
}

interface Booking {
  id: string;
  bookingNumber: string;
  title: string;
  image: string;
  location: string;
  type: 'hotel' | 'flight' | 'package' | 'tour';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  currency: string;
  discountAmount?: number;
  discountCode?: string;
  loyaltyPointsUsed?: number;
  loyaltyPointsEarned?: number;
  paymentMethod: string;
  createdAt: string;
}

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData: Omit<Booking, 'id' | 'createdAt'>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Authentication required. Please log in.');
      }

      const response = await axios.post(BOOKING_ROUTES.CREATE, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        return rejectWithValue('Authentication failed. Please log in again.');
      }
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to create booking');
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  'booking/fetchUserBookings',
  async (params: { page?: number; limit?: number }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Authentication required. Please log in.');
      }

      const response = await axios.get(BOOKING_ROUTES.USER_BOOKINGS, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        return rejectWithValue('Authentication failed. Please log in again.');
      }
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to fetch bookings');
    }
  }
);

export const fetchMyBookings = createAsyncThunk(
  'booking/fetchMyBookings',
  async (params: { page?: number; limit?: number }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Authentication required. Please log in.');
      }

      const response = await axios.get(BOOKING_ROUTES.USER_BOOKINGS, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        return rejectWithValue('Authentication failed. Please log in again.');
      }
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to fetch bookings');
    }
  }
);

export const fetchBooking = createAsyncThunk(
  'booking/fetchBooking',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Authentication required. Please log in.');
      }

      const response = await axios.get(BOOKING_ROUTES.DETAILS(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        return rejectWithValue('Authentication failed. Please log in again.');
      }
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to fetch booking');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancelBooking',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Authentication required. Please log in.');
      }

      const response = await axios.put(BOOKING_ROUTES.CANCEL(id), {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        return rejectWithValue('Authentication failed. Please log in again.');
      }
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to cancel booking');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBooking = action.payload.data;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBooking = action.payload.data;
      })
      .addCase(fetchBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the booking status in the list
        const bookingIndex = state.bookings.findIndex(b => b.id === action.payload.data.id);
        if (bookingIndex !== -1) {
          state.bookings[bookingIndex] = action.payload.data;
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
