'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/store';
import { fetchPackageDetails, clearSelectedPackage } from '@/store/slices/packageSlice';
import { addToCart } from '@/store/slices/cartSlice';
import type { Package } from '@/store/slices/packageSlice';
import Layout from '@/components/Layout';
import { MapPin, Star, Calendar, Users, Clock, DollarSign, ArrowLeft, Plane, Hotel, User, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPackage, isLoading, error } = useSelector((state: RootState) => state.package);
  type TabType = 'overview' | 'itinerary' | 'flights' | 'hotels' | 'guide';
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedPriceType, setSelectedPriceType] = useState<'economy' | 'business' | 'first'>('economy');

  const packageId = params.id as string;

  useEffect(() => {
    console.log('Package detail page mounted with ID:', packageId);
    if (packageId) {
      console.log('Fetching package details for ID:', packageId);
      dispatch(fetchPackageDetails(packageId));
    }
    return () => {
      console.log('Package detail page unmounting');
      dispatch(clearSelectedPackage());
    };
  }, [dispatch, packageId]);

  const handleBack = () => {
    router.back();
  };

  const handleBookPackage = (pkg: Package) => {
    try {
      const cartItem = {
        id: pkg.id,
        type: 'package' as const,
        title: pkg.title,
        image: pkg.destination.thumbnail,
        location: `${pkg.destination.name}, ${pkg.destination.country}`,
        price: pkg.price.perPerson[selectedPriceType],
        currency: pkg.price.currency || 'USD',
        quantity: 1,
        duration: `${pkg.duration.days} days, ${pkg.duration.nights} nights`,
        startDate: pkg.availability.startDate,
        endDate: pkg.availability.endDate,
        selectedOptions: {
          priceType: selectedPriceType,
          tourGuide: pkg.tourGuide.name,
          activities: pkg.activities.map((activity) => activity.title),
          availability: pkg.availability.slotsAvailable,
          flights: pkg.flights.length,
          hotels: pkg.hotels.length,
        },
        notes: `Package: ${pkg.title} - ${selectedPriceType} class`,
      };

      dispatch(addToCart(cartItem));
      toast.success('Package added to your bookings!');
    } catch (error) {
      console.error('Error adding package to cart:', error);
      toast.error('Failed to add package to bookings');
    }
  };

  if (isLoading) {
    console.log('Package detail page is loading...');
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading package details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !selectedPackage) {
    console.log('Package detail page error or no package:', { error, selectedPackage });
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Package Not Found</h2>
            <p className="text-gray-600 mb-4">
              {error || 'The package you are looking for does not exist.'}
            </p>
            <button
              onClick={handleBack}
              className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const pkg = selectedPackage;
  console.log('Package loaded successfully:', pkg);
  console.log('Destination data:', pkg.destination);
  console.log('Thumbnail URL:', pkg.destination?.thumbnail);
  console.log('Hotels data:', pkg.hotels);
  console.log('First hotel images:', pkg.hotels?.[0]?.images);
  
  // Test image URL construction
  const thumbnailUrl = pkg.destination?.thumbnail;
  const hotelImageUrl = pkg.hotels?.[0]?.images?.[0];
  const fallbackUrl = 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&h=400&fit=crop&crop=center';
  
  console.log('Thumbnail URL:', thumbnailUrl);
  console.log('Hotel Image URL:', hotelImageUrl);
  console.log('Fallback URL:', fallbackUrl);
  
  const finalImageUrl = thumbnailUrl || hotelImageUrl || fallbackUrl;
  console.log('Final Image URL:', finalImageUrl);
  
  // Use the thumbnail from package data response, same as destination page
  const workingImageUrl = pkg.destination?.thumbnail || fallbackUrl;

  // Additional safety check for incomplete package data
  if (!pkg || !pkg.id) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading package details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Packages
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Package Header */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                          <div className="relative h-96">
                {/* Smart image loading with multiple fallbacks */}
                <img
                  src={workingImageUrl}
                  alt={pkg.title || 'Package Image'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Image failed to load:', workingImageUrl);
                    const target = e.currentTarget as HTMLImageElement;
                    // Use placeholder like destination page
                    target.src = 'https://via.placeholder.com/1200x400?text=Package+Image';
                  }}
                  onLoad={(e) => {
                    console.log('Image loaded successfully:', workingImageUrl);
                    // Check if image actually has content
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.naturalWidth === 0 || target.naturalHeight === 0) {
                      console.log('Image loaded but has no content, trying fallback');
                      target.src = fallbackUrl;
                    }
                  }}
                />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h1 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">{pkg.title || 'Package Title'}</h1>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4 mr-2 text-white" />
                    <span className="text-white font-medium">{pkg.destination?.name || 'Unknown'}, {pkg.destination?.country || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 mr-2 text-yellow-300 fill-current" />
                    <span className="text-white font-medium">{pkg.tourGuide?.rating || 'N/A'}</span>
                  </div>
                  <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4 mr-2 text-white" />
                    <span className="text-white font-medium">{pkg.duration?.days || 0} days, {pkg.duration?.nights || 0} nights</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: 'overview', label: 'Overview', icon: '📋' },
                      { id: 'itinerary', label: 'Itinerary', icon: '📅' },
                      { id: 'flights', label: 'Flights', icon: '✈️' },
                      { id: 'hotels', label: 'Hotels', icon: '🏨' },
                      { id: 'guide', label: 'Tour Guide', icon: '👤' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-blue-600 text-blue-700 font-semibold'
                            : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-400'
                        }`}
                      >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-gray-900">Package Overview</h3>
                      <p className="text-gray-700 mb-8 text-lg leading-relaxed">{pkg.description || 'No description available'}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 rounded-lg p-6">
                          <h4 className="text-lg font-bold mb-4 text-gray-900">Package Highlights</h4>
                          <ul className="space-y-3">
                            <li className="flex items-center text-gray-700">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                              <span className="font-medium">Duration:</span>
                              <span className="ml-2">{pkg.duration?.days || 0} days, {pkg.duration?.nights || 0} nights</span>
                            </li>
                            <li className="flex items-center text-gray-700">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                              <span className="font-medium">Available slots:</span>
                              <span className="ml-2">{pkg.availability?.slotsAvailable || 0}</span>
                            </li>
                            <li className="flex items-center text-gray-700">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                              <span className="font-medium">Flights included:</span>
                              <span className="ml-2">{pkg.flights?.length || 0}</span>
                            </li>
                            <li className="flex items-center text-gray-700">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                              <span className="font-medium">Hotels included:</span>
                              <span className="ml-2">{pkg.hotels?.length || 0}</span>
                            </li>
                            <li className="flex items-center text-gray-700">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                              <span className="font-medium">Activities:</span>
                              <span className="ml-2">{pkg.activities?.length || 0}</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-6">
                          <h4 className="text-lg font-bold mb-4 text-gray-900">Availability</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700 font-medium">Start Date:</span>
                              <span className="text-gray-900 font-semibold">{pkg.availability?.startDate ? new Date(pkg.availability.startDate).toLocaleDateString() : 'Not specified'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700 font-medium">End Date:</span>
                              <span className="text-gray-900 font-semibold">{pkg.availability?.endDate ? new Date(pkg.availability.endDate).toLocaleDateString() : 'Not specified'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700 font-medium">Status:</span>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                pkg.isActive 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-red-500 text-white'
                              }`}>
                                {pkg.isActive ? 'Available' : 'Not Available'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Itinerary Tab */}
                  {activeTab === 'itinerary' && (
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-gray-900">Daily Itinerary</h3>
                      <div className="space-y-6">
                        {Array.from({ length: pkg.duration.days }, (_, dayIndex) => {
                          const dayNumber = dayIndex + 1;
                          const dayActivities = pkg.activities.filter(activity => activity.day === dayNumber);
                          
                          return (
                            <div key={dayNumber} className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6 shadow-sm">
                              <h4 className="text-xl font-bold mb-4 text-gray-900">Day {dayNumber}</h4>
                              {dayActivities.length > 0 ? (
                                <div className="space-y-4">
                                  {dayActivities.map((activity, index) => (
                                    <div key={activity._id || index} className="flex items-start space-x-4 bg-white rounded-lg p-4 shadow-sm">
                                      <div className="w-4 h-4 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                                      <div className="flex-1">
                                        <h5 className="font-bold text-gray-900 mb-2">{activity.title}</h5>
                                        <p className="text-gray-700 text-sm leading-relaxed">{activity.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 italic text-center py-4">No activities scheduled for this day.</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Flights Tab */}
                  {activeTab === 'flights' && (
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-gray-900">Flight Details</h3>
                      {pkg.flights.length > 0 ? (
                        <div className="space-y-6">
                          {pkg.flights.map((flight, index) => (
                            <div key={flight._id || index} className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                                                              <div className="flex items-center justify-between mb-4">
                                  <h4 className="text-xl font-bold text-gray-900">{flight.airline}</h4>
                                  <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full font-medium">Flight {flight.flightNumber}</span>
                                </div>
                              
                                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <h5 className="font-bold text-gray-900 mb-3">Departure</h5>
                                    <p className="font-bold text-lg text-gray-900">{flight.departure.airport}</p>
                                    <p className="text-gray-700 font-medium">{flight.departure.city}</p>
                                    <p className="text-gray-600">{flight.departure.time}</p>
                                  </div>
                                  
                                  <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <h5 className="font-bold text-gray-900 mb-3">Arrival</h5>
                                    <p className="font-bold text-lg text-gray-900">{flight.arrival.airport}</p>
                                    <p className="text-gray-700 font-medium">{flight.arrival.city}</p>
                                    <p className="text-gray-600">{flight.arrival.time}</p>
                                  </div>
                                </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No flight details available.</p>
                      )}
                    </div>
                  )}

                  {/* Hotels Tab */}
                  {activeTab === 'hotels' && (
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-gray-900">Hotel Accommodations</h3>
                      {pkg.hotels.length > 0 ? (
                        <div className="space-y-6">
                          {pkg.hotels.map((hotel, index) => (
                            <div key={hotel._id || index} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 shadow-sm">
                                                              <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h4 className="text-xl font-bold text-gray-900">{hotel.name}</h4>
                                    <p className="text-gray-700">{hotel.address}</p>
                                  </div>
                                  <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                    <span className="font-bold text-gray-900">{hotel.rating}</span>
                                  </div>
                                </div>
                              
                                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <p className="text-sm text-gray-600 font-medium mb-1">Room Type</p>
                                    <p className="font-bold text-gray-900">{hotel.roomType}</p>
                                  </div>
                                  <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <p className="text-sm text-gray-600 font-medium mb-1">Nights</p>
                                    <p className="font-bold text-gray-900">{hotel.nights}</p>
                                  </div>
                                </div>
                                
                                {/* Hotel Images */}
                                {hotel.images && hotel.images.length > 0 && (
                                  <div className="mb-4">
                                    <p className="text-sm text-gray-600 font-medium mb-2">Hotel Images</p>
                                    <div className="grid grid-cols-2 gap-2">
                                      {hotel.images.slice(0, 2).map((image, imgIndex) => (
                                        <img
                                          key={imgIndex}
                                          src={image}
                                          alt={`${hotel.name} - Image ${imgIndex + 1}`}
                                          className="w-full h-24 object-cover rounded-lg shadow-sm"
                                          onError={(e) => {
                                            const target = e.currentTarget as HTMLImageElement;
                                            target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop';
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Hotel Amenities */}
                                {hotel.amenities && hotel.amenities.length > 0 && (
                                  <div>
                                    <p className="text-sm text-gray-600 font-medium mb-2">Amenities</p>
                                    <div className="flex flex-wrap gap-2">
                                      {hotel.amenities.map((amenity, amenityIndex) => (
                                        <span key={amenityIndex} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                                          {amenity}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No hotel details available.</p>
                      )}
                    </div>
                  )}

                  {/* Tour Guide Tab */}
                  {activeTab === 'guide' && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-900">Tour Guide Information</h3>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-800">{pkg.tourGuide.name}</h4>
                            <div className="flex items-center mb-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span className="font-medium text-gray-800">{pkg.tourGuide.rating}</span>
                            </div>
                            
                            <div className="space-y-2 text-gray-800">
                              <p><strong>Languages:</strong> {pkg.tourGuide.language.join(', ')}</p>
                              <p><strong>Email:</strong> {pkg.tourGuide.email}</p>
                              <p><strong>Phone:</strong> {pkg.tourGuide.phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Pricing Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-md p-4 mb-4 border border-blue-200">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Pricing</h3>
                
                {/* Price Selection */}
                <div className="space-y-2 mb-4">
                  <div 
                    className={`flex justify-between items-center rounded-md p-2 cursor-pointer transition-all ${
                      selectedPriceType === 'economy' 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'bg-white hover:bg-blue-50'
                    }`}
                    onClick={() => setSelectedPriceType('economy')}
                  >
                    <span className={`font-medium text-sm ${selectedPriceType === 'economy' ? 'text-white' : 'text-gray-700'}`}>
                      Economy Class
                    </span>
                    <span className={`text-lg font-bold ${selectedPriceType === 'economy' ? 'text-white' : 'text-blue-600'}`}>
                      ${pkg.price?.perPerson?.economy || 0}
                    </span>
                  </div>
                  
                  <div 
                    className={`flex justify-between items-center rounded-md p-2 cursor-pointer transition-all ${
                      selectedPriceType === 'business' 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'bg-white hover:bg-blue-50'
                    }`}
                    onClick={() => setSelectedPriceType('business')}
                  >
                    <span className={`font-medium text-sm ${selectedPriceType === 'business' ? 'text-white' : 'text-gray-700'}`}>
                      Business Class
                    </span>
                    <span className={`text-lg font-bold ${selectedPriceType === 'business' ? 'text-white' : 'text-blue-600'}`}>
                      ${pkg.price?.perPerson?.business || 0}
                    </span>
                  </div>
                  
                  <div 
                    className={`flex justify-between items-center rounded-md p-2 cursor-pointer transition-all ${
                      selectedPriceType === 'first' 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'bg-white hover:bg-blue-50'
                    }`}
                    onClick={() => setSelectedPriceType('first')}
                  >
                    <span className={`font-medium text-sm ${selectedPriceType === 'first' ? 'text-white' : 'text-gray-700'}`}>
                      First Class
                    </span>
                    <span className={`text-lg font-bold ${selectedPriceType === 'first' ? 'text-white' : 'text-blue-600'}`}>
                      ${pkg.price?.perPerson?.first || 0}
                    </span>
                  </div>
                </div>
                
                {/* Selected Price Display */}
                <div className="bg-white rounded-md p-3 mb-4 shadow-sm">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Selected Price</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${pkg.price?.perPerson?.[selectedPriceType] || 0}
                    </p>
                    <p className="text-xs text-gray-500">per person</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleBookPackage(pkg)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold text-base shadow-md transform hover:scale-105"
                >
                  Book Package
                </button>
              </div>

              {/* Loyalty Information */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg shadow-md p-4 mb-4 border border-green-200">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Loyalty & Promotions</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-md p-3 shadow-sm">
                    <p className="text-xs text-gray-600 font-medium mb-1">Points Earned</p>
                    <p className="text-gray-900 font-semibold text-sm">{pkg.loyalty?.pointsEarned || 0} points</p>
                  </div>
                  {pkg.loyalty?.availablePromoCodes && pkg.loyalty.availablePromoCodes.length > 0 && (
                    <div className="bg-white rounded-md p-3 shadow-sm">
                      <p className="text-xs text-gray-600 font-medium mb-2">Available Promo Codes</p>
                      <div className="space-y-2">
                        {pkg.loyalty.availablePromoCodes.map((promo, index) => (
                          <div key={promo._id || index} className="border border-green-200 rounded-md p-2 bg-green-50">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-green-800 text-sm">{promo.code}</span>
                              <span className="text-xs font-semibold text-green-600">{promo.discountPercentage}% OFF</span>
                            </div>
                            <p className="text-xs text-gray-700">{promo.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Partner Information */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-lg shadow-md p-4 border border-purple-200">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Partner Information</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-md p-3 shadow-sm">
                    <p className="text-xs text-gray-600 font-medium mb-1">Partner</p>
                    <p className="text-gray-900 font-semibold text-sm">{pkg.partner?.name || 'Not specified'}</p>
                  </div>
                  <div className="bg-white rounded-md p-3 shadow-sm">
                    <p className="text-xs text-gray-600 font-medium mb-1">Role</p>
                    <p className="text-gray-900 font-semibold text-sm">{pkg.partner?.role || 'Not specified'}</p>
                  </div>
                  <div className="bg-white rounded-md p-3 shadow-sm">
                    <p className="text-xs text-gray-600 font-medium mb-1">Contact</p>
                    <p className="text-gray-900 font-semibold text-sm">{pkg.partner?.email || 'Not specified'}</p>
                    <p className="text-gray-700 text-sm">{pkg.partner?.phone || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
