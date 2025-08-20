import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { ITINERARY_ROUTES } from '@/config/routes';

// Types
export interface Activity {
  id?: string;
  _id?: string;
  type: 'activity' | 'transport' | 'accommodation';
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  cost: number;
  bookingReference: string;
  notes: string;
  order: number;
}

export interface Day {
  dayNumber: number;
  date: string;
  title: string;
  activities: Activity[];
}

export interface Itinerary {
  id: string;
  _id?: string;
  userId: string;
  title: string;
  description: string;
  destination?: {
    id: string;
    name: string;
    city: string;
    country: string;
  };
  destinationId?: string | {
    _id: string;
    name: string;
    city: string;
    country: string;
    thumbnail?: string;
  };
  startDate: string;
  endDate: string;
  days: Day[];
  isPublic: boolean;
  shareId?: string;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItineraryData {
  title: string;
  description: string;
  destinationId: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  days?: any[]; // Allow any structure for days since backend accepts any format
}

export interface UpdateItineraryData extends Partial<CreateItineraryData> {}

export interface AddDayData {
  dayNumber: number;
  date: string;
  title: string;
}

export interface UpdateDayData extends Partial<AddDayData> {}

export interface AddActivityData {
  type: 'activity' | 'transport' | 'accommodation';
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  cost: number;
  bookingReference: string;
  notes: string;
  order: number;
}

export interface UpdateActivityData extends Partial<AddActivityData> {}

export interface ReorderActivitiesData {
  activityIds: string[];
}

interface ApiErrorResponse {
  message: string;
  status: number;
}

interface ItineraryState {
  itineraries: Itinerary[];
  currentItinerary: Itinerary | null;
  sharedItineraries: Itinerary[];
  publicItinerary: Itinerary | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: ItineraryState = {
  itineraries: [],
  currentItinerary: null,
  sharedItineraries: [],
  publicItinerary: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const createItinerary = createAsyncThunk(
  'itinerary/createItinerary',
  async (data: CreateItineraryData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('Authentication token not found');
      }

      const response = await axios.post(ITINERARY_ROUTES.CREATE, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to create itinerary');
    }
  }
);

export const getMyItineraries = createAsyncThunk(
  'itinerary/getMyItineraries',
  async (params: { page?: number; limit?: number; search?: string } = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('Authentication token not found');
      }

      const response = await axios.get(ITINERARY_ROUTES.MY_ITINERARIES, { 
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch itineraries');
    }
  }
);

export const getSharedItineraries = createAsyncThunk(
  'itinerary/getSharedItineraries',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('Authentication token not found');
      }

      const response = await axios.get(ITINERARY_ROUTES.SHARED, { 
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch shared itineraries');
    }
  }
);

export const getItinerary = createAsyncThunk(
  'itinerary/getItinerary',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('Authentication token not found');
      }

      const response = await axios.get(ITINERARY_ROUTES.DETAILS(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch itinerary');
    }
  }
);

export const getPublicItinerary = createAsyncThunk(
  'itinerary/getPublicItinerary',
  async (qrCode: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(ITINERARY_ROUTES.PUBLIC(qrCode));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch public itinerary');
    }
  }
);

export const updateItinerary = createAsyncThunk(
  'itinerary/updateItinerary',
  async ({ id, data }: { id: string; data: UpdateItineraryData }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('Authentication token not found');
      }

      const response = await axios.put(ITINERARY_ROUTES.UPDATE(id), data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to update itinerary');
    }
  }
);

export const deleteItinerary = createAsyncThunk(
  'itinerary/deleteItinerary',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('Authentication token not found');
      }

      await axios.delete(ITINERARY_ROUTES.DELETE(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to delete itinerary');
    }
  }
);

export const duplicateItinerary = createAsyncThunk(
  'itinerary/duplicateItinerary',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(ITINERARY_ROUTES.DUPLICATE(id));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to duplicate itinerary');
    }
  }
);

export const addDay = createAsyncThunk(
  'itinerary/addDay',
  async ({ id, data }: { id: string; data: AddDayData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(ITINERARY_ROUTES.ADD_DAY(id), data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to add day');
    }
  }
);

export const updateDay = createAsyncThunk(
  'itinerary/updateDay',
  async ({ id, dayNumber, data }: { id: string; dayNumber: number; data: UpdateDayData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(ITINERARY_ROUTES.UPDATE_DAY(id, dayNumber), data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to update day');
    }
  }
);

export const deleteDay = createAsyncThunk(
  'itinerary/deleteDay',
  async ({ id, dayNumber }: { id: string; dayNumber: number }, { rejectWithValue }) => {
    try {
      await axios.delete(ITINERARY_ROUTES.DELETE_DAY(id, dayNumber));
      return { id, dayNumber };
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to delete day');
    }
  }
);

export const addActivity = createAsyncThunk(
  'itinerary/addActivity',
  async ({ id, dayNumber, data }: { id: string; dayNumber: number; data: AddActivityData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(ITINERARY_ROUTES.ADD_ACTIVITY(id, dayNumber), data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to add activity');
    }
  }
);

export const updateActivity = createAsyncThunk(
  'itinerary/updateActivity',
  async ({ id, dayNumber, activityId, data }: { id: string; dayNumber: number; activityId: string; data: UpdateActivityData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(ITINERARY_ROUTES.UPDATE_ACTIVITY(id, dayNumber, activityId), data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to update activity');
    }
  }
);

export const deleteActivity = createAsyncThunk(
  'itinerary/deleteActivity',
  async ({ id, dayNumber, activityId }: { id: string; dayNumber: number; activityId: string }, { rejectWithValue }) => {
    try {
      await axios.delete(ITINERARY_ROUTES.DELETE_ACTIVITY(id, dayNumber, activityId));
      return { id, dayNumber, activityId };
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to delete activity');
    }
  }
);

export const reorderActivities = createAsyncThunk(
  'itinerary/reorderActivities',
  async ({ id, dayNumber, data }: { id: string; dayNumber: number; data: ReorderActivitiesData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(ITINERARY_ROUTES.REORDER_ACTIVITIES(id, dayNumber), data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to reorder activities');
    }
  }
);

export const shareItinerary = createAsyncThunk(
  'itinerary/shareItinerary',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(ITINERARY_ROUTES.SHARE(id));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to share itinerary');
    }
  }
);

export const generateQRCode = createAsyncThunk(
  'itinerary/generateQRCode',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(ITINERARY_ROUTES.GENERATE_QR(id));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to generate QR code');
    }
  }
);

export const exportPDF = createAsyncThunk(
  'itinerary/exportPDF',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(ITINERARY_ROUTES.EXPORT_PDF(id));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to export PDF');
    }
  }
);

// Slice
const itinerarySlice = createSlice({
  name: 'itinerary',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentItinerary: (state) => {
      state.currentItinerary = null;
    },
    clearPublicItinerary: (state) => {
      state.publicItinerary = null;
    },
  },
  extraReducers: (builder) => {
    // Create itinerary
    builder
      .addCase(createItinerary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createItinerary.fulfilled, (state, action) => {
        state.isLoading = false;
        const itinerary = { ...action.payload, id: action.payload.id || action.payload._id };
        state.itineraries.unshift(itinerary);
        state.currentItinerary = itinerary;
      })
      .addCase(createItinerary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get my itineraries
    builder
      .addCase(getMyItineraries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyItineraries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.itineraries = (action.payload.data || action.payload).map((itinerary: Itinerary & { _id?: string }) => ({
          ...itinerary,
          id: itinerary.id || itinerary._id,
        }));
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getMyItineraries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get shared itineraries
    builder
      .addCase(getSharedItineraries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSharedItineraries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sharedItineraries = (action.payload.data || action.payload).map((itinerary: Itinerary & { _id?: string }) => ({
          ...itinerary,
          id: itinerary.id || itinerary._id,
        }));
      })
      .addCase(getSharedItineraries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get itinerary
    builder
      .addCase(getItinerary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getItinerary.fulfilled, (state, action) => {
        state.isLoading = false;
        const itinerary = { ...action.payload, id: action.payload.id || action.payload._id };
        state.currentItinerary = itinerary;
      })
      .addCase(getItinerary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get public itinerary
    builder
      .addCase(getPublicItinerary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPublicItinerary.fulfilled, (state, action) => {
        state.isLoading = false;
        const itinerary = { ...action.payload, id: action.payload.id || action.payload._id };
        state.publicItinerary = itinerary;
      })
      .addCase(getPublicItinerary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update itinerary
    builder
      .addCase(updateItinerary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateItinerary.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedItinerary = { ...action.payload, id: action.payload.id || action.payload._id };
        state.currentItinerary = updatedItinerary;
        state.itineraries = state.itineraries.map(itinerary =>
          itinerary.id === updatedItinerary.id ? updatedItinerary : itinerary
        );
      })
      .addCase(updateItinerary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete itinerary
    builder
      .addCase(deleteItinerary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteItinerary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.itineraries = state.itineraries.filter(itinerary => itinerary.id !== action.payload);
        if (state.currentItinerary?.id === action.payload) {
          state.currentItinerary = null;
        }
      })
      .addCase(deleteItinerary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Duplicate itinerary
    builder
      .addCase(duplicateItinerary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(duplicateItinerary.fulfilled, (state, action) => {
        state.isLoading = false;
        const itinerary = { ...action.payload, id: action.payload.id || action.payload._id };
        state.itineraries.unshift(itinerary);
        state.currentItinerary = itinerary;
      })
      .addCase(duplicateItinerary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add day
    builder
      .addCase(addDay.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addDay.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentItinerary) {
          state.currentItinerary = { ...state.currentItinerary, ...action.payload };
        }
      })
      .addCase(addDay.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update day
    builder
      .addCase(updateDay.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDay.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentItinerary) {
          state.currentItinerary = { ...state.currentItinerary, ...action.payload };
        }
      })
      .addCase(updateDay.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete day
    builder
      .addCase(deleteDay.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDay.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentItinerary) {
          state.currentItinerary.days = state.currentItinerary.days.filter(
            day => day.dayNumber !== action.payload.dayNumber
          );
        }
      })
      .addCase(deleteDay.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add activity
    builder
      .addCase(addActivity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentItinerary) {
          state.currentItinerary = { ...state.currentItinerary, ...action.payload };
        }
      })
      .addCase(addActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update activity
    builder
      .addCase(updateActivity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentItinerary) {
          state.currentItinerary = { ...state.currentItinerary, ...action.payload };
        }
      })
      .addCase(updateActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete activity
    builder
      .addCase(deleteActivity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentItinerary) {
          const day = state.currentItinerary.days.find(d => d.dayNumber === action.payload.dayNumber);
          if (day) {
            day.activities = day.activities.filter(activity => activity.id !== action.payload.activityId);
          }
        }
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Reorder activities
    builder
      .addCase(reorderActivities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(reorderActivities.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentItinerary) {
          state.currentItinerary = { ...state.currentItinerary, ...action.payload };
        }
      })
      .addCase(reorderActivities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Share itinerary
    builder
      .addCase(shareItinerary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(shareItinerary.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentItinerary) {
          state.currentItinerary = { ...state.currentItinerary, ...action.payload };
        }
      })
      .addCase(shareItinerary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Generate QR code
    builder
      .addCase(generateQRCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateQRCode.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentItinerary) {
          state.currentItinerary = { ...state.currentItinerary, ...action.payload };
        }
      })
      .addCase(generateQRCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Export PDF
    builder
      .addCase(exportPDF.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exportPDF.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(exportPDF.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentItinerary, clearPublicItinerary } = itinerarySlice.actions;
export default itinerarySlice.reducer;
