'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchUserBookings, cancelBooking } from '@/store/slices/bookingSlice';
import Layout from '@/components/Layout';
import { Calendar, MapPin, Users, CreditCard, Clock, CheckCircle, XCircle, AlertCircle, Download, Eye } from 'lucide-react';

export default function BookingsPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const dispatch = useDispatch<AppDispatch>();
  const { bookings, isLoading } = useSelector((state: RootState) => state.booking);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // TODO: Replace with actual API endpoint
    // dispatch(fetchUserBookings());
    console.log('Fetching user bookings');
  }, [dispatch]);

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    const matchesType = selectedType === 'all' || booking.type === selectedType;
    return matchesStatus && matchesType;
  });

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        // TODO: Replace with actual API endpoint
        // await dispatch(cancelBooking(bookingId)).unwrap();
        console.log('Cancelling booking:', bookingId);
      } catch (error) {
        console.error('Failed to cancel booking:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your bookings</h2>
            <p className="text-gray-600">You need to be authenticated to access this page.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage and track all your travel bookings</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="hotel">Hotel</option>
                  <option value="flight">Flight</option>
                  <option value="package">Package</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      <div className="ml-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredBookings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-600 mb-6">
                    {selectedStatus !== 'all' || selectedType !== 'all' 
                      ? 'Try adjusting your filters to see more results.'
                      : 'Start exploring destinations and make your first booking!'
                    }
                  </p>
                  {selectedStatus !== 'all' || selectedType !== 'all' ? (
                    <button
                      onClick={() => {
                        setSelectedStatus('all');
                        setSelectedType('all');
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Clear Filters
                    </button>
                  ) : (
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Explore Destinations
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          {/* Booking Info */}
                          <div className="flex-1">
                            <div className="flex items-start">
                              <img
                                src={booking.image}
                                alt={booking.title}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900">{booking.title}</h3>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                    {getStatusIcon(booking.status)}
                                    <span className="ml-1">{booking.status}</span>
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span>{booking.location}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-2" />
                                    <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                                  </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-500">Booking ID: {booking.id}</span>
                                    <span className="text-sm text-gray-500">Type: {booking.type}</span>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">${booking.totalPrice}</p>
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-6 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                              <Download className="w-4 h-4 mr-2" />
                              Download Invoice
                            </button>
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel Booking
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Summary Stats */}
          {filteredBookings.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredBookings.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Confirmed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredBookings.filter(b => b.status === 'confirmed').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredBookings.filter(b => b.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
