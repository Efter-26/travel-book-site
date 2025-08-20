import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { RootState } from '../index';
import { AUTH_ROUTES, USER_ROUTES } from '@/config/routes';

interface ApiErrorResponse {
  message: string;
}

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'PARTNER' | 'CUSTOMER';
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  language?: string;
  currency?: string;
  timezone?: string;
  emailVerified: boolean;
  loyaltyPoints: number;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

// Helper functions to safely access localStorage
const getStoredToken = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const setStoredToken = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

const removeStoredToken = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

const getStoredUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

const setStoredUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

const removeStoredUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

const initialState: AuthState = {
  user: null,
  token: null, // Will be set after hydration
  refreshToken: null, // Will be set after hydration
  isAuthenticated: false, // Will be set after hydration
  isLoading: false,
  isInitialized: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(AUTH_ROUTES.LOGIN, credentials);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string; phone?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(AUTH_ROUTES.REGISTER, userData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      // Try to call logout endpoint if token exists
      if (state.auth.token) {
        await axios.post(AUTH_ROUTES.LOGOUT, {}, {
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
          },
        });
      }
      return;
    } catch (error) {
      // Even if logout API fails, we should still clear local state
      console.warn('Logout API call failed, but clearing local state:', error);
      return;
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await axios.post(AUTH_ROUTES.REFRESH_TOKEN, {
        refreshToken: state.auth.refreshToken,
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Token refresh failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      console.log('Fetching user data with token:', state.auth.token);
      const response = await axios.get(USER_ROUTES.PROFILE, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      console.log('getCurrentUser response:', response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('getCurrentUser error:', error);
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to get user data');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await axios.patch(USER_ROUTES.UPDATE_PROFILE, profileData, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Profile update failed');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData: { currentPassword: string; newPassword: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await axios.patch(USER_ROUTES.CHANGE_PASSWORD, passwordData, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Password change failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      setStoredToken('token', action.payload);
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
      setStoredToken('refreshToken', action.payload);
    },
    logoutImmediate: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      removeStoredToken('token');
      removeStoredToken('refreshToken');
      removeStoredUser();
    },
    initializeAuth: (state) => {
      const token = getStoredToken('token');
      const refreshToken = getStoredToken('refreshToken');
      const user = getStoredUser();
      
      if (token) {
        state.token = token;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
        if (user) {
          state.user = user;
        }
      }
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        // Store user data if it's included in the response
        if (action.payload.user) {
          state.user = action.payload.user;
          setStoredUser(action.payload.user);
        }
        setStoredToken('token', action.payload.accessToken);
        setStoredToken('refreshToken', action.payload.refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        // Store user data if it's included in the response
        if (action.payload.user) {
          state.user = action.payload.user;
          setStoredUser(action.payload.user);
        }
        setStoredToken('token', action.payload.accessToken);
        setStoredToken('refreshToken', action.payload.refreshToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        removeStoredToken('token');
        removeStoredToken('refreshToken');
        removeStoredUser();
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        setStoredToken('token', action.payload.accessToken);
        setStoredToken('refreshToken', action.payload.refreshToken);
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        removeStoredToken('token');
        removeStoredToken('refreshToken');
        removeStoredUser();
      })
      // Get Current User
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        // Handle both response structures: { data: user } or { user } or direct user object
        if (action.payload.data) {
          state.user = action.payload.data;
          setStoredUser(action.payload.data);
        } else if (action.payload.user) {
          state.user = action.payload.user;
          setStoredUser(action.payload.user);
        } else {
          state.user = action.payload;
          setStoredUser(action.payload);
        }
        console.log('User data stored in Redux:', state.user);
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        setStoredUser(action.payload.data);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setToken, setRefreshToken, logoutImmediate, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
