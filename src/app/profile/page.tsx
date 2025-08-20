'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { RootState, AppDispatch } from '@/store';
import { updateProfile, getCurrentUser } from '@/store/slices/authSlice';
import { fetchUserBookings } from '@/store/slices/bookingSlice';
import Layout from '@/components/Layout';
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Settings, BookOpen, Heart, Star, Edit, Save, X, Shield } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { bookings } = useSelector((state: RootState) => state.booking);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth || '',
      });
    }
  }, [user]);

  useEffect(() => {
    // Fetch user data if authenticated but user data is not available
    if (isAuthenticated && !user) {
      dispatch(getCurrentUser());
    }
    
    // TODO: Replace with actual API endpoint
    // dispatch(fetchUserBookings());
    console.log('Fetching user bookings');
  }, [dispatch, isAuthenticated, user]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // TODO: Replace with actual API endpoint
      // await dispatch(updateProfile(formData)).unwrap();
      console.log('Updating profile with:', formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
            <p className="text-gray-600">You need to be authenticated to access this page.</p>
            <div className="mt-4">
              <Link 
                href="/login" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 opacity-20 rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-20 w-24 h-24 bg-green-200 opacity-20 rounded-full animate-bounce"></div>
            <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-purple-200 opacity-20 rounded-full animate-spin"></div>
            <div className="absolute bottom-20 right-1/4 w-28 h-28 bg-yellow-200 opacity-20 rounded-full animate-ping"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-200 opacity-10 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Debug Info - Remove this in production */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Info:</h3>
            <div className="text-xs text-yellow-700 space-y-1">
              <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
              <p>User Role: {user?.role || 'None'}</p>
              <p>User ID: {user?.id || 'None'}</p>
              <p>User Name: {user?.name || 'None'}</p>
              <p>User Email: {user?.email || 'None'}</p>
            </div>
          </div>
          
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-600">Member since {formatDate(user.createdAt || new Date().toISOString())}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                  <Link
                    href="/admin"
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-200 bg-gray-50'
                      } ${errors.firstName ? 'border-red-300' : ''}`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-200 bg-gray-50'
                      } ${errors.lastName ? 'border-red-300' : ''}`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-200 bg-gray-50'
                      } ${errors.email ? 'border-red-300' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-200 bg-gray-50'
                      } ${errors.phone ? 'border-red-300' : ''}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Loyalty Points</p>
                  <p className="text-2xl font-bold text-gray-900">2,450</p>
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

            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600">Start exploring destinations and make your first booking!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={booking.image}
                          alt={booking.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-900">{booking.title}</h3>
                          <p className="text-sm text-gray-600">{booking.location}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${booking.totalPrice}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
