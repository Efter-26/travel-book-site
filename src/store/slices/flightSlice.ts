import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { FLIGHT_ROUTES } from '@/config/routes';

interface ApiErrorResponse {
  message: string;
}

// Flight interface based on typical flight data structure
export interface Flight {
  id: string;
  _id?: string;
  flightNumber: string;
  airline: {
    id: string;
    name: string;
    code: string;
    logo?: string;
  };
  departure: {
    airport: {
      code: string;
      name: string;
      city: string;
      country: string;
    };
    time: string;
    terminal?: string;
  };
  arrival: {
    airport: {
      code: string;
      name: string;
      city: string;
      country: string;
    };
    time: string;
    terminal?: string;
  };
  duration: number; // in minutes
  distance: number; // in kilometers
  aircraft: {
    type: string;
    model: string;
    capacity: number;
  };
  seats: {
    economy: {
      available: number;
      price: number;
    };
    business: {
      available: number;
      price: number;
    };
    first: {
      available: number;
      price: number;
    };
  };
  stops: number;
  layovers?: {
    airport: string;
    duration: number;
  }[];
  amenities: string[];
  price?: {
    economy: number;
    business: number;
    first: number;
    currency: string;
  };
  availableSeats?: {
    economy: number;
    business: number;
    first: number;
  };
  baggage: {
    carryOn: {
      weight: number;
      dimensions: string;
    };
    checked: {
      weight: number;
      dimensions: string;
    };
  };
  cancellationPolicy: string;
  refundPolicy: string;
  isActive: boolean;
  partner: {
    id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface FlightState {
  flights: Flight[];
  currentFlight: Flight | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: FlightState = {
  flights: [],
  currentFlight: null,
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
export const fetchFlights = createAsyncThunk(
  'flight/fetchFlights',
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    departure?: string;
    arrival?: string;
    airline?: string;
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
    stops?: number;
    class?: string;
  }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.departure) queryParams.append('departure', params.departure);
      if (params.arrival) queryParams.append('arrival', params.arrival);
      if (params.airline) queryParams.append('airline', params.airline);
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
      if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.stops !== undefined) queryParams.append('stops', params.stops.toString());
      if (params.class) queryParams.append('class', params.class);

      const response = await axios.get(`${FLIGHT_ROUTES.LIST}?${queryParams}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to fetch flights');
    }
  }
);

export const fetchFlight = createAsyncThunk(
  'flight/fetchFlight',
  async (flightId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(FLIGHT_ROUTES.DETAILS(flightId));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to fetch flight');
    }
  }
);

export const createFlight = createAsyncThunk(
  'flight/createFlight',
  async (flightData: Omit<Flight, 'id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post(FLIGHT_ROUTES.CREATE, flightData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to create flight');
    }
  }
);

export const updateFlight = createAsyncThunk(
  'flight/updateFlight',
  async ({ id, flightData }: { id: string; flightData: Partial<Flight> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(FLIGHT_ROUTES.UPDATE(id), flightData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to update flight');
    }
  }
);

export const deleteFlight = createAsyncThunk(
  'flight/deleteFlight',
  async (flightId: string, { rejectWithValue }) => {
    try {
      await axios.delete(FLIGHT_ROUTES.DELETE(flightId));
      return flightId;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to delete flight');
    }
  }
);

export const searchFlights = createAsyncThunk(
  'flight/searchFlights',
  async (searchTerm: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${FLIGHT_ROUTES.SEARCH}?q=${searchTerm}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to search flights');
    }
  }
);

const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentFlight: (state) => {
      state.currentFlight = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Flights
      .addCase(fetchFlights.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.isLoading = false;
        const flights = (action.payload.data || action.payload).map((flight: Flight & { _id?: string }) => ({
          ...flight,
          id: flight.id || flight._id
        }));
        state.flights = flights;
        state.pagination = action.payload.pagination || { page: 1, limit: 10, total: 0, pages: 0 };
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Single Flight
      .addCase(fetchFlight.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFlight.fulfilled, (state, action) => {
        state.isLoading = false;
        const flight = action.payload.data || action.payload;
        if (flight) {
          state.currentFlight = {
            ...flight,
            id: flight.id || flight._id
          };
        } else {
          state.currentFlight = null;
        }
      })
      .addCase(fetchFlight.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Flight
      .addCase(createFlight.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFlight.fulfilled, (state, action) => {
        state.isLoading = false;
        const flight = action.payload.data || action.payload;
        state.flights.unshift({
          ...flight,
          id: flight.id || flight._id
        });
      })
      .addCase(createFlight.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Flight
      .addCase(updateFlight.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFlight.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedFlight = action.payload.data || action.payload;
        const flightId = updatedFlight.id || updatedFlight._id;
        
        // Update in flights array
        const index = state.flights.findIndex(flight => flight.id === flightId);
        if (index !== -1) {
          state.flights[index] = {
            ...updatedFlight,
            id: flightId
          };
        }
        
        // Update current flight if it's the one being updated
        if (state.currentFlight && state.currentFlight.id === flightId) {
          state.currentFlight = {
            ...updatedFlight,
            id: flightId
          };
        }
      })
      .addCase(updateFlight.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Flight
      .addCase(deleteFlight.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFlight.fulfilled, (state, action) => {
        state.isLoading = false;
        state.flights = state.flights.filter(flight => flight.id !== action.payload);
        if (state.currentFlight && state.currentFlight.id === action.payload) {
          state.currentFlight = null;
        }
      })
      .addCase(deleteFlight.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Search Flights
      .addCase(searchFlights.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchFlights.fulfilled, (state, action) => {
        state.isLoading = false;
        const flights = (action.payload.data || action.payload).map((flight: Flight & { _id?: string }) => ({
          ...flight,
          id: flight.id || flight._id
        }));
        state.flights = flights;
      })
      .addCase(searchFlights.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentFlight } = flightSlice.actions;
export default flightSlice.reducer;
