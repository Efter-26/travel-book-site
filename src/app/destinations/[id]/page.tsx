'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchDestination } from '@/store/slices/destinationSlice';
import Layout from '@/components/Layout';
import {
  MapPin,
  Star,
  Calendar,
  Users,
  Globe,
  Clock,
  DollarSign,
  Heart,
  Share2,
  ArrowLeft,
  Package,
  Hotel,
  Plane,
  Camera,
  BookOpen
} from 'lucide-react';

export default function DestinationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentDestination, isLoading, error } = useSelector((state: RootState) => state.destination);
  const { user } = useSelector((state: RootState) => state.auth);

  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const destinationId = params.id as string;

  useEffect(() => {
    if (destinationId) {
      dispatch(fetchDestination(destinationId));
    }
  }, [dispatch, destinationId]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">Loading destination...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !currentDestination) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Destination not found</h2>
            <p className="text-gray-600 mb-4">
              {error || 'The destination you&apos;re looking for doesn&apos;t exist.'}
            </p>
            <button
              onClick={() => router.push('/destinations')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Destinations
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleCreateItinerary = () => {
    router.push(`/itinerary/create?destination=${destinationId}`);
  };

  const handleBookHotel = () => {
    router.push(`/hotels?destination=${destinationId}`);
  };

  const handleBookFlight = () => {
    router.push(`/flights?destination=${destinationId}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Destinations
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                <div className="relative">
                  <img
                    src={currentDestination.images && currentDestination.images.length > 0 ? currentDestination.images[activeImage] : currentDestination.thumbnail}
                    alt={currentDestination.name}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/800x400?text=Destination+Image';
                    }}
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`p-2 rounded-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
                        } hover:bg-red-500 hover:text-white transition-colors`}
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Thumbnail Images */}
                {currentDestination.images && currentDestination.images.length > 1 && (
                  <div className="p-4 border-t">
                    <div className="flex space-x-2 overflow-x-auto">
                      {currentDestination.images.map((image: string, index: number) => (
                        <button
                          key={`${currentDestination.id}-thumb-${index}`}
                          onClick={() => setActiveImage(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${activeImage === index ? 'border-blue-500' : 'border-gray-200'
                            }`}
                        >
                          <img
                            src={image}
                            alt={`${currentDestination.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/80x80?text=Image';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Destination Info */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentDestination.name}</h1>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{currentDestination.city}, {currentDestination.country}</span>
                    </div>
                    {/* Static Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < 4
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold text-gray-700 ml-2">4.0</span>
                      <span className="text-sm text-gray-600 ml-1">(Excellent)</span>
                    </div>
                  </div>
                </div>

                {/* Location and Climate */}
                <div className="flex items-center space-x-6 mb-6">
                  {currentDestination.climate && (
                    <div className="flex items-center text-gray-700">
                      <Globe className="w-4 h-4 mr-1" />
                      <span>{currentDestination.climate}</span>
                    </div>
                  )}
                  {currentDestination.currency && (
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>{currentDestination.currency}</span>
                    </div>
                  )}
                  {currentDestination.language && (
                    <div className="flex items-center text-gray-700">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>{currentDestination.language}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">About this destination</h3>
                  <p className="text-gray-700 leading-relaxed">{currentDestination.description}</p>
                </div>

                {/* Attractions */}
                {currentDestination.attractions && currentDestination.attractions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Top Attractions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {currentDestination.attractions.map((attraction, index: number) => (
                        <div key={`${currentDestination.id}-attraction-${index}`} className="bg-white rounded-lg shadow-sm overflow-hidden">
                          {attraction.images && attraction.images.length > 0 && (
                            <div className="relative h-48">
                              <img
                                src={attraction.images[0]}
                                alt={attraction.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  target.src = 'https://via.placeholder.com/400x300?text=Attraction';
                                }}
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <h4 className="text-lg font-semibold mb-2 text-gray-900">{attraction.name}</h4>
                            <p className="text-gray-700 text-sm leading-relaxed">{attraction.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {currentDestination.tags && currentDestination.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentDestination.tags.map((tag: string, index: number) => (
                        <span
                          key={`${currentDestination.id}-tag-${index}`}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Travel Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Travel Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-gray-800">Essential Details</h4>
                    <div className="space-y-3">
                      {currentDestination.climate && (
                        <div className="flex items-center text-gray-700">
                          <Globe className="w-4 h-4 mr-2 text-blue-500" />
                          <span>Climate: {currentDestination.climate}</span>
                        </div>
                      )}
                      {currentDestination.bestTimeToVisit && (
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                          <span>Best Time: {currentDestination.bestTimeToVisit}</span>
                        </div>
                      )}
                      {currentDestination.currency && (
                        <div className="flex items-center text-gray-700">
                          <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
                          <span>Currency: {currentDestination.currency}</span>
                        </div>
                      )}
                      {currentDestination.language && (
                        <div className="flex items-center text-gray-700">
                          <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                          <span>Language: {currentDestination.language}</span>
                        </div>
                      )}
                      {currentDestination.timezone && (
                        <div className="flex items-center text-gray-700">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" />
                          <span>Timezone: {currentDestination.timezone}</span>
                        </div>
                      )}
                    </div>
                  </div>



                  <div>
                    <h4 className="font-medium mb-3 text-gray-800">Location</h4>
                    <div className="bg-gray-100 rounded-lg p-4 h-48 flex items-center justify-center">
                      <div className="text-center text-gray-600">
                        <MapPin className="w-8 h-8 mx-auto mb-2" />
                        <p>Map will be displayed here</p>
                        {currentDestination.coordinates && (
                          <p className="text-sm mt-1">
                            {currentDestination.coordinates.lat}, {currentDestination.coordinates.lng}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Admin View - Show all data */}
                {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') ? (
                  <>
                    {/* Destination Details */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold mb-4">Destination Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-700">ID:</span>
                          <span className="font-medium font-mono text-sm">{currentDestination.id || currentDestination._id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Status:</span>
                          <span className={`font-medium ${currentDestination.isActive ? 'text-green-600' : 'text-red-600'}`}>
                            {currentDestination.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Country:</span>
                          <span className="font-medium">{currentDestination.country}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">City:</span>
                          <span className="font-medium">{currentDestination.city}</span>
                        </div>
                        {currentDestination.climate && (
                          <div className="flex justify-between">
                            <span className="text-gray-700">Climate:</span>
                            <span className="font-medium">{currentDestination.climate}</span>
                          </div>
                        )}
                        {currentDestination.currency && (
                          <div className="flex justify-between">
                            <span className="text-gray-700">Currency:</span>
                            <span className="font-medium">{currentDestination.currency}</span>
                          </div>
                        )}
                        {currentDestination.language && (
                          <div className="flex justify-between">
                            <span className="text-gray-700">Language:</span>
                            <span className="font-medium">{currentDestination.language}</span>
                          </div>
                        )}
                        {currentDestination.timezone && (
                          <div className="flex justify-between">
                            <span className="text-gray-700">Timezone:</span>
                            <span className="font-medium">{currentDestination.timezone}</span>
                          </div>
                        )}
                        {currentDestination.bestTimeToVisit && (
                          <div className="flex justify-between">
                            <span className="text-gray-700">Best Time:</span>
                            <span className="font-medium">{currentDestination.bestTimeToVisit}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SEO Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold mb-4">SEO Information</h3>
                      <div className="space-y-3">
                        {currentDestination.seoTitle && (
                          <div>
                            <span className="text-gray-700 text-sm">SEO Title:</span>
                            <p className="font-medium text-sm mt-1">{currentDestination.seoTitle}</p>
                          </div>
                        )}
                        {currentDestination.seoDescription && (
                          <div>
                            <span className="text-gray-700 text-sm">SEO Description:</span>
                            <p className="font-medium text-sm mt-1">{currentDestination.seoDescription}</p>
                          </div>
                        )}
                        {currentDestination.seoKeywords && currentDestination.seoKeywords.length > 0 && (
                          <div>
                            <span className="text-gray-700 text-sm">SEO Keywords:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {currentDestination.seoKeywords.map((keyword: string, index: number) => (
                                <span key={`${currentDestination.id}-keyword-${index}`} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Coordinates */}
                    {currentDestination.coordinates && (
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Coordinates</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Latitude:</span>
                            <span className="font-medium font-mono">{currentDestination.coordinates.lat}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Longitude:</span>
                            <span className="font-medium font-mono">{currentDestination.coordinates.lng}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Admin Actions */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold mb-4">Admin Actions</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => router.push(`/admin/destinations/edit/${currentDestination.id || currentDestination._id}`)}
                          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Edit Destination
                        </button>
                        <button
                          onClick={() => router.push('/admin?tab=destinations')}
                          className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Admin
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* User View - Show booking options */}
                    {/* Booking Options */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Plan Your Trip</h3>
                      <div className="space-y-3">
                        <button
                          onClick={handleCreateItinerary}
                          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Create Itinerary
                        </button>
                        <button
                          onClick={handleBookHotel}
                          className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <Hotel className="w-4 h-4 mr-2" />
                          Book Hotel
                        </button>
                        <button
                          onClick={handleBookFlight}
                          className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                        >
                          <Plane className="w-4 h-4 mr-2" />
                          Book Flight
                        </button>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Info</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Country:</span>
                          <span className="font-medium text-gray-500">{currentDestination.country}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">City:</span>
                          <span className="font-medium text-gray-500">{currentDestination.city}</span>
                        </div>
                        {currentDestination.climate && (
                          <div className="flex justify-between">
                            <span className="text-gray-700">Climate:</span>
                            <span className="font-medium text-gray-500">{currentDestination.climate}</span>
                          </div>
                        )}
                        {currentDestination.currency && (
                          <div className="flex justify-between">
                            <span className="text-gray-700">Currency:</span>
                            <span className="font-medium text-gray-500">{currentDestination.currency}</span>
                          </div>
                        )}
                        {currentDestination.language && (
                          <div className="flex justify-between">
                            <span className="text-gray-700">Language:</span>
                            <span className="font-medium text-gray-500">{currentDestination.language}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Need Help?</h3>
                      <p className="text-gray-700 mb-4">
                        Our travel experts are here to help you plan the perfect trip.
                      </p>
                      <button className="w-full px-4 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-300 transition-colors">
                        Contact Us
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
