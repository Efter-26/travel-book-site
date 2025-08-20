'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { logoutImmediate } from '@/store/slices/authSlice';
import { openCart } from '@/store/slices/cartSlice';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  BookOpen,
  MapPin,
  Plane,
  Hotel,
  Shield,
  Package,
  Calendar,
  ShoppingCart
} from 'lucide-react';

interface HeaderProps {
  readingProgress?: number;
}

export default function Header({ readingProgress }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated, user, isInitialized } = useSelector((state: RootState) => state.auth);
  const { totalItems } = useSelector((state: RootState) => state.cart);

  const handleLogout = () => {
    dispatch(logoutImmediate());
    setIsUserMenuOpen(false);
    // Redirect to home page after logout
    router.push('/');
  };

  const navigation = [
    { name: 'Destinations', href: '/destinations', icon: MapPin },
    { name: 'Hotels', href: '/hotels', icon: Hotel },
    { name: 'Flights', href: '/flights', icon: Plane },
    { name: 'Packages', href: '/packages', icon: Package },
    { name: 'Itinerary', href: '/itinerary', icon: Calendar },
    { name: 'Blog', href: '/blog', icon: BookOpen },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo - Left */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">TravelBook</span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side - Cart & Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* Booking Icon - Only show for logged in customers */}
            {isAuthenticated && user?.role === 'CUSTOMER' && (
              <button
                onClick={() => dispatch(openCart())}
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>
            )}

            {/* Auth Buttons */}
            {!isInitialized ? (
              // Show loading skeleton while auth is initializing
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="hidden sm:block text-base font-medium">
                    {user?.name}
                  </span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/bookings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>My Bookings</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                    {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Reading Progress Bar */}
      {readingProgress !== undefined && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      )}
    </header>
  );
}
