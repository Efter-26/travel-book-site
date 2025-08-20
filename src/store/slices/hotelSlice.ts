import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { HOTEL_ROUTES } from '@/config/routes';

// Seasonal pricing helpers
const getSeasonalMultiplier = (): number => {
  const currentMonth = new Date().getMonth();
  if ((currentMonth >= 5 && currentMonth <= 7) || currentMonth === 11) {
    return 1.4; // Peak season
  } else if (currentMonth === 3 || currentMonth === 4 || currentMonth === 8 || currentMonth === 9) {
    return 1.2; // Shoulder season
  }
  return 0.8; // Off-peak
};

const applySeasonalPricingToHotel = <T extends Hotel | (Hotel & { _id?: string })>(hotel: T): T => {
  try {
    const seasonalMultiplier = getSeasonalMultiplier();

    const adjustedRoomTypes = Array.isArray(hotel.roomTypes)
      ? hotel.roomTypes.map((room) => ({
          ...room,
          price: Math.max(0, Math.round((room.price || 0) * seasonalMultiplier)),
        }))
      : [];

    const adjustedPriceRange = hotel.priceRange
      ? {
          ...hotel.priceRange,
          min: Math.max(0, Math.round((hotel.priceRange.min || 0) * seasonalMultiplier)),
          max: Math.max(0, Math.round((hotel.priceRange.max || 0) * seasonalMultiplier)),
        }
      : { min: 0, max: 0, currency: 'USD' };

    return {
      ...(hotel as object),
      roomTypes: adjustedRoomTypes,
      priceRange: adjustedPriceRange,
    } as T;
  } catch {
    return hotel;
  }
};

interface ApiErrorResponse {
  message: string;
}

// Hotel interface based on the provided model
interface Hotel {
  id: string;
  _id?: string;
  name: string;
  description: string;
  destination: {
    id: string;
    name: string;
    city: string;
    country: string;
  };
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  thumbnail: string;
  rating: number;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  amenities: string[];
  roomTypes: {
    name: string;
    description: string;
    price: number;
    capacity: number;
    available: number;
  }[];
  partner: {
    id: string;
    name: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface HotelState {
  hotels: Hotel[];
  currentHotel: Hotel | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: HotelState = {
  hotels: [],
  currentHotel: null,
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
export const fetchHotels = createAsyncThunk(
  'hotel/fetchHotels',
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    destination?: string;
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    amenities?: string[];
  }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.destination) queryParams.append('destination', params.destination);
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
      if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.rating) queryParams.append('rating', params.rating.toString());
      if (params.amenities && params.amenities.length > 0) {
        queryParams.append('amenities', params.amenities.join(','));
      }

      const response = await axios.get(`${HOTEL_ROUTES.LIST}?${queryParams}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to fetch hotels');
    }
  }
);

export const fetchHotel = createAsyncThunk(
  'hotel/fetchHotel',
  async (hotelId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(HOTEL_ROUTES.DETAILS(hotelId));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to fetch hotel');
    }
  }
);

export const createHotel = createAsyncThunk(
  'hotel/createHotel',
  async (hotelData: Omit<Hotel, 'id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post(HOTEL_ROUTES.CREATE, hotelData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to create hotel');
    }
  }
);

export const updateHotel = createAsyncThunk(
  'hotel/updateHotel',
  async ({ id, hotelData }: { id: string; hotelData: Partial<Hotel> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(HOTEL_ROUTES.UPDATE(id), hotelData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to update hotel');
    }
  }
);

export const deleteHotel = createAsyncThunk(
  'hotel/deleteHotel',
  async (hotelId: string, { rejectWithValue }) => {
    try {
      await axios.delete(HOTEL_ROUTES.DELETE(hotelId));
      return hotelId;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to delete hotel');
    }
  }
);

export const searchHotels = createAsyncThunk(
  'hotel/searchHotels',
  async (searchTerm: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${HOTEL_ROUTES.SEARCH}?q=${searchTerm}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to search hotels');
    }
  }
);

const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentHotel: (state) => {
      state.currentHotel = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Hotels
      .addCase(fetchHotels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.isLoading = false;
        const hotels = (action.payload.data || action.payload).map((rawHotel: Hotel & { _id?: string }) => {
          const withId = { ...rawHotel, id: rawHotel.id || rawHotel._id } as Hotel & { _id?: string };
          const adjusted = applySeasonalPricingToHotel(withId);
          return adjusted;
        });
        state.hotels = hotels;
        state.pagination = action.payload.pagination || { page: 1, limit: 10, total: 0, pages: 0 };
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Single Hotel
      .addCase(fetchHotel.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHotel.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Handle different response formats
        let hotel;
        if (action.payload.data) {
          hotel = action.payload.data;
        } else if (action.payload.hotel) {
          hotel = action.payload.hotel;
        } else if (action.payload.success && action.payload.data) {
          hotel = action.payload.data;
        } else {
          hotel = action.payload;
        }
        
        if (hotel) {
          const withId = { ...hotel, id: hotel.id || hotel._id } as Hotel & { _id?: string };
          const adjusted = applySeasonalPricingToHotel(withId);
          state.currentHotel = adjusted;
        } else {
          state.error = 'No hotel data found in response';
        }
      })
      .addCase(fetchHotel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Hotel
      .addCase(createHotel.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.isLoading = false;
        const hotel = action.payload.data || action.payload;
        state.hotels.unshift({
          ...hotel,
          id: hotel.id || hotel._id
        });
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Hotel
      .addCase(updateHotel.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedHotel = action.payload.data || action.payload;
        const hotelId = updatedHotel.id || updatedHotel._id;
        
        // Update in hotels array
        const index = state.hotels.findIndex(hotel => hotel.id === hotelId);
        if (index !== -1) {
          state.hotels[index] = {
            ...updatedHotel,
            id: hotelId
          };
        }
        
        // Update current hotel if it's the same
        if (state.currentHotel && state.currentHotel.id === hotelId) {
          state.currentHotel = {
            ...updatedHotel,
            id: hotelId
          };
        }
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Hotel
      .addCase(deleteHotel.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedHotelId = action.payload;
        state.hotels = state.hotels.filter(hotel => hotel.id !== deletedHotelId);
        if (state.currentHotel && state.currentHotel.id === deletedHotelId) {
          state.currentHotel = null;
        }
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Search Hotels
      .addCase(searchHotels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchHotels.fulfilled, (state, action) => {
        state.isLoading = false;
        const hotels = (action.payload.data || action.payload).map((hotel: Hotel & { _id?: string }) => ({
          ...hotel,
          id: hotel.id || hotel._id
        }));
        state.hotels = hotels;
      })
      .addCase(searchHotels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentHotel } = hotelSlice.actions;
export default hotelSlice.reducer;
