'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth, getCurrentUser } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';

interface ProvidersProps {
  children: React.ReactNode;
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth());
    
    // If there's a token, try to get current user data
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          {children}
        </AuthInitializer>
      </QueryClientProvider>
    </Provider>
  );
}
