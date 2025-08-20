'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Header from './Header';
import Footer from './Footer';
import ShoppingCartPanel from './ShoppingCart';

interface LayoutProps {
  children: React.ReactNode;
  readingProgress?: number;
}

export default function Layout({ children, readingProgress }: LayoutProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen flex flex-col">
      <Header readingProgress={readingProgress} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ShoppingCartPanel />
    </div>
  );
}
