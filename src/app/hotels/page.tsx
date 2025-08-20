'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '@/store';
import { fetchHotels } from '@/store/slices/hotelSlice';
import Layout from '@/components/Layout';
import {
  Search,
  Filter,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Award,
  Wifi,
  Car,
  Utensils,
  Bed,
  Phone,
  Mail
} from 'lucide-react';

export default function HotelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Advanced filters
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 5000 });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState('all');

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { hotels, isLoading, pagination } = useSelector((state: RootState) => state.hotel);
  const { user } = useSelector((state: RootState) => state.auth);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);



  // Dynamic pricing rules
  const getSeasonalMultiplier = () => {
    const currentMonth = new Date().getMonth();

    // Peak season (June-August, December)
    if ((currentMonth >= 5 && currentMonth <= 7) || currentMonth === 11) {
      return 1.4; // 40% increase
    }
    // Shoulder season (April-May, September-October)
    else if (currentMonth === 3 || currentMonth === 4 || currentMonth === 8 || currentMonth === 9) {
      return 1.2; // 20% increase
    }
    // Off-peak season (January-March, November)
    else {
      return 0.8; // 20% discount
    }
  };

  // Prices are already adjusted in the store; no client-side recalculation

  // Add ratings and derive starting price from already-adjusted data
  const hotelsWithRatings = hotels.map(hotel => {
    const seasonalMultiplier = getSeasonalMultiplier();

    // Use adjusted room type prices directly (set in the store)
    const roomTypesWithDynamicPricing = hotel.roomTypes?.map(room => ({
      ...room,
      dynamicPrice: room.price,
    })) || [];

    // Starting price comes from the minimum of adjusted room prices, otherwise adjusted priceRange.min
    const startingPrice = roomTypesWithDynamicPricing.length > 0
      ? Math.min(...roomTypesWithDynamicPricing.map(room => room.dynamicPrice))
      : (hotel.priceRange?.min ?? 0);

    return {
      ...hotel,
      rating: Math.floor(Math.random() * 3) + 3, // Random rating between 3-5
      roomTypes: roomTypesWithDynamicPricing,
      startingPrice,
      seasonalMultiplier,
      isPeakSeason: seasonalMultiplier > 1,
      isOffPeakSeason: seasonalMultiplier < 1,
    };
  });

  // Fetch hotels when filters change
  useEffect(() => {
    const params: {
      page: number;
      limit: number;
      search?: string;
      destination?: string;
      isActive?: boolean;
      minPrice?: number;
      maxPrice?: number;
      rating?: number;
      amenities?: string[];
    } = {
      page: currentPage,
      limit: 6, // Show 6 hotels per page
      isActive: true, // Only show active hotels for public view
    };

    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm;
    }

    if (selectedDestination !== 'all') {
      params.destination = selectedDestination;
    }

    if (ratingFilter) {
      params.rating = ratingFilter;
    }

    if (priceRange.min > 0 || priceRange.max < 5000) {
      params.minPrice = priceRange.min;
      params.maxPrice = priceRange.max;
    }

    if (selectedAmenities.length > 0) {
      params.amenities = selectedAmenities;
    }

    dispatch(fetchHotels(params));

    // Show toast notification for search/filter changes
    if (debouncedSearchTerm || selectedDestination !== 'all') {
      toast.info('Updating search results...');
    }
  }, [dispatch, debouncedSearchTerm, selectedDestination, currentPage, ratingFilter, priceRange, selectedAmenities]);

  const destinations = [
    { id: 'all', name: 'All Destinations' },
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

  const amenities = [
    { id: 'wifi', name: 'Free WiFi', icon: Wifi },
    { id: 'parking', name: 'Free Parking', icon: Car },
    { id: 'restaurant', name: 'Restaurant', icon: Utensils },
    { id: 'pool', name: 'Swimming Pool', icon: Award },
    { id: 'gym', name: 'Fitness Center', icon: Award },
    { id: 'spa', name: 'Spa & Wellness', icon: Award },
    { id: 'room-service', name: 'Room Service', icon: Award },
    { id: 'concierge', name: 'Concierge', icon: Award },
  ];

  const ratingOptions = [
    { value: null, label: 'Any Rating' },
    { value: 5, label: '5 Stars' },
    { value: 4, label: '4+ Stars' },
    { value: 3, label: '3+ Stars' },
    { value: 2, label: '2+ Stars' },
  ];

  const handleHotelClick = (hotel: { id: string; _id?: string; name: string }) => {
    const hotelId = hotel.id || hotel._id;
    if (!hotelId) {
      console.error('Hotel ID is missing:', hotel);
      return;
    }
    router.push(`/hotels/${hotelId}`);
  };

  const handleAmenityToggle = (amenityId: string) => {
    setSelectedAmenities(prev => {
      const newAmenities = prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId];

      toast.info(`${amenities.find(a => a.id === amenityId)?.name} ${prev.includes(amenityId) ? 'removed from' : 'added to'} filters`);
      return newAmenities;
    });
  };

  const handleRatingChange = (rating: number | null) => {
    setRatingFilter(rating);
    toast.info(rating ? `Filtering by ${rating}+ stars` : 'Rating filter cleared');
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    setPriceRange(prev => {
      const newRange = { ...prev, [type]: value };
      toast.info(`Price range updated: $${newRange.min} - $${newRange.max}`);
      return newRange;
    });
  };



  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDestination('all');
    setRatingFilter(null);
    setPriceRange({ min: 0, max: 5000 });
    setSelectedAmenities([]);
    setLocationFilter('all');
    setCurrentPage(1);
    toast.success('All filters cleared!');
  };

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
              <h1 className="text-4xl font-bold mb-4">Find Your Perfect Hotel</h1>
              <p className="text-xl mb-8">Discover amazing hotels with the best rates and amenities</p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search hotels, destinations, or amenities..."
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
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-800 font-medium"
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
                  <h3 className="text-lg font-semibold flex items-center text-gray-900">
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {/* Destinations */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-900">Destinations</h4>
                  <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white/95 backdrop-blur-sm"
                  >
                    {destinations.map((destination) => (
                      <option key={destination.id} value={destination.id}>
                        {destination.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-900">Location</h4>
                  <input
                    type="text"
                    placeholder="Search by city or location..."
                    value={locationFilter === 'all' ? '' : locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value || 'all')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-white/50 focus:border-white/50 bg-white/95 backdrop-blur-sm text-gray-800"
                  />
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-900">Rating</h4>
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
                        <span className="text-sm text-gray-800 font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-900">Price Range</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-800 mb-1 font-medium">Min Price</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={priceRange.min}
                        onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-800 mb-1 font-medium">Max Price</label>
                      <input
                        type="number"
                        placeholder="5000"
                        value={priceRange.max}
                        onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value) || 5000)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-900">Amenities</h4>
                  <div className="space-y-2">
                    {amenities.map((amenity) => {
                      const IconComponent = amenity.icon;
                      return (
                        <label key={amenity.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedAmenities.includes(amenity.id)}
                            onChange={() => handleAmenityToggle(amenity.id)}
                            className="mr-2"
                          />
                          <IconComponent className="w-4 h-4 mr-2 text-gray-600" />
                          <span className="text-sm text-gray-800 font-medium">{amenity.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Active Filters */}
                {(selectedDestination !== 'all' || searchTerm || ratingFilter || selectedAmenities.length > 0 || locationFilter !== 'all' || priceRange.min > 0 || priceRange.max < 5000) && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-gray-900">Active Filters</h4>
                    <div className="space-y-2">
                      {selectedDestination !== 'all' && (
                        <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-800 font-medium">Destination: {destinations.find(d => d.id === selectedDestination)?.name}</span>
                          <button
                            onClick={() => setSelectedDestination('all')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {searchTerm && (
                        <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-800 font-medium">Search: &quot;{searchTerm}&quot;</span>
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
                          <span className="text-sm text-gray-800 font-medium">Rating: {ratingFilter}+ stars</span>
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
                          <span className="text-sm text-gray-800 font-medium">Location: &quot;{locationFilter}&quot;</span>
                          <button
                            onClick={() => setLocationFilter('all')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {(priceRange.min > 0 || priceRange.max < 5000) && (
                        <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-800 font-medium">Price: ${priceRange.min} - ${priceRange.max}</span>
                          <button
                            onClick={() => setPriceRange({ min: 0, max: 5000 })}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {selectedAmenities.map((amenityId) => (
                        <div key={amenityId} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-800 font-medium">Amenity: {amenities.find(a => a.id === amenityId)?.name}</span>
                          <button
                            onClick={() => handleAmenityToggle(amenityId)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hotels Grid */}
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
                        onClick={() => router.push('/admin?tab=hotels')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Manage Hotels
                      </button>
                    ) : null}
                  </div>



                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {hotelsWithRatings.map((hotel) => (
                      <div
                        key={hotel.id || hotel._id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleHotelClick(hotel)}
                      >
                        <div className="relative">
                          <img
                            src={hotel.thumbnail || (hotel.images && hotel.images.length > 0 ? hotel.images[0] : '')}
                            alt={hotel.name}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/400x300?text=Hotel';
                            }}
                          />

                          {/* Status Badge */}
                          <div className="absolute top-3 left-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${hotel.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                              }`}>
                              {hotel.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          {/* Seasonal Pricing Badge */}
                          <div className="absolute top-3 right-3">
                            {hotel.isPeakSeason && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                Peak Season
                              </span>
                            )}
                            {hotel.isOffPeakSeason && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                Off-Peak
                              </span>
                            )}
                            {!hotel.isPeakSeason && !hotel.isOffPeakSeason && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                Shoulder
                              </span>
                            )}
                          </div>


                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2 text-gray-900">{hotel.name}</h3>

                          {/* Rating and Starting Price */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < hotel.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-700 ml-1 font-medium">({hotel.rating}.0)</span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">${hotel.startingPrice}</div>
                              <div className="text-xs text-gray-600 font-medium">starting from</div>
                              <div className="text-xs text-gray-600 font-medium">
                                {hotel.isPeakSeason ? 'Peak Season' : hotel.isOffPeakSeason ? 'Off-Peak' : 'Shoulder'}
                              </div>
                              {hotel.seasonalMultiplier !== 1 && (
                                <div className="text-xs text-gray-600 font-medium">
                                  {hotel.seasonalMultiplier > 1 ? '+' : ''}{Math.round((hotel.seasonalMultiplier - 1) * 100)}% seasonal
                                </div>
                              )}

                            </div>
                          </div>

                          <p className="text-gray-700 text-sm mb-3 line-clamp-2 font-medium">
                            {hotel.description}
                          </p>

                          {/* Location Info */}
                          <div className="flex items-center mb-3">
                            <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                            <span className="text-sm text-gray-700 font-medium">
                              {hotel.destination?.city}, {hotel.destination?.country}
                            </span>
                          </div>

                          {/* Contact Info */}
                          <div className="space-y-2 mb-4">
                            {hotel.contactInfo?.phone && (
                              <div className="flex items-center text-sm text-gray-600 font-medium">
                                <Phone className="w-4 h-4 mr-1" />
                                <span>{hotel.contactInfo.phone}</span>
                              </div>
                            )}
                            {hotel.contactInfo?.email && (
                              <div className="flex items-center text-sm text-gray-600 font-medium">
                                <Mail className="w-4 h-4 mr-1" />
                                <span>{hotel.contactInfo.email}</span>
                              </div>
                            )}
                          </div>

                          {/* Amenities */}
                          {hotel.amenities && hotel.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {hotel.amenities.slice(0, 3).map((amenity, index) => (
                                <span key={`${hotel.id || hotel._id}-amenity-${index}`} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                  {amenity}
                                </span>
                              ))}
                              {hotel.amenities.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                                  +{hotel.amenities.length - 3} more
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

                  {hotelsWithRatings.length === 0 && (
                    <div className="text-center py-12">
                      <Bed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No hotels found</h3>
                      <p className="text-gray-700 mb-4 font-medium">Try adjusting your search criteria or filters.</p>
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
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
                          className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-800 font-medium"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 border rounded-md font-medium ${currentPage === page
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'border-gray-300 hover:bg-gray-50 text-gray-800'
                                }`}
                            >
                              {page}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-800 font-medium"
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
