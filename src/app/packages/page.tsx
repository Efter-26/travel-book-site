'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { AppDispatch, RootState } from '@/store';
import { fetchPackages } from '@/store/slices/packageSlice';
import { addToCart } from '@/store/slices/cartSlice';
import type { Package } from '@/store/slices/packageSlice';
import Layout from '@/components/Layout';
import { Search, Filter, MapPin, Star, Calendar, Users, Clock, DollarSign, Heart, Share2, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

export default function PackagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [duration, setDuration] = useState('');
  const [sortBy, setSortBy] = useState('popularity');

  const dispatch = useDispatch<AppDispatch>();
  const { packages, isLoading, error } = useSelector((state: RootState) => state.package);



  useEffect(() => {
    dispatch(fetchPackages({ 
      search: searchTerm, 
      category: selectedCategory, 
      priceRange, 
      duration, 
      sortBy,
      page: 1,
      limit: 10
    }));
  }, [dispatch, searchTerm, selectedCategory, priceRange, duration, sortBy]);

  const categories = ['All', 'Adventure', 'Cultural', 'Wildlife', 'Beach', 'Mountain', 'City', 'Luxury'];



  // Filter packages based on search and other criteria
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.destination.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.destination.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For now, we'll skip category filtering since backend doesn't provide category
    const matchesCategory = true; // !selectedCategory || selectedCategory === 'All' || pkg.category === selectedCategory;
    
    // Check if price is within range (using economy price as default)
    const packagePrice = pkg.price.perPerson.economy;
    const matchesPrice = packagePrice >= priceRange[0] && packagePrice <= priceRange[1];
    
    // Check if duration matches (using days)
    const packageDays = pkg.duration.days;
    const matchesDuration = !duration || 
      (duration === '3' && packageDays >= 3 && packageDays <= 5) ||
      (duration === '7' && packageDays >= 6 && packageDays <= 9) ||
      (duration === '10' && packageDays >= 10 && packageDays <= 14) ||
      (duration === '15' && packageDays >= 15);
    
    return matchesSearch && matchesCategory && matchesPrice && matchesDuration;
  });

  // Sort packages
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price.perPerson.economy - b.price.perPerson.economy;
      case 'price-high':
        return b.price.perPerson.economy - a.price.perPerson.economy;
      case 'rating':
        return b.tourGuide.rating - a.tourGuide.rating;
      case 'duration':
        return a.duration.days - b.duration.days;
      default:
        return 0; // Default sorting (no specific order)
    }
  });

  const handleBookNow = (pkg: Package) => {
    try {
      const cartItem = {
        id: pkg.id,
        type: 'package' as const,
        title: pkg.title,
        image: pkg.destination.thumbnail,
        location: `${pkg.destination.name}, ${pkg.destination.country}`,
        price: pkg.price.perPerson.economy,
        currency: 'USD',
        quantity: 1,
        duration: `${pkg.duration.days} days, ${pkg.duration.nights} nights`,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + pkg.duration.days * 24 * 60 * 60 * 1000).toISOString(),
        selectedOptions: {
          tourGuide: pkg.tourGuide.name,
          activities: pkg.activities.map((activity) => activity.title),
          availability: pkg.availability.slotsAvailable,
        },
        notes: `Package: ${pkg.title}`,
      };

      dispatch(addToCart(cartItem));
      toast.success('Package added to your bookings!');
    } catch (error) {
      console.error('Error adding package to cart:', error);
      toast.error('Failed to add package to bookings');
    }
  };


  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Animated Background */}
        <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white py-20 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-bounce"></div>
            <div className="absolute top-20 right-20 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white opacity-10 rounded-full animate-spin"></div>
            <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-white opacity-10 rounded-full animate-ping"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white opacity-5 rounded-full animate-pulse"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4 animate-fade-in">
                Discover Amazing Travel Packages
              </h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Curated experiences that combine adventure, culture, and luxury for unforgettable journeys
              </p>
              
              {/* Search Form */}
              <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Packages</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Where do you want to go?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Categories</option>
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Duration</option>
                      <option value="3">3-5 days</option>
                      <option value="7">6-9 days</option>
                      <option value="10">10-14 days</option>
                      <option value="15">15+ days</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors">
                    Search Packages
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h3>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="duration">Duration</option>
                  </select>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {sortedPackages.length} Packages Found
                </h2>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <p className="text-red-800">Error loading packages: {error}</p>
                </div>
              )}

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedPackages.map((pkg) => (
                    <div key={pkg.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="relative">
                      <img
                        src={pkg.destination.thumbnail}
                        alt={pkg.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop';
                        }}
                      />
                      {pkg.isActive && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Available
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
                          <Heart className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
                          <Share2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white px-2 py-1 rounded-full text-sm font-medium">
                        ${pkg.price.perPerson.economy}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {pkg.title}
                        </h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">{pkg.tourGuide.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{pkg.destination.name}, {pkg.destination.country}</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {pkg.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{pkg.duration.days} days, {pkg.duration.nights} nights</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{pkg.availability.slotsAvailable} slots</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {pkg.activities.slice(0, 3).map((activity, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {activity.title}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-blue-600">${pkg.price.perPerson.economy}</span>
                          <span className="ml-2 text-sm text-gray-500">per person</span>
                        </div>
                        <div className="flex space-x-2">
                          {pkg.id ? (
                            <button 
                              onClick={() => window.location.href = `/packages/${pkg.id}`}
                              className="flex items-center px-3 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </button>
                          ) : (
                            <button 
                              className="flex items-center px-3 py-2 border border-gray-400 text-gray-400 rounded-md cursor-not-allowed"
                              disabled
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </button>
                          )}
                          <button 
                            onClick={() => handleBookNow(pkg)}
                            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            <DollarSign className="w-4 h-4 mr-1" />
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {sortedPackages.length === 0 && (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
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
