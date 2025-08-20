'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchHotel } from '@/store/slices/hotelSlice';
import { addToCart } from '@/store/slices/cartSlice';
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
  Bed,
  Phone,
  Mail,
  Wifi,
  Car,
  Utensils,
  Award,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentHotel, isLoading, error } = useSelector((state: RootState) => state.hotel);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [selectedGuests, setSelectedGuests] = useState(1);
  const [selectedCheckIn, setSelectedCheckIn] = useState('');
  const [selectedCheckOut, setSelectedCheckOut] = useState('');

  const hotelId = params.id as string;
  console.log('Fetching hotel with ID:', hotelId);

  const handleTestFetch = () => {
    console.log('Manual test fetch triggered');
    dispatch(fetchHotel(hotelId));
  };

  const handleAddToCart = () => {
    if (!currentHotel) return;
    
    if (!selectedRoomType) {
      toast.error('Please select a room type first');
      return;
    }
    if (!selectedCheckIn || !selectedCheckOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    const hotelId = currentHotel.id || currentHotel._id;
    if (!hotelId) {
      toast.error('Hotel ID not found');
      return;
    }

    const cartItem = {
      id: hotelId,
      type: 'hotel' as const,
      title: currentHotel.name,
      image: currentHotel.images?.[0] || currentHotel.thumbnail,
      location: `${currentHotel.destination?.city}, ${currentHotel.destination?.country}`,
      price: currentHotel.priceRange.min,
      currency: currentHotel.priceRange.currency,
      quantity: 1,
      checkIn: selectedCheckIn,
      checkOut: selectedCheckOut,
      guests: selectedGuests,
      roomType: selectedRoomType,
    };

    dispatch(addToCart(cartItem));
    toast.success('Hotel added to cart successfully!');
  };

  useEffect(() => {
    if (hotelId) {
      console.log('Fetching hotel with ID:', hotelId);
      dispatch(fetchHotel(hotelId));
    }
  }, [dispatch, hotelId]);

  // Debug logging
  useEffect(() => {
    console.log('Hotel detail page state:', {
      hotelId,
      currentHotel,
      isLoading,
      error
    });
  }, [hotelId, currentHotel, isLoading, error]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">Loading hotel...</h2>
          </div>
        </div>
      </Layout> 
    );
  }

  if (error || !currentHotel) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Bed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hotel not found</h2>
            <p className="text-gray-700 mb-4 font-medium">
              {error || 'The hotel you&apos;re looking for doesn&apos;t exist.'}
            </p>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 text-left">
                <h3 className="text-sm font-semibold text-red-800 mb-2">Error Details:</h3>
                <p className="text-sm text-red-700 font-medium">{error}</p>
                <p className="text-xs text-red-600 mt-2 font-medium">Hotel ID: {hotelId}</p>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-2">Debug Info:</h4>
                  <p className="text-xs text-yellow-700 font-medium">API URL: {`http://localhost:4000/hotels/${hotelId}`}</p>
                  <p className="text-xs text-yellow-700 font-medium">Loading: {isLoading ? 'Yes' : 'No'}</p>
                  <p className="text-xs text-yellow-700 font-medium">Current Hotel: {currentHotel ? 'Yes' : 'No'}</p>
                </div>
              </div>
            )}
            <div className="space-x-4">
              <button
                onClick={() => router.push('/hotels')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Back to Hotels
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium"
              >
                Retry
              </button>
              <button
                onClick={handleTestFetch}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                Test Fetch
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const handleBookRoom = () => {
    if (selectedRoomType) {
      router.push(`/bookings/create?hotel=${hotelId}&roomType=${selectedRoomType}`);
    } else {
      toast.error('Please select a room type first');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hotels
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
                    src={currentHotel.images && currentHotel.images.length > 0 ? currentHotel.images[activeImage] : currentHotel.thumbnail}
                    alt={currentHotel.name}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/800x400?text=Hotel+Image';
                    }}
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Thumbnail Images */}
                {currentHotel.images && currentHotel.images.length > 1 && (
                  <div className="p-4 border-t">
                    <div className="flex space-x-2 overflow-x-auto">
                      {currentHotel.images.map((image: string, index: number) => (
                        <button
                          key={`${currentHotel.id}-thumb-${index}`}
                          onClick={() => setActiveImage(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                            activeImage === index ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${currentHotel.name} ${index + 1}`}
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

              {/* Hotel Info */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentHotel.name}</h1>
                    <div className="flex items-center text-gray-700 mb-4 font-medium">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{currentHotel.address}</span>
                    </div>
                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < currentHotel.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold text-gray-800 ml-2">{currentHotel.rating}.0</span>
                      <span className="text-sm text-gray-600 ml-1 font-medium">(Excellent)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">
                      ${currentHotel.priceRange.min}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">per night</div>
                    <div className="text-xs text-gray-600 mt-1 font-medium">Starting from</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">About this hotel</h3>
                  <p className="text-gray-800 leading-relaxed font-medium">{currentHotel.description}</p>
                </div>

                {/* Amenities */}
                {currentHotel.amenities && currentHotel.amenities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {currentHotel.amenities.map((amenity: string, index: number) => (
                        <div key={`${currentHotel.id}-amenity-${index}`} className="flex items-center text-gray-800 font-medium">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Room Types */}
              {currentHotel.roomTypes && currentHotel.roomTypes.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Room Types</h3>
                  <div className="space-y-4">
                    {currentHotel.roomTypes.map((roomType, index) => (
                      <div 
                        key={`${currentHotel.id}-room-${index}`}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedRoomType === roomType.name
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedRoomType(roomType.name)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{roomType.name}</h4>
                            <p className="text-sm text-gray-700 mt-1 font-medium">{roomType.description}</p>
                            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600 font-medium">
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {roomType.capacity} guests
                              </span>
                              <span className="flex items-center">
                                <Bed className="w-4 h-4 mr-1" />
                                {roomType.available} available
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">${roomType.price}</div>
                            <div className="text-sm text-gray-600 font-medium">per night</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hotel Policies */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Hotel Policies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">Check-in & Check-out</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-800 font-medium">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        <span>Check-in: {currentHotel.policies.checkIn}</span>
                      </div>
                      <div className="flex items-center text-gray-800 font-medium">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        <span>Check-out: {currentHotel.policies.checkOut}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">Cancellation Policy</h4>
                    <div className="flex items-start text-gray-800 font-medium">
                      <Info className="w-4 h-4 mr-2 text-blue-500 mt-0.5" />
                      <span>{currentHotel.policies.cancellation}</span>
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
                    {/* Hotel Details */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Hotel Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">ID:</span>
                          <span className="font-semibold font-mono text-sm text-gray-900">{currentHotel.id || currentHotel._id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">Status:</span>
                          <span className={`font-semibold ${currentHotel.isActive ? 'text-green-600' : 'text-red-600'}`}>
                            {currentHotel.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">Destination:</span>
                          <span className="font-semibold text-gray-900">{currentHotel.destination?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">Rating:</span>
                          <span className="font-semibold text-gray-900">{currentHotel.rating}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">Price Range:</span>
                          <span className="font-semibold text-gray-900">${currentHotel.priceRange.min} - ${currentHotel.priceRange.max}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">Currency:</span>
                          <span className="font-semibold text-gray-900">{currentHotel.priceRange.currency}</span>
                        </div>
                      </div>
                    </div>

                    {/* SEO Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">SEO Information</h3>
                      <div className="space-y-3">
                        {currentHotel.seoTitle && (
                          <div>
                            <span className="text-gray-700 text-sm font-medium">SEO Title:</span>
                            <p className="font-semibold text-sm mt-1 text-gray-900">{currentHotel.seoTitle}</p>
                          </div>
                        )}
                        {currentHotel.seoDescription && (
                          <div>
                            <span className="text-gray-700 text-sm font-medium">SEO Description:</span>
                            <p className="font-semibold text-sm mt-1 text-gray-900">{currentHotel.seoDescription}</p>
                          </div>
                        )}
                        {currentHotel.seoKeywords && currentHotel.seoKeywords.length > 0 && (
                          <div>
                            <span className="text-gray-700 text-sm font-medium">SEO Keywords:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {currentHotel.seoKeywords.map((keyword: string, index: number) => (
                                <span key={`${currentHotel.id}-keyword-${index}`} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded font-medium">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Coordinates */}
                    {currentHotel.coordinates && (
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Coordinates</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-700 font-medium">Latitude:</span>
                            <span className="font-semibold font-mono text-gray-900">{currentHotel.coordinates.lat}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700 font-medium">Longitude:</span>
                            <span className="font-semibold font-mono text-gray-900">{currentHotel.coordinates.lng}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Admin Actions */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Admin Actions</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => router.push(`/admin/hotels/edit/${currentHotel.id || currentHotel._id}`)}
                          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                        >
                          <Award className="w-4 h-4 mr-2" />
                          Edit Hotel
                        </button>
                        <button
                          onClick={() => router.push('/admin?tab=hotels')}
                          className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
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
                    {/* Contact Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact Information</h3>
                      <div className="space-y-3">
                        {currentHotel.contactInfo?.phone && (
                          <div className="flex items-center text-gray-800 font-medium">
                            <Phone className="w-4 h-4 mr-2 text-blue-500" />
                            <span>{currentHotel.contactInfo.phone}</span>
                          </div>
                        )}
                        {currentHotel.contactInfo?.email && (
                          <div className="flex items-center text-gray-800 font-medium">
                            <Mail className="w-4 h-4 mr-2 text-blue-500" />
                            <span>{currentHotel.contactInfo.email}</span>
                          </div>
                        )}
                        {currentHotel.contactInfo?.website && (
                          <div className="flex items-center text-gray-800 font-medium">
                            <Globe className="w-4 h-4 mr-2 text-blue-500" />
                            <a 
                              href={currentHotel.contactInfo.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Info</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">Destination:</span>
                          <span className="font-semibold text-gray-900">{currentHotel.destination?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">Rating:</span>
                          <span className="font-semibold text-gray-900">{currentHotel.rating}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">Price Range:</span>
                          <span className="font-semibold text-gray-900">${currentHotel.priceRange.min} - ${currentHotel.priceRange.max}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">Room Types:</span>
                          <span className="font-semibold text-gray-900">{currentHotel.roomTypes?.length || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Book Now */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Book Your Stay</h3>
                      <div className="space-y-4">
                        {/* Check-in Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                          <input
                            type="date"
                            value={selectedCheckIn}
                            onChange={(e) => setSelectedCheckIn(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                            required
                          />
                        </div>

                        {/* Check-out Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                          <input
                            type="date"
                            value={selectedCheckOut}
                            onChange={(e) => setSelectedCheckOut(e.target.value)}
                            min={selectedCheckIn || new Date().toISOString().split('T')[0]}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                            required
                          />
                        </div>

                        {/* Number of Guests */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                          <select
                            value={selectedGuests}
                            onChange={(e) => setSelectedGuests(parseInt(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                          >
                            {[1, 2, 3, 4, 5, 6].map(num => (
                              <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={handleAddToCart}
                          disabled={!selectedRoomType || !selectedCheckIn || !selectedCheckOut}
                          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                          <Bed className="w-4 h-4 mr-2" />
                          {selectedRoomType && selectedCheckIn && selectedCheckOut ? 'Add to Cart' : 'Select Room Type & Dates'}
                        </button>
                        <p className="text-xs text-gray-600 text-center font-medium">
                          {selectedRoomType && selectedCheckIn && selectedCheckOut 
                            ? 'Click to add to cart' 
                            : 'Please select a room type and dates above'
                          }
                        </p>
                      </div>
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
