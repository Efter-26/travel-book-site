'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '@/store';
import { fetchFlights } from '@/store/slices/flightSlice';
import type { Flight } from '@/store/slices/flightSlice';
import Layout from '@/components/Layout';
import {
  Search,
  Filter,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Plane,
  Clock,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function FlightsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departureAirport, setDepartureAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');
  const [selectedAirline, setSelectedAirline] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Advanced filters
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 5000 });
  const [selectedStops, setSelectedStops] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState('all');

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { flights, isLoading, pagination } = useSelector((state: RootState) => state.flight);
  const { user } = useSelector((state: RootState) => state.auth);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch flights when filters change
  useEffect(() => {
    const params: {
      page: number;
      limit: number;
      search?: string;
      departure?: string;
      arrival?: string;
      airline?: string;
      isActive?: boolean;
      minPrice?: number;
      maxPrice?: number;
      stops?: number;
      class?: string;
    } = {
      page: currentPage,
      limit: 6, // Show 6 flights per page
      isActive: true, // Only show active flights for public view
    };

    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm;
    }

    if (departureAirport) {
      params.departure = departureAirport;
    }

    if (arrivalAirport) {
      params.arrival = arrivalAirport;
    }

    if (selectedAirline !== 'all') {
      params.airline = selectedAirline;
    }

    if (priceRange.min > 0 || priceRange.max < 5000) {
      params.minPrice = priceRange.min;
      params.maxPrice = priceRange.max;
    }

    if (selectedStops !== null) {
      params.stops = selectedStops;
    }

    if (selectedClass !== 'all') {
      params.class = selectedClass;
    }

    dispatch(fetchFlights(params));
    
    // Show toast notification for search/filter changes
    if (debouncedSearchTerm || departureAirport || arrivalAirport || selectedAirline !== 'all') {
      toast.info('Updating search results...');
    }
  }, [dispatch, debouncedSearchTerm, departureAirport, arrivalAirport, selectedAirline, currentPage, priceRange, selectedStops, selectedClass]);

  const airlines = [
    { id: 'all', name: 'All Airlines' },
    { id: 'emirates', name: 'Emirates' },
    { id: 'qatar', name: 'Qatar Airways' },
    { id: 'british', name: 'British Airways' },
    { id: 'lufthansa', name: 'Lufthansa' },
    { id: 'airfrance', name: 'Air France' },
    { id: 'klm', name: 'KLM' },
    { id: 'delta', name: 'Delta Airlines' },
    { id: 'united', name: 'United Airlines' },
    { id: 'american', name: 'American Airlines' },
  ];

  const stopOptions = [
    { value: null, label: 'Any Stops' },
    { value: 0, label: 'Direct Flights' },
    { value: 1, label: '1 Stop' },
    { value: 2, label: '2+ Stops' },
  ];

  const classOptions = [
    { value: 'all', label: 'All Classes' },
    { value: 'economy', label: 'Economy' },
    { value: 'business', label: 'Business' },
    { value: 'first', label: 'First Class' },
  ];

  const handleFlightClick = (flight: { id: string; _id?: string; flightNumber: string }) => {
    const flightId = flight.id || flight._id;
    if (!flightId) {
      console.error('Flight ID is missing:', flight);
      return;
    }
    router.push(`/flights/${flightId}`);
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    setPriceRange(prev => {
      const newRange = { ...prev, [type]: value };
      toast.info(`Price range updated: $${newRange.min} - $${newRange.max}`);
      return newRange;
    });
  };

  const handleStopChange = (stops: number | null) => {
    setSelectedStops(stops);
    toast.info(stops === null ? 'Stop filter cleared' : `Filtering by ${stops} stop${stops === 1 ? '' : 's'}`);
  };

  const handleClassChange = (classType: string) => {
    setSelectedClass(classType);
    toast.info(classType === 'all' ? 'Class filter cleared' : `Filtering by ${classType} class`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDepartureAirport('');
    setArrivalAirport('');
    setSelectedAirline('all');
    setPriceRange({ min: 0, max: 5000 });
    setSelectedStops(null);
    setSelectedClass('all');
    setCurrentPage(1);
    toast.success('All filters cleared!');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getLowestPrice = (flight: Flight) => {
    const prices = [
      flight.seats?.economy?.price,
      flight.seats?.business?.price,
      flight.seats?.first?.price
    ].filter(price => price && price > 0);
    
    return prices.length > 0 ? Math.min(...prices) : 0;
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
              <h1 className="text-4xl font-bold mb-4">Find Your Perfect Flight</h1>
              <p className="text-xl mb-8">Discover amazing flights with the best rates and schedules</p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search flights, airlines, or destinations..."
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

                {/* Departure Airport */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-900">Departure Airport</h4>
                  <input
                    type="text"
                    placeholder="e.g., JFK, LAX"
                    value={departureAirport}
                    onChange={(e) => setDepartureAirport(e.target.value)}
                    className="w-full p-2 border-2 border-white/30 rounded-md focus:ring-2 focus:ring-white/50 focus:border-white/50 bg-white/95 backdrop-blur-sm text-gray-800"
                  />
                </div>

                {/* Arrival Airport */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-900">Arrival Airport</h4>
                  <input
                    type="text"
                    placeholder="e.g., LHR, CDG"
                    value={arrivalAirport}
                    onChange={(e) => setArrivalAirport(e.target.value)}
                    className="w-full p-2 border-2 border-white/30 rounded-md focus:ring-2 focus:ring-white/50 focus:border-white/50 bg-white/95 backdrop-blur-sm text-gray-800"
                  />
                </div>

                {/* Airlines */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-900">Airlines</h4>
                  <select
                    value={selectedAirline}
                    onChange={(e) => setSelectedAirline(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  >
                    {airlines.map((airline) => (
                      <option key={airline.id} value={airline.id}>
                        {airline.name}
                      </option>
                    ))}
                  </select>
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

                {/* Stops Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-900">Stops</h4>
                  <div className="space-y-2">
                    {stopOptions.map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="stops"
                          value={option.value || ''}
                          checked={selectedStops === option.value}
                          onChange={() => handleStopChange(option.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-800 font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Class Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-900">Class</h4>
                  <div className="space-y-2">
                    {classOptions.map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="class"
                          value={option.value}
                          checked={selectedClass === option.value}
                          onChange={() => handleClassChange(option.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-800 font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Active Filters */}
                {(departureAirport || arrivalAirport || selectedAirline !== 'all' || searchTerm || selectedStops !== null || selectedClass !== 'all' || priceRange.min > 0 || priceRange.max < 5000) && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-gray-900">Active Filters</h4>
                    <div className="space-y-2">
                      {departureAirport && (
                        <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-800 font-medium">From: {departureAirport}</span>
                          <button
                            onClick={() => setDepartureAirport('')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {arrivalAirport && (
                        <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-800 font-medium">To: {arrivalAirport}</span>
                          <button
                            onClick={() => setArrivalAirport('')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {selectedAirline !== 'all' && (
                        <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-800 font-medium">Airline: {airlines.find(a => a.id === selectedAirline)?.name}</span>
                          <button
                            onClick={() => setSelectedAirline('all')}
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
                      {selectedStops !== null && (
                        <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-800 font-medium">Stops: {stopOptions.find(s => s.value === selectedStops)?.label}</span>
                          <button
                            onClick={() => handleStopChange(null)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {selectedClass !== 'all' && (
                        <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-800 font-medium">Class: {classOptions.find(c => c.value === selectedClass)?.label}</span>
                          <button
                            onClick={() => handleClassChange('all')}
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
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Flights Grid */}
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
                        onClick={() => router.push('/admin?tab=flights')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Manage Flights
                      </button>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {flights.map((flight) => (
                      <div
                        key={flight.id || flight._id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleFlightClick(flight)}
                      >
                        <div className="p-6">
                          {/* Flight Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              {flight.airline?.logo && (
                                <img
                                  src={flight.airline.logo}
                                  alt={flight.airline.name}
                                  className="w-8 h-8 mr-3"
                                  onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              )}
                              <div>
                                <h3 className="font-semibold text-gray-900">{flight.airline?.name || 'Airline'}</h3>
                                <p className="text-sm text-gray-700 font-medium">{flight.flightNumber}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">${getLowestPrice(flight)}</div>
                              <div className="text-xs text-gray-600 font-medium">starting from</div>
                            </div>
                          </div>

                          {/* Flight Route */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">
                                {formatTime(flight.departure.time)}
                              </div>
                              <div className="text-sm text-gray-700 font-medium">{flight.departure.airport.code}</div>
                              <div className="text-xs text-gray-600 font-medium">{flight.departure.airport.city}</div>
                            </div>
                            
                            <div className="flex-1 mx-4">
                              <div className="flex items-center justify-center">
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <Plane className="w-4 h-4 mx-2 text-blue-500 transform rotate-90" />
                                <div className="flex-1 h-px bg-gray-300"></div>
                              </div>
                              <div className="text-center text-xs text-gray-600 mt-1 font-medium">
                                {formatDuration(flight.duration)}
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">
                                {formatTime(flight.arrival.time)}
                              </div>
                              <div className="text-sm text-gray-700 font-medium">{flight.arrival.airport.code}</div>
                              <div className="text-xs text-gray-600 font-medium">{flight.arrival.airport.city}</div>
                            </div>
                          </div>

                          {/* Flight Details */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-700 font-medium">Aircraft:</span>
                              <span className="font-semibold text-gray-900">{flight.aircraft?.type} {flight.aircraft?.model}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-700 font-medium">Stops:</span>
                              <span className="font-semibold text-gray-900">
                                {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops === 1 ? '' : 's'}`}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-700 font-medium">Distance:</span>
                              <span className="font-semibold text-gray-900">{flight.distance} km</span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              flight.isActive 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {flight.isActive ? 'Available' : 'Unavailable'}
                            </span>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {flights.length === 0 && (
                    <div className="text-center py-12">
                      <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No flights found</h3>
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
                              className={`px-3 py-2 border rounded-md font-medium ${
                                currentPage === page
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
