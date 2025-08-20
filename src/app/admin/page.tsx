'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { getCurrentUser, initializeAuth, logout, logoutImmediate } from '@/store/slices/authSlice';
import { fetchDestinations, deleteDestination } from '@/store/slices/destinationSlice';
import { fetchHotels, deleteHotel } from '@/store/slices/hotelSlice';
import { 
  Users, 
  BookOpen, 
  MapPin, 
  Plane, 
  Hotel, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Settings,
  BarChart3,
  FileText,
  Shield,
  Package,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  Tag,
  Globe,
  Star,
  Phone
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deletingDestination, setDeletingDestination] = useState<string | null>(null);
  const [deletingHotel, setDeletingHotel] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { destinations, isLoading: destinationsLoading } = useSelector((state: RootState) => state.destination);
  const { hotels, isLoading: hotelsLoading } = useSelector((state: RootState) => state.hotel);

  const handleLogout = () => {
    // Set logging out state to prevent API calls
    setIsLoggingOut(true);
    
    // Close dropdown first
    setIsUserMenuOpen(false);
    
    // Clear auth state immediately
    dispatch(logoutImmediate());
    
    // Clear localStorage manually to ensure it's cleared
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Redirect to home page
    window.location.href = '/';
  };

  useEffect(() => {
    // Initialize auth state after hydration
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    // Fetch user data if authenticated but user data is not available
    if (isAuthenticated && !user && !isLoggingOut) {
      console.log('Fetching user data for admin page...');
      // Only call getCurrentUser if we have a token
      const token = localStorage.getItem('token');
      if (token) {
        dispatch(getCurrentUser()).catch(error => {
          console.log('getCurrentUser failed, user might be logged out:', error);
        });
      }
    }
  }, [dispatch, isAuthenticated, user, isLoggingOut]);

  // Add another useEffect to handle the case where user data might be loaded after initial render
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User data loaded in admin page:', user);
    }
  }, [isAuthenticated, user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const dropdown = document.querySelector('[data-dropdown="user-menu"]');
      
      if (isUserMenuOpen && dropdown && !dropdown.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Fetch destinations when destinations tab is active
  useEffect(() => {
    if (activeTab === 'destinations' && isAuthenticated && !isLoggingOut) {
      const params: {
        page: number;
        limit: number;
        isActive: boolean;
        search?: string;
        country?: string;
      } = {
        page: 1,
        limit: 12,
        isActive: true
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (countryFilter) {
        params.country = countryFilter;
      }

      if (statusFilter) {
        params.isActive = statusFilter === 'Active';
      }

      dispatch(fetchDestinations(params));
    }
  }, [dispatch, activeTab, searchTerm, countryFilter, statusFilter, isAuthenticated, isLoggingOut]);

  // Fetch hotels when hotels tab is active
  useEffect(() => {
    if (activeTab === 'hotels' && isAuthenticated && !isLoggingOut) {
      const params: {
        page: number;
        limit: number;
        isActive: boolean;
        search?: string;
        destination?: string;
      } = {
        page: 1,
        limit: 12,
        isActive: true
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (countryFilter) {
        params.destination = countryFilter;
      }

      if (statusFilter) {
        params.isActive = statusFilter === 'Active';
      }

      dispatch(fetchHotels(params));
    }
  }, [dispatch, activeTab, searchTerm, countryFilter, statusFilter, isAuthenticated, isLoggingOut]);

  // Get unique countries for filter from current destinations
  const uniqueCountries = [...new Set(destinations.map(d => d.country))];

  const handleDeleteDestination = async (id: string) => {
    const destination = destinations.find(d => d.id === id);
    const destinationName = destination?.name || 'this destination';
    
    if (window.confirm(`Are you sure you want to delete "${destinationName}"? This action cannot be undone.`)) {
      setDeletingDestination(id);
      try {
        await dispatch(deleteDestination(id)).unwrap();
        // Refresh destinations after deletion with current filters
        const params: {
          page: number;
          limit: number;
          isActive: boolean;
          search?: string;
          country?: string;
        } = {
          page: 1,
          limit: 12,
          isActive: true
        };

        if (searchTerm) {
          params.search = searchTerm;
        }

        if (countryFilter) {
          params.country = countryFilter;
        }

        if (statusFilter) {
          params.isActive = statusFilter === 'Active';
        }

        dispatch(fetchDestinations(params));
        alert(`"${destinationName}" has been deleted successfully!`);
      } catch (error) {
        console.error('Failed to delete destination:', error);
        alert('Failed to delete destination. Please try again.');
      } finally {
        setDeletingDestination(null);
      }
    }
  };

  const handleDeleteHotel = async (id: string) => {
    const hotel = hotels.find(h => h.id === id);
    const hotelName = hotel?.name || 'this hotel';
    
    if (window.confirm(`Are you sure you want to delete "${hotelName}"? This action cannot be undone.`)) {
      setDeletingHotel(id);
      try {
        await dispatch(deleteHotel(id)).unwrap();
        // Refresh hotels after deletion with current filters
        const params: {
          page: number;
          limit: number;
          isActive: boolean;
          search?: string;
          destination?: string;
        } = {
          page: 1,
          limit: 12,
          isActive: true
        };

        if (searchTerm) {
          params.search = searchTerm;
        }

        if (countryFilter) {
          params.destination = countryFilter;
        }

        if (statusFilter) {
          params.isActive = statusFilter === 'Active';
        }

        dispatch(fetchHotels(params));
        alert(`"${hotelName}" has been deleted successfully!`);
      } catch (error) {
        console.error('Failed to delete hotel:', error);
        alert('Failed to delete hotel. Please try again.');
      } finally {
        setDeletingHotel(null);
      }
    }
  };

  // Show loading state while checking authentication
  if (isLoading || isLoggingOut) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">
            {isLoggingOut ? 'Logging out...' : 'Loading...'}
          </h2>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const stats = {
    totalUsers: 1247,
    totalBookings: 892,
    totalRevenue: 156789,
    activeDestinations: 45,
    totalHotels: 234,
    totalFlights: 567,
    totalPackages: 89,
    totalBlogPosts: 156,
    monthlyGrowth: 12.5,
    conversionRate: 3.2
  };

  const recentBookings = [
    { id: '1', customer: 'John Doe', type: 'Hotel', amount: 450, status: 'Confirmed', date: '2024-01-15', destination: 'Paris' },
    { id: '2', customer: 'Jane Smith', type: 'Flight', amount: 320, status: 'Pending', date: '2024-01-14', destination: 'Tokyo' },
    { id: '3', customer: 'Mike Johnson', type: 'Package', amount: 1200, status: 'Confirmed', date: '2024-01-13', destination: 'Bali' },
    { id: '4', customer: 'Sarah Wilson', type: 'Hotel', amount: 280, status: 'Cancelled', date: '2024-01-12', destination: 'New York' },
  ];

  const inventoryWarnings = [
    { id: '1', type: 'Package', name: 'Bali Adventure Package', available: 2, threshold: 5, destination: 'Bali' },
    { id: '2', type: 'Flight', name: 'Paris Express', available: 8, threshold: 10, destination: 'Paris' },
    { id: '3', type: 'Hotel', name: 'Tokyo Grand Hotel', available: 3, threshold: 5, destination: 'Tokyo' },
  ];

  const popularDestinations = [
    { id: '1', name: 'Paris', bookings: 234, revenue: 45678, growth: 15.2 },
    { id: '2', name: 'Tokyo', bookings: 189, revenue: 38945, growth: 12.8 },
    { id: '3', name: 'Bali', bookings: 156, revenue: 29876, growth: 18.5 },
    { id: '4', name: 'New York', bookings: 145, revenue: 34567, growth: 8.9 },
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'bookings', name: 'Bookings', icon: BookOpen },
    { id: 'destinations', name: 'Destinations', icon: MapPin },
    { id: 'hotels', name: 'Hotels', icon: Hotel },
    { id: 'flights', name: 'Flights', icon: Plane },
    { id: 'packages', name: 'Packages', icon: Package },
    { id: 'blog', name: 'Blog', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'inventory', name: 'Inventory', icon: AlertTriangle },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  // Check if user is authenticated and has admin role
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need to be logged in to access the admin dashboard.</p>
          <div className="mt-4">
            <a 
              href="/login" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Login
            </a>
          </div>
          {/* Debug Info */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Info:</h3>
            <div className="text-xs text-yellow-700 space-y-1">
              <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
              <p>User: {user ? 'Yes' : 'No'}</p>
              <p>User Role: {user?.role || 'None'}</p>
              <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don&apos;t have permission to access the admin dashboard.</p>
          <p className="text-sm text-gray-500 mt-2">Your role: {user.role}</p>
          {/* Debug Info */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Info:</h3>
            <div className="text-xs text-yellow-700 space-y-1">
              <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
              <p>User: {user ? 'Yes' : 'No'}</p>
              <p>User Role: {user?.role || 'None'}</p>
              <p>Expected Roles: ADMIN or SUPER_ADMIN</p>
              <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header - Logo and User Profile */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 ml-2">TravelBook</span>
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">
                  {user?.name}
                </span>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200" data-dropdown="user-menu">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-gray-500">{user?.email}</div>
                    <div className="text-xs text-gray-400 mt-1">Role: {user?.role}</div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogout();
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your travel booking platform</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <BookOpen className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalBookings.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <DollarSign className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.monthlyGrowth}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <MapPin className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Destinations</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.activeDestinations}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <Package className="w-6 h-6 text-pink-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Packages</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalPackages}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <FileText className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Blog Posts</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalBlogPosts}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                        <p className="text-2xl font-bold text-gray-900">{inventoryWarnings.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <MapPin className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Destinations</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.activeDestinations}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <Hotel className="w-6 h-6 text-pink-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Hotels</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalHotels}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Plane className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Flights</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalFlights}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Destination
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentBookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {booking.customer}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {booking.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {booking.destination}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${booking.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                booking.status === 'Confirmed' 
                                  ? 'bg-green-100 text-green-800'
                                  : booking.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {booking.date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Inventory Warnings */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Inventory Warnings</h2>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                      View All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Destination
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Available
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Threshold
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {inventoryWarnings.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.destination}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.available}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.threshold}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                Low Stock
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Popular Destinations */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Popular Destinations</h2>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View All
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {popularDestinations.map((destination) => (
                      <div key={destination.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{destination.name}</h3>
                          <span className={`text-sm font-medium ${
                            destination.growth > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {destination.growth > 0 ? '+' : ''}{destination.growth}%
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            Bookings: <span className="font-medium">{destination.bookings}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Revenue: <span className="font-medium">${destination.revenue.toLocaleString()}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Destinations Management */}
            {activeTab === 'destinations' && (
              <div className="space-y-6">
                {/* Header with Add Button */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Destinations Management</h2>
                  <button 
                    onClick={() => router.push('/admin/destinations/create')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Destination
                  </button>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search destinations..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select 
                        value={countryFilter}
                        onChange={(e) => setCountryFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Countries</option>
                        {uniqueCountries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Destinations Cards */}
                {destinationsLoading ? (
                  <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <h3 className="text-lg font-medium text-gray-900">Loading destinations...</h3>
                    </div>
                  </div>
                ) : destinations.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations found</h3>
                      <p className="text-gray-500">Try adjusting your search or filters to find what you&apos;re looking for.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {destinations.map((destination) => (
                      <div key={destination.id || destination._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        {/* Destination Image */}
                        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600">
                          <img
                            src={destination.thumbnail || (destination.images && destination.images.length > 0 ? destination.images[0] : '')}
                            alt={destination.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center" style={{ display: 'none' }}>
                            <MapPin className="w-12 h-12 text-white" />
                          </div>
                          
                          {/* Status Badge */}
                          <div className="absolute top-3 right-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              destination.isActive 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {destination.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          {/* Location Badge */}
                          <div className="absolute bottom-3 left-3">
                            <span className="bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                              {destination.city}
                            </span>
                          </div>
                        </div>

                        {/* Destination Info */}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{destination.name}</h3>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{destination.city}, {destination.country}</span>
                            </div>
                            
                            {destination.climate && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Globe className="w-4 h-4 mr-2" />
                                <span>{destination.climate}</span>
                              </div>
                            )}

                            {destination.currency && (
                              <div className="flex items-center text-sm text-gray-600">
                                <DollarSign className="w-4 h-4 mr-2" />
                                <span>{destination.currency}</span>
                              </div>
                            )}

                            {destination.language && (
                              <div className="flex items-center text-sm text-gray-600">
                                <BookOpen className="w-4 h-4 mr-2" />
                                <span>{destination.language}</span>
                              </div>
                            )}

                            {destination.bestTimeToVisit && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{destination.bestTimeToVisit}</span>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          {destination.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {destination.description}
                            </p>
                          )}

                          {/* Tags */}
                          {destination.tags && destination.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {destination.tags.slice(0, 3).map((tag, index) => (
                                <span key={`${destination.id || destination._id}-tag-${index}`} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                              {destination.tags.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{destination.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => {
                                  const destinationId = destination.id || destination._id;
                                  if (!destinationId) {
                                    alert('Error: Destination ID is missing. Please check the destination data.');
                                    return;
                                  }
                                  router.push(`/destinations/${destinationId}`);
                                }}
                                className="flex items-center text-blue-600 hover:text-blue-900 text-sm font-medium"
                                title={`View ${destination.name} details`}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </button>
                              <button 
                                onClick={() => {
                                  // TODO: Implement edit functionality
                                  alert('Edit functionality will be implemented soon!');
                                }}
                                className="flex items-center text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                title={`Edit ${destination.name}`}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </button>
                            </div>
                            <button 
                              onClick={() => handleDeleteDestination(destination.id || destination._id || '')}
                              disabled={deletingDestination === (destination.id || destination._id)}
                                                                  className={`flex items-center text-sm font-medium ${
                                deletingDestination === (destination.id || destination._id)
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : 'text-red-600 hover:text-red-900'
                              }`}
                              title={`Delete ${destination.name}`}
                            >
                              {deletingDestination === (destination.id || destination._id) ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                              ) : (
                                <Trash2 className="w-4 h-4 mr-1" />
                              )}
                              {deletingDestination === (destination.id || destination._id) ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Hotels Management */}
            {activeTab === 'hotels' && (
              <div className="space-y-6">
                {/* Header with Add Button */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Hotels Management</h2>
                  <button 
                    onClick={() => router.push('/admin/hotels/create')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Hotel
                  </button>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search hotels..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select 
                        value={countryFilter}
                        onChange={(e) => setCountryFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Destinations</option>
                        {uniqueCountries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Hotels Cards */}
                {hotelsLoading ? (
                  <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <h3 className="text-lg font-medium text-gray-900">Loading hotels...</h3>
                    </div>
                  </div>
                ) : hotels.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="text-center">
                      <Hotel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
                      <p className="text-gray-500">Try adjusting your search or filters to find what you&apos;re looking for.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map((hotel) => (
                      <div key={hotel.id || hotel._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        {/* Hotel Image */}
                        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600">
                          <img
                            src={hotel.thumbnail || (hotel.images && hotel.images.length > 0 ? hotel.images[0] : '')}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center" style={{ display: 'none' }}>
                            <Hotel className="w-12 h-12 text-white" />
                          </div>
                          
                          {/* Status Badge */}
                          <div className="absolute top-3 right-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              hotel.isActive 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {hotel.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          {/* Rating Badge */}
                          <div className="absolute bottom-3 left-3">
                            <span className="bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-semibold text-gray-900 flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              {hotel.rating}
                            </span>
                          </div>
                        </div>

                        {/* Hotel Info */}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{hotel.name}</h3>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{hotel.address}</span>
                            </div>
                            
                            {hotel.destination && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Globe className="w-4 h-4 mr-2" />
                                <span>{hotel.destination.name}</span>
                              </div>
                            )}

                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="w-4 h-4 mr-2" />
                              <span>${hotel.priceRange.min} - ${hotel.priceRange.max} {hotel.priceRange.currency}</span>
                            </div>

                            {hotel.contactInfo?.phone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-4 h-4 mr-2" />
                                <span>{hotel.contactInfo.phone}</span>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          {hotel.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {hotel.description}
                            </p>
                          )}

                          {/* Amenities */}
                          {hotel.amenities && hotel.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {hotel.amenities.slice(0, 3).map((amenity, index) => (
                                <span key={`${hotel.id || hotel._id}-amenity-${index}`} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {amenity}
                                </span>
                              ))}
                              {hotel.amenities.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{hotel.amenities.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => {
                                  const hotelId = hotel.id || hotel._id;
                                  if (!hotelId) {
                                    alert('Error: Hotel ID is missing. Please check the hotel data.');
                                    return;
                                  }
                                  router.push(`/hotels/${hotelId}`);
                                }}
                                className="flex items-center text-blue-600 hover:text-blue-900 text-sm font-medium"
                                title={`View ${hotel.name} details`}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </button>
                              <button 
                                onClick={() => {
                                  // TODO: Implement edit functionality
                                  alert('Edit functionality will be implemented soon!');
                                }}
                                className="flex items-center text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                title={`Edit ${hotel.name}`}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </button>
                            </div>
                            <button 
                              onClick={() => handleDeleteHotel(hotel.id || hotel._id || '')}
                              disabled={deletingHotel === (hotel.id || hotel._id)}
                              className={`flex items-center text-sm font-medium ${
                                deletingHotel === (hotel.id || hotel._id)
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : 'text-red-600 hover:text-red-900'
                              }`}
                              title={`Delete ${hotel.name}`}
                            >
                              {deletingHotel === (hotel.id || hotel._id) ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                              ) : (
                                <Trash2 className="w-4 h-4 mr-1" />
                              )}
                              {deletingHotel === (hotel.id || hotel._id) ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Users Management */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Users Management</h2>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          { id: '1', name: 'John Doe', email: 'john@example.com', role: 'CUSTOMER', status: 'Active' },
                          { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'ADMIN', status: 'Active' },
                          { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'PARTNER', status: 'Active' },
                          { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'CUSTOMER', status: 'Inactive' },
                        ].map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <Users className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'PARTNER' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                user.status === 'Active' 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-indigo-600 hover:text-indigo-900">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs - placeholder content */}
            {!['overview', 'destinations', 'users'].includes(activeTab) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">{activeTab} Management</h2>
                <p className="text-gray-600">
                  This section is under development. The {activeTab} management features will be implemented here.
                </p>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">
                    TODO: Implement {activeTab} management functionality including:
                  </p>
                  <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
                    <li>View and manage {activeTab}</li>
                    <li>Add new {activeTab}</li>
                    <li>Edit existing {activeTab}</li>
                    <li>Delete {activeTab}</li>
                    <li>Search and filter {activeTab}</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
