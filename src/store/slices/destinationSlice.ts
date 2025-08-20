/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { DESTINATION_ROUTES } from '@/config/routes';

interface ApiErrorResponse {
  message: string;
}

interface Destination {
  id: string;
  _id?: string; // MongoDB ID field (optional)
  name: string;
  description: string;
  images: string[];
  thumbnail: string;
  country: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  climate: string;
  bestTimeToVisit: string;
  currency: string;
  language: string;
  timezone: string;
  attractions: {
    name: string;
    description: string;
    images: string[];
  }[];
  tags: string[];
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

interface DestinationState {
  destinations: Destination[];
  currentDestination: Destination | null;
  popularDestinations: Destination[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: DestinationState = {
  destinations: [],
  currentDestination: null,
  popularDestinations: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

// Async thunks
export const fetchDestinations = createAsyncThunk(
  'destination/fetchDestinations',
  async (params: { page?: number; limit?: number; search?: string; country?: string; city?: string; tags?: string; isActive?: boolean }, { rejectWithValue }) => {
    try {
      const response = await axios.get(DESTINATION_ROUTES.LIST, { params });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching destinations:', error);
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to fetch destinations');
    }
  }
);

export const fetchDestination = createAsyncThunk(
  'destination/fetchDestination',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(DESTINATION_ROUTES.DETAILS(id));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching destination:', error);
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to fetch destination');
    }
  }
);

export const fetchPopularDestinations = createAsyncThunk(
  'destination/fetchPopularDestinations',
  async (limit: number = 6, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${DESTINATION_ROUTES.POPULAR}?limit=${limit}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to fetch popular destinations');
    }
  }
);

export const searchDestinations = createAsyncThunk(
  'destination/searchDestinations',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${DESTINATION_ROUTES.SEARCH}?q=${query}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to search destinations');
    }
  }
);

export const createDestination = createAsyncThunk(
  'destination/createDestination',
  async (destinationData: Omit<Destination, 'id'>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const response = await axios.post(DESTINATION_ROUTES.CREATE, destinationData, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to create destination');
    }
  }
);

export const updateDestination = createAsyncThunk(
  'destination/updateDestination',
  async ({ id, data }: { id: string; data: Partial<Destination> }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const response = await axios.put(DESTINATION_ROUTES.UPDATE(id), data, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to update destination');
    }
  }
);

export const deleteDestination = createAsyncThunk(
  'destination/deleteDestination',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      await axios.delete(DESTINATION_ROUTES.DELETE(id), {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return id;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to delete destination');
    }
  }
);

export const fetchDestinationsByCountry = createAsyncThunk(
  'destination/fetchDestinationsByCountry',
  async (country: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(DESTINATION_ROUTES.BY_COUNTRY(country));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to fetch destinations by country');
    }
  }
);

const destinationSlice = createSlice({
  name: 'destination',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentDestination: (state) => {
      state.currentDestination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Destinations
      .addCase(fetchDestinations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Handle MongoDB _id to id mapping
        const destinations = (action.payload.data || action.payload).map((dest: any) => ({
          ...dest,
          id: dest.id || dest._id // Use id if available, otherwise use _id
        }));
        
        state.destinations = destinations;
        state.pagination = action.payload.pagination || { page: 1, limit: 10, total: 0, pages: 0 };
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Single Destination
      .addCase(fetchDestination.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDestination.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Handle MongoDB _id to id mapping
        const destination = action.payload.data || action.payload;
        if (destination) {
          state.currentDestination = {
            ...destination,
            id: destination.id || destination._id // Use id if available, otherwise use _id
          };
        } else {
          state.currentDestination = null;
        }
      })
      .addCase(fetchDestination.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Popular Destinations
      .addCase(fetchPopularDestinations.fulfilled, (state, action) => {
        // Handle MongoDB _id to id mapping for popular destinations
        const destinations = (action.payload.data || action.payload).map((dest: any) => ({
          ...dest,
          id: dest.id || dest._id // Use id if available, otherwise use _id
        }));
        state.popularDestinations = destinations;
      })
      // Search Destinations
      .addCase(searchDestinations.fulfilled, (state, action) => {
        const destinations = (action.payload.data || action.payload).map((dest: any) => ({
          ...dest,
          id: dest.id || dest._id
        }));
        state.destinations = destinations;
      })
      // Create Destination
      .addCase(createDestination.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDestination.fulfilled, (state, action) => {
        state.isLoading = false;
        const destination = {
          ...action.payload.data,
          id: action.payload.data.id || action.payload.data._id
        };
        state.destinations.unshift(destination);
      })
      .addCase(createDestination.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Destination
      .addCase(updateDestination.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDestination.fulfilled, (state, action) => {
        state.isLoading = false;
        const destination = {
          ...action.payload.data,
          id: action.payload.data.id || action.payload.data._id
        };
        const index = state.destinations.findIndex(d => d.id === destination.id);
        if (index !== -1) {
          state.destinations[index] = destination;
        }
        if (state.currentDestination?.id === destination.id) {
          state.currentDestination = destination;
        }
      })
      .addCase(updateDestination.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Destination
      .addCase(deleteDestination.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDestination.fulfilled, (state, action) => {
        state.isLoading = false;
        state.destinations = state.destinations.filter(d => d.id !== action.payload);
        if (state.currentDestination?.id === action.payload) {
          state.currentDestination = null;
        }
      })
      .addCase(deleteDestination.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Destinations by Country
      .addCase(fetchDestinationsByCountry.fulfilled, (state, action) => {
        const destinations = (action.payload.data || action.payload).map((dest: any) => ({
          ...dest,
          id: dest.id || dest._id
        }));
        state.destinations = destinations;
      });
  },
});

export const { clearError, clearCurrentDestination } = destinationSlice.actions;
export default destinationSlice.reducer;
