'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '@/store';
import { fetchDestinations, searchDestinations, fetchDestinationsByCountry } from '@/store/slices/destinationSlice';
import Layout from '@/components/Layout';
import { Search, Filter, MapPin, Star, Calendar, Users, ChevronLeft, ChevronRight, X, Award } from 'lucide-react';

export default function DestinationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Advanced filters
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [locationFilter, setLocationFilter] = useState('all');

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { destinations, isLoading, pagination } = useSelector((state: RootState) => state.destination);
  const { user } = useSelector((state: RootState) => state.auth);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch destinations when filters change
  useEffect(() => {
    const params: {
      page: number;
      limit: number;
      search?: string;
      country?: string;
      isActive?: boolean;
    } = {
      page: currentPage,
      limit: 6, // Show 6 destinations per page
      isActive: true, // Only show active destinations for public view
    };

    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm;
    }

    if (selectedCountry !== 'all') {
      params.country = selectedCountry;
    }

    dispatch(fetchDestinations(params));
    
    // Show toast notification for search/filter changes
    if (debouncedSearchTerm || selectedCountry !== 'all') {
      toast.info('Updating search results...');
    }
  }, [dispatch, debouncedSearchTerm, selectedCountry, currentPage]);



  const countries = [
    { id: 'all', name: 'All Countries' },
    { id: 'France', name: 'France' },
    { id: 'Japan', name: 'Japan' },
    { id: 'Indonesia', name: 'Indonesia' },
    { id: 'USA', name: 'United States' },
    { id: 'UK', name: 'United Kingdom' },
    { id: 'Italy', name: 'Italy' },
    { id: 'Spain', name: 'Spain' },
    { id: 'Thailand', name: 'Thailand' },
    { id: 'Australia', name: 'Australia' },
  ];



  const ratingOptions = [
    { value: null, label: 'Any Rating' },
    { value: 5, label: '5 Stars' },
    { value: 4, label: '4+ Stars' },
    { value: 3, label: '3+ Stars' },
    { value: 2, label: '2+ Stars' },
  ];

  const handleDestinationClick = (destination: { id: string; _id?: string; name: string }) => {
    // Use destination ID for direct API access
    const destinationId = destination.id || destination._id;
    if (!destinationId) {
      console.error('Destination ID is missing:', destination);
      return;
    }
    router.push(`/destinations/${destinationId}`);
  };

  const handleRatingChange = (rating: number | null) => {
    setRatingFilter(rating);
    toast.info(rating ? `Filtering by ${rating}+ stars` : 'Rating filter cleared');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCountry('all');
    setRatingFilter(null);
    setLocationFilter('all');
    setCurrentPage(1);
    toast.success('All filters cleared!');
  };



  // Add ratings to destinations
  const destinationsWithRatings = destinations.map(destination => {
    return {
      ...destination,
      rating: Math.floor(Math.random() * 3) + 3, // Random rating between 3-5
    };
  });

  // Client-side filtering for advanced filters
  const filteredDestinations = destinationsWithRatings.filter(destination => {
    // Rating filter
    if (ratingFilter && destination.rating < ratingFilter) {
      return false;
    }

    // Location filter (city/country)
    if (locationFilter !== 'all') {
      const destinationLocation = `${destination.city} ${destination.country}`.toLowerCase();
      if (!destinationLocation.includes(locationFilter.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <Layout>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 via-purple-700/20 to-blue-700/20"></div>
          
          {/* Floating Circles Animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
            <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/10 rounded-full animate-pulse animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '5s' }}></div>
            <div className="absolute bottom-40 right-10 w-18 h-18 bg-white/10 rounded-full animate-pulse animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}></div>
          </div>
          
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-6 -translate-y-32 animate-pulse" style={{ animationDuration: '8s' }}></div>
          
          {/* Moving Light Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" style={{ animationDuration: '6s' }}></div>
            <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" style={{ animationDelay: '3s', animationDuration: '6s' }}></div>
          </div>
          
          {/* Animated Wave Effect */}
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/10 to-transparent animate-pulse" style={{ animationDuration: '10s' }}></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Explore Amazing Destinations</h1>
              <p className="text-xl mb-8">Discover the world&apos;s most beautiful places and plan your next adventure</p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search destinations, countries, or activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 border-2 border-white/30 shadow-lg bg-white/95 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center text-gray-700">
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear All
                  </button>
                </div>

                {/* Countries */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-700">Countries</h4>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                  >
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-700">Location</h4>
                  <input
                    type="text"
                    placeholder="Search by city or location..."
                    value={locationFilter === 'all' ? '' : locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value || 'all')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-white/50 focus:border-white/50 text-gray-600 bg-white/95 backdrop-blur-sm"
                  />
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-700">Rating</h4>
                  <div className="space-y-2">
                    {ratingOptions.map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          value={option.value || ''}
                          checked={ratingFilter === option.value}
                          onChange={() => handleRatingChange(option.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>





                {/* Active Filters */}
                {(selectedCountry !== 'all' || searchTerm || ratingFilter || locationFilter !== 'all') && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Active Filters</h4>
                    <div className="space-y-2">
                      {selectedCountry !== 'all' && (
                        <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-700">Country: {countries.find(c => c.id === selectedCountry)?.name}</span>
                          <button
                            onClick={() => setSelectedCountry('all')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {searchTerm && (
                        <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-600">Search: &quot;{searchTerm}&quot;</span>
                          <button
                            onClick={() => setSearchTerm('')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {ratingFilter && (
                        <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-600">Rating: {ratingFilter}+ stars</span>
                          <button
                            onClick={() => handleRatingChange(null)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {locationFilter !== 'all' && (
                        <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-600">Location: &quot;{locationFilter}&quot;</span>
                          <button
                            onClick={() => setLocationFilter('all')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Destinations Grid */}
            <div className="lg:w-3/4">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? (
                      <button
                        onClick={() => router.push('/admin?tab=destinations')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Manage Destinations
                      </button>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {filteredDestinations.map((destination) => (
                      <div 
                        key={destination.id || destination._id} 
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleDestinationClick(destination)}
                      >
                        <div className="relative">
                          <img
                            src={destination.thumbnail || (destination.images && destination.images.length > 0 ? destination.images[0] : '')}
                            alt={destination.name}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/400x300?text=Destination';
                            }}
                          />
                          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-sm font-medium shadow-sm">
                            {destination.city}
                          </div>
                          {/* Status Badge */}
                          <div className="absolute top-3 left-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              destination.isActive 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {destination.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          

                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2 text-gray-900">{destination.name}</h3>
                          
                          {/* Rating */}
                          <div className="flex items-center mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < destination.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-1">({destination.rating}.0)</span>
                          </div>

                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {destination.description}
                          </p>
                          
                          {/* Location Info */}
                          <div className="flex items-center mb-3">
                            <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">
                              {destination.city}, {destination.country}
                            </span>
                          </div>

                          {/* Additional Info */}
                          <div className="space-y-2 mb-4">
                            {destination.climate && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>{destination.climate}</span>
                              </div>
                            )}

                            {destination.language && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Award className="w-4 h-4 mr-1" />
                                <span>{destination.language}</span>
                              </div>
                            )}
                          </div>

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

                          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredDestinations.length === 0 && (
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations found</h3>
                      <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Clear Filters
                      </button>
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
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 border rounded-md ${
                                currentPage === page
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
        </div>
      </div>
    </Layout>
  );
}
