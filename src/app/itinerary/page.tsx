'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '@/store';
import { getMyItineraries, getSharedItineraries, deleteItinerary, duplicateItinerary } from '@/store/slices/itinerarySlice';
import Layout from '@/components/Layout';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Download,
  Copy,
  Trash2,
  Edit,
  Eye,
  Clock,
  Users
} from 'lucide-react';

export default function ItineraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'my' | 'shared'>('my');
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { itineraries, sharedItineraries, isLoading, pagination } = useSelector((state: RootState) => state.itinerary);
  const { user } = useSelector((state: RootState) => state.auth);

  // Debug: Log itinerary data structure
  useEffect(() => {
    if (itineraries.length > 0) {
      console.log('First itinerary:', itineraries[0]);
      console.log('DestinationId:', itineraries[0].destinationId);
      console.log('Destination:', itineraries[0].destination);
    }
  }, [itineraries]);

  // Check if user is authenticated
  useEffect(() => {
    // No role-based restrictions - any authenticated user can access
  }, [user, router]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch itineraries when filters change
  useEffect(() => {
    if (user) {
      if (activeTab === 'my') {
        dispatch(getMyItineraries({
          page: currentPage,
          limit: 6,
          search: debouncedSearchTerm
        }));
      } else {
        dispatch(getSharedItineraries({
          page: currentPage,
          limit: 6
        }));
      }
    }
  }, [dispatch, activeTab, currentPage, debouncedSearchTerm, user]);

  const handleCreateItinerary = () => {
    router.push('/destinations');
  };

  const handleViewItinerary = (itineraryId: string) => {
    router.push(`/itinerary/${itineraryId}`);
  };

  const handleEditItinerary = (itineraryId: string) => {
    router.push(`/itinerary/${itineraryId}/edit`);
  };

  const handleDeleteItinerary = async (itineraryId: string) => {
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      try {
        await dispatch(deleteItinerary(itineraryId)).unwrap();
        toast.success('Itinerary deleted successfully');
      } catch (error) {
        toast.error('Failed to delete itinerary');
      }
    }
  };

  const handleDuplicateItinerary = async (itineraryId: string) => {
    try {
      await dispatch(duplicateItinerary(itineraryId)).unwrap();
      toast.success('Itinerary duplicated successfully');
    } catch (error) {
      toast.error('Failed to duplicate itinerary');
    }
  };

  const handleShareItinerary = (itineraryId: string) => {
    router.push(`/itinerary/${itineraryId}/share`);
  };

  const handleExportPDF = (itineraryId: string) => {
    router.push(`/itinerary/${itineraryId}/export`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const currentItineraries = activeTab === 'my' ? itineraries : sharedItineraries;

  // Show public view for non-authenticated users
  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-bounce"></div>
              <div className="absolute top-20 right-20 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse"></div>
              <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white opacity-10 rounded-full animate-spin"></div>
              <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-white opacity-10 rounded-full animate-ping"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white opacity-5 rounded-full animate-pulse"></div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Plan Your Perfect Trip</h1>
                <p className="text-xl mb-8">Create detailed day-by-day itineraries for your dream vacation</p>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Day-by-Day Planning</h3>
                <p className="text-gray-700">Create detailed daily schedules with activities, transport, and accommodation.</p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Share & Collaborate</h3>
                <p className="text-gray-700">Share your itineraries with friends and family or collaborate on group trips.</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Export & Print</h3>
                <p className="text-gray-700">Export your itineraries as PDF and generate QR codes for easy sharing.</p>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
                  <h3 className="font-semibold mb-2 text-gray-900">Choose Destination</h3>
                  <p className="text-gray-700 text-sm">Select your travel destination from our curated list.</p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
                  <h3 className="font-semibold mb-2 text-gray-900">Plan Activities</h3>
                  <p className="text-gray-700 text-sm">Add activities, transport, and accommodation for each day.</p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
                  <h3 className="font-semibold mb-2 text-gray-900">Customize Details</h3>
                  <p className="text-gray-700 text-sm">Add notes, costs, and specific timing for each activity.</p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">4</div>
                  <h3 className="font-semibold mb-2 text-gray-900">Share & Enjoy</h3>
                  <p className="text-gray-700 text-sm">Share your itinerary and enjoy your perfectly planned trip!</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Start Planning?</h2>
              <p className="text-xl text-gray-700 mb-8">Join thousands of travelers who use our itinerary planner to create unforgettable trips.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/login')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Login to Get Started
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show restricted access for non-authenticated users
  if (!user) {
    return null; // Will show public view
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">My Itineraries</h1>
              <p className="text-xl mb-8">Plan, organize, and share your perfect trips</p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search itineraries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('my')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'my'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                My Itineraries
              </button>
              <button
                onClick={() => setActiveTab('shared')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'shared'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Shared with Me
              </button>
            </div>

            {activeTab === 'my' && (
              <button
                onClick={handleCreateItinerary}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Itinerary
              </button>
            )}
          </div>

          {/* Itineraries Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {currentItineraries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentItineraries.map((itinerary, index) => {
                    const itineraryKey = itinerary.id || itinerary._id || `itinerary-${index}`;
                    return (
                      <div
                        key={itineraryKey}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                      {/* Itinerary Image */}
                      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Calendar className="w-16 h-16 text-white opacity-20" />
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${itinerary.isPublic
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            {itinerary.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </div>

                      {/* Itinerary Content */}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                          {itinerary.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {itinerary.description}
                        </p>

                        {/* Destination */}
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>
                            {(() => {
                              // Check for destinationId object (backend structure)
                              if (itinerary.destinationId && typeof itinerary.destinationId === 'object') {
                                if (itinerary.destinationId.name) {
                                  return itinerary.destinationId.name;
                                }
                                if (itinerary.destinationId.city || itinerary.destinationId.country) {
                                  return `${itinerary.destinationId.city || 'Unknown City'}, ${itinerary.destinationId.country || 'Unknown Country'}`;
                                }
                              }
                              
                              // Check for destination object (fallback)
                              if (itinerary.destination && typeof itinerary.destination === 'object') {
                                if (itinerary.destination.name) {
                                  return itinerary.destination.name;
                                }
                                if (itinerary.destination.city || itinerary.destination.country) {
                                  return `${itinerary.destination.city || 'Unknown City'}, ${itinerary.destination.country || 'Unknown Country'}`;
                                }
                              }
                              
                              // Check for string IDs
                              if (typeof itinerary.destinationId === 'string') {
                                return `Destination ID: ${itinerary.destinationId}`;
                              }
                              if (typeof itinerary.destination === 'string') {
                                return `Destination ID: ${itinerary.destination}`;
                              }
                              
                              return 'Destination not available';
                            })()}
                          </span>
                        </div>

                        {/* Dates and Duration */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>
                              {itinerary.startDate && itinerary.endDate 
                                ? `${formatDate(itinerary.startDate)} - ${formatDate(itinerary.endDate)}`
                                : 'Dates not available'
                              }
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>
                              {itinerary.startDate && itinerary.endDate 
                                ? `${getDuration(itinerary.startDate, itinerary.endDate)} days`
                                : 'Duration not available'
                              }
                            </span>
                          </div>
                        </div>

                        {/* Days and Activities Count */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{itinerary.days?.length || 0} days</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            <span>{itinerary.days?.reduce((total, day) => total + (day.activities?.length || 0), 0) || 0} activities</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleViewItinerary(itinerary.id)}
                            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>

                          {activeTab === 'my' && (
                            <>
                              <button
                                onClick={() => handleEditItinerary(itinerary.id)}
                                className="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDuplicateItinerary(itinerary.id)}
                                className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                                title="Duplicate"
                              >
                                <Copy className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleShareItinerary(itinerary.id)}
                                className="px-3 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
                                title="Share"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleExportPDF(itinerary.id)}
                                className="px-3 py-2 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors"
                                title="Export PDF"
                              >
                                <Download className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteItinerary(itinerary.id)}
                                className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === 'my' ? 'No itineraries found' : 'No shared itineraries'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === 'my'
                      ? 'Start planning your next adventure by creating your first itinerary.'
                      : 'No one has shared any itineraries with you yet.'
                    }
                  </p>
                  {activeTab === 'my' && (
                    <button
                      onClick={handleCreateItinerary}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Create Your First Itinerary
                    </button>
                  )}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={`page-${page}`}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 border rounded-md ${currentPage === page
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
