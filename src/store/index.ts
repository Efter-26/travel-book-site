import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import cartReducer from './slices/cartSlice';
import destinationReducer from './slices/destinationSlice';
import hotelReducer from './slices/hotelSlice';
import flightReducer from './slices/flightSlice';
import itineraryReducer from './slices/itinerarySlice';
import packageReducer from './slices/packageSlice';
import blogReducer from './slices/blogSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    cart: cartReducer,
    destination: destinationReducer,
    hotel: hotelReducer,
    flight: flightReducer,
    itinerary: itineraryReducer,
    package: packageReducer,
    blog: blogReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
