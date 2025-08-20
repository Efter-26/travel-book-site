import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PACKAGE_ROUTES } from '@/config/routes';

export interface Package {
  id: string;
  _id?: string;
  title: string;
  description: string;
  destination: {
    id: string;
    name: string;
    country: string;
    city: string;
    thumbnail: string;
  };
  duration: {
    days: number;
    nights: number;
  };
  flights: Array<{
    id: string;
    flightNumber: string;
    airline: string;
    departure: {
      airport: string;
      city: string;
      time: string;
    };
    arrival: {
      airport: string;
      city: string;
      time: string;
    };
    _id: string;
  }>;
  hotels: Array<{
    id: string;
    name: string;
    address: string;
    rating: number;
    roomType: string;
    nights: number;
    amenities: string[];
    images: string[];
    _id: string;
  }>;
  activities: Array<{
    day: number;
    title: string;
    description: string;
    _id: string;
  }>;
  tourGuide: {
    id: string;
    name: string;
    language: string[];
    phone: string;
    email: string;
    rating: number;
    _id: string;
  };
  price: {
    perPerson: {
      economy: number;
      business: number;
      first: number;
    };
    currency: string;
  };
  loyalty: {
    pointsEarned: number;
    promoCodeApplicable: boolean;
    minPointsRequiredForPromo: number;
    availablePromoCodes: Array<{
      code: string;
      discountPercentage: number;
      description: string;
      _id: string;
    }>;
    _id: string;
  };
  availability: {
    startDate: string;
    endDate: string;
    slotsAvailable: number;
    _id: string;
  };
  partner: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
    _id: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PackageFilters {
  search?: string;
  category?: string;
  priceRange?: [number, number];
  duration?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

interface PackageState {
  packages: Package[];
  featuredPackages: Package[];
  selectedPackage: Package | null;
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: PackageState = {
  packages: [],
  featuredPackages: [],
  selectedPackage: null,
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

// Async thunks
export const fetchPackages = createAsyncThunk(
  'package/fetchPackages',
  async (filters: PackageFilters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.priceRange) {
        queryParams.append('minPrice', filters.priceRange[0].toString());
        queryParams.append('maxPrice', filters.priceRange[1].toString());
      }
      if (filters.duration) queryParams.append('duration', filters.duration);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());

      const response = await fetch(`${PACKAGE_ROUTES.LIST}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch packages');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch packages');
    }
  }
);

export const fetchFeaturedPackages = createAsyncThunk(
  'package/fetchFeaturedPackages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(PACKAGE_ROUTES.FEATURED);
      
      if (!response.ok) {
        throw new Error('Failed to fetch featured packages');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch featured packages');
    }
  }
);

export const fetchPackageDetails = createAsyncThunk(
  'package/fetchPackageDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('Fetching package details for ID:', id);
      const response = await fetch(PACKAGE_ROUTES.DETAILS(id));
      
      if (!response.ok) {
        throw new Error('Failed to fetch package details');
      }

      const data = await response.json();
      console.log('Package details API response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching package details:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch package details');
    }
  }
);

export const createCustomPackage = createAsyncThunk(
  'package/createCustomPackage',
  async (packageData: Partial<Package>, { rejectWithValue }) => {
    try {
      const response = await fetch(PACKAGE_ROUTES.CUSTOM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create custom package');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create custom package');
    }
  }
);

const packageSlice = createSlice({
  name: 'package',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedPackage: (state) => {
      state.selectedPackage = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchPackages
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle both single package and array of packages
        if (Array.isArray(action.payload.data)) {
          state.packages = action.payload.data.map((pkg: Package & { _id?: string }) => ({
            ...pkg,
            id: pkg.id || pkg._id || '',
          }));
        } else if (action.payload.data) {
          // Single package response
          const pkg = action.payload.data as Package & { _id?: string };
          state.packages = [{
            ...pkg,
            id: pkg.id || pkg._id || '',
          }];
        } else {
          state.packages = [];
        }
        
        // Handle pagination
        if (action.payload.pagination) {
          state.totalPages = action.payload.pagination.pages || 1;
          state.currentPage = action.payload.pagination.page || 1;
        }
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // fetchFeaturedPackages
    builder
      .addCase(fetchFeaturedPackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedPackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredPackages = action.payload;
      })
      .addCase(fetchFeaturedPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // fetchPackageDetails
    builder
      .addCase(fetchPackageDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPackageDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle different response structures
        if (action.payload.data) {
          // If response has a data property
          state.selectedPackage = action.payload.data;
        } else {
          // If response is the package directly
          state.selectedPackage = action.payload;
        }
      })
      .addCase(fetchPackageDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // createCustomPackage
    builder
      .addCase(createCustomPackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCustomPackage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.packages.unshift(action.payload);
      })
      .addCase(createCustomPackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedPackage, setCurrentPage } = packageSlice.actions;
export default packageSlice.reducer;
