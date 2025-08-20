/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  type: 'hotel' | 'flight' | 'package';
  title: string;
  image: string;
  location?: string;
  price: number;
  currency: string;
  quantity: number;
  // Hotel specific
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  roomType?: string;
  // Flight specific
  departure?: string;
  arrival?: string;
  departureTime?: string;
  arrivalTime?: string;
  passengers?: number;
  class?: string;
  // Package specific
  duration?: string;
  startDate?: string;
  endDate?: string;
  // Common
  selectedOptions?: Record<string, any>;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  currency: string;
}

// Helper functions for localStorage
const getStoredCart = (): CartState => {
  if (typeof window === 'undefined') {
    return {
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0,
      currency: 'USD',
    };
  }
  
  try {
    const stored = localStorage.getItem('travelbook-cart');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        isOpen: false, // Always start with cart closed
      };
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  
  return {
    items: [],
    isOpen: false,
    totalItems: 0,
    totalPrice: 0,
    currency: 'USD',
  };
};

const saveCartToStorage = (cart: CartState) => {
  if (typeof window === 'undefined') return;
  
  try {
    const cartToSave = {
      items: cart.items,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      currency: cart.currency,
    };
    localStorage.setItem('travelbook-cart', JSON.stringify(cartToSave));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const initialState: CartState = getStoredCart();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.id === newItem.id && item.type === newItem.type
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        state.items[existingItemIndex] = {
          ...state.items[existingItemIndex],
          ...newItem,
          quantity: state.items[existingItemIndex].quantity + newItem.quantity,
        };
      } else {
        // Add new item
        state.items.push(newItem);
      }

      // Update totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Save to localStorage
      saveCartToStorage(state);
    },

    updateCartItem: (state, action: PayloadAction<{ id: string; type: string; updates: Partial<CartItem> }>) => {
      const { id, type, updates } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id && item.type === type);
      
      if (itemIndex >= 0) {
        state.items[itemIndex] = { ...state.items[itemIndex], ...updates };
        
        // Update totals
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Save to localStorage
        saveCartToStorage(state);
      }
    },

    removeFromCart: (state, action: PayloadAction<{ id: string; type: string }>) => {
      const { id, type } = action.payload;
      state.items = state.items.filter(item => !(item.id === id && item.type === type));
      
      // Update totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Save to localStorage
      saveCartToStorage(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      
      // Save to localStorage
      saveCartToStorage(state);
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    openCart: (state) => {
      state.isOpen = true;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },

    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
      saveCartToStorage(state);
    },
  },
});

export const {
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  setCurrency,
} = cartSlice.actions;

export default cartSlice.reducer;
