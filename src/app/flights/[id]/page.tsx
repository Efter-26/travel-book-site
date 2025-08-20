'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchFlight } from '@/store/slices/flightSlice';
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
  Plane,
  Camera,
  BookOpen,
  CheckCircle,
  X,
  Plus,
  Minus
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function FlightDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentFlight, isLoading, error } = useSelector((state: RootState) => state.flight);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [selectedClass, setSelectedClass] = useState<'economy' | 'business' | 'first'>('economy');
  const [passengers, setPassengers] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const flightId = params.id as string;
console.log({currentFlight});
  useEffect(() => {
    if (flightId) {
      dispatch(fetchFlight(flightId));
    }
  }, [dispatch, flightId]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">Loading flight details...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !currentFlight) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Flight not found</h2>
            <p className="text-gray-600 mb-4">
              {error || 'The flight you\'re looking for doesn\'t exist.'}
            </p>
            <button
              onClick={() => router.push('/flights')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Flights
            </button>
          </div>
        </div>
      </Layout>
    );
  }

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

  const formatDate = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSelectedClassPrice = () => {
    return currentFlight?.price?.[selectedClass] || 0;
  };

  const getSelectedClassAvailability = () => {
    return currentFlight?.availableSeats?.[selectedClass] || 0;
  };

  const totalPrice = getSelectedClassPrice() * passengers;

  const handleBookFlight = () => {
    if (!user) {
      toast.error('Please log in to book a flight');
      return;
    }
    
    if (getSelectedClassAvailability() < passengers) {
      toast.error(`Only ${getSelectedClassAvailability()} seats available in ${selectedClass} class`);
      return;
    }

    const flightId = currentFlight.id || currentFlight._id;
    if (!flightId) {
      toast.error('Flight ID not found');
      return;
    }

    const cartItem = {
      id: flightId,
      type: 'flight' as const,
      title: `${currentFlight.airline?.name} - ${currentFlight.flightNumber}`,
      image: currentFlight.airline?.logo || 'https://via.placeholder.com/64x64?text=Flight',
      location: `${currentFlight.departure.airport.city} → ${currentFlight.arrival.airport.city}`,
      price: getSelectedClassPrice(),
      currency: 'USD',
      quantity: passengers,
      departure: currentFlight.departure.airport.code,
      arrival: currentFlight.arrival.airport.code,
      departureTime: currentFlight.departure.time,
      arrivalTime: currentFlight.arrival.time,
      passengers: passengers,
      class: selectedClass,
    };

    dispatch(addToCart(cartItem));
    toast.success(`Flight added to cart! ${passengers} ${selectedClass} class seat(s) - Total: $${totalPrice}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-800 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Flights
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Flight Header */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {currentFlight.airline?.logo && (
                      <img
                        src={currentFlight.airline.logo}
                        alt={currentFlight.airline.name}
                        className="w-12 h-12 mr-4"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{currentFlight.airline?.name}</h1>
                      <p className="text-gray-800 font-medium">Flight {currentFlight.flightNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-full transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Flight Route */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTime(currentFlight.departure.time)}
                    </div>
                    <div className="text-lg text-gray-800 font-semibold">{currentFlight.departure.airport.code}</div>
                    <div className="text-sm text-gray-700 font-medium">{currentFlight.departure.airport.city}</div>
                    <div className="text-xs text-gray-700 mt-1 font-medium">
                      {formatDate(currentFlight.departure.time)}
                    </div>
                    {currentFlight.departure.terminal && (
                      <div className="text-xs text-blue-700 mt-1 font-semibold">
                        Terminal {currentFlight.departure.terminal}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 mx-8">
                    <div className="flex items-center justify-center mb-2">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <Plane className="w-6 h-6 mx-4 text-blue-500 transform rotate-90" />
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatDuration(currentFlight.duration)}
                      </div>
                      <div className="text-xs text-gray-700 font-medium">
                        {currentFlight.stops === 0 ? 'Direct Flight' : `${currentFlight.stops} stop${currentFlight.stops === 1 ? '' : 's'}`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTime(currentFlight.arrival.time)}
                    </div>
                    <div className="text-lg text-gray-800 font-semibold">{currentFlight.arrival.airport.code}</div>
                    <div className="text-sm text-gray-700 font-medium">{currentFlight.arrival.airport.city}</div>
                    <div className="text-xs text-gray-700 mt-1 font-medium">
                      {formatDate(currentFlight.arrival.time)}
                    </div>
                    {currentFlight.arrival.terminal && (
                      <div className="text-xs text-blue-700 mt-1 font-semibold">
                        Terminal {currentFlight.arrival.terminal}
                      </div>
                    )}
                  </div>
                </div>

                {/* Flight Status */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    currentFlight.isActive 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {currentFlight.isActive ? 'Available for Booking' : 'Not Available'}
                  </span>
                  <div className="text-sm text-gray-800 font-semibold">
                    Distance: {currentFlight?.distance || 0} km
                  </div>
                </div>
              </div>

              {/* Flight Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Flight Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900">Aircraft Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-800 font-medium">Aircraft Type:</span>
                        <span className="font-semibold text-gray-900">{currentFlight?.aircraft?.type || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-800 font-medium">Model:</span>
                        <span className="font-semibold text-gray-900">{currentFlight?.aircraft?.model || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-800 font-medium">Capacity:</span>
                        <span className="font-semibold text-gray-900">{currentFlight?.aircraft?.capacity || 0} seats</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900">Baggage Allowance</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-800 font-medium">Carry-on:</span>
                        <span className="font-semibold text-gray-900">{currentFlight?.baggage?.carryOn?.weight || 0}kg ({currentFlight?.baggage?.carryOn?.dimensions || 'N/A'})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-800 font-medium">Checked:</span>
                        <span className="font-semibold text-gray-900">{currentFlight?.baggage?.checked?.weight || 0}kg ({currentFlight?.baggage?.checked?.dimensions || 'N/A'})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layovers */}
              {currentFlight.layovers && currentFlight.layovers.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900">Layovers</h2>
                  <div className="space-y-3">
                    {currentFlight.layovers.map((layover, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-600 mr-2" />
                          <span className="font-semibold text-gray-900">{layover.airport}</span>
                        </div>
                        <div className="text-sm text-gray-800 font-semibold">
                          {formatDuration(layover.duration)} layover
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {currentFlight.amenities && currentFlight.amenities.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900">In-Flight Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {currentFlight.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-gray-800 font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Policies */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Policies</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900">Cancellation Policy</h3>
                    <p className="text-sm text-gray-800 font-medium">{currentFlight?.cancellationPolicy || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900">Refund Policy</h3>
                    <p className="text-sm text-gray-800 font-medium">{currentFlight?.refundPolicy || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Booking Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Book This Flight</h3>
                  
                  {/* Class Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Select Class</label>
                    <div className="space-y-2">
                      {(['economy', 'business', 'first'] as const).map((classType) => (
                        <label key={classType} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedClass === classType 
                            ? 'border-blue-500 bg-blue-50 text-gray-900' 
                            : 'border-gray-300 hover:bg-gray-50 text-gray-800'
                        }`}>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="class"
                              value={classType}
                              checked={selectedClass === classType}
                              onChange={() => setSelectedClass(classType)}
                              className="mr-3"
                            />
                            <div>
                              <div className="font-semibold capitalize text-gray-900">{classType} (per seat)</div>
                              <div className="text-sm text-gray-700 font-medium">
                                {currentFlight?.availableSeats?.[classType] || 0} seats available
                              </div>
                            </div>
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            ${currentFlight?.price?.[classType] || 0}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Passengers */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Number of Passengers</label>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                      <button
                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"
                        disabled={passengers <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold text-gray-900">{passengers}</span>
                      <button
                        onClick={() => setPassengers(Math.min(9, passengers + 1))}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"
                        disabled={passengers >= 9 || passengers >= getSelectedClassAvailability()}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {passengers > getSelectedClassAvailability() && (
                      <p className="text-sm text-red-700 mt-1 font-semibold">
                        Only {getSelectedClassAvailability()} seats available in {selectedClass} class
                      </p>
                    )}
                  </div>

                  {/* Price Summary */}
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-800 font-semibold">Price per passenger:</span>
                      <span className="font-bold text-gray-900">${getSelectedClassPrice()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-800 font-semibold">Passengers:</span>
                      <span className="font-bold text-gray-900">{passengers}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-blue-600">${totalPrice}</span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={handleBookFlight}
                    disabled={!currentFlight.isActive || getSelectedClassAvailability() === 0 || passengers > getSelectedClassAvailability()}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {!currentFlight.isActive 
                      ? 'Flight Not Available' 
                      : getSelectedClassAvailability() === 0 
                        ? 'No Seats Available' 
                        : passengers > getSelectedClassAvailability()
                          ? 'Not Enough Seats'
                          : `Add to Cart`
                    }
                  </button>

                  {getSelectedClassAvailability() > 0 && getSelectedClassAvailability() <= 5 && (
                    <p className="text-sm text-orange-700 mt-2 text-center font-semibold">
                      Only {getSelectedClassAvailability()} seats left!
                    </p>
                  )}
                </div>

                {/* Admin View */}
                {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Flight Details (Admin)</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-800 font-semibold">Flight ID:</span>
                        <span className="font-semibold font-mono text-sm text-gray-900">{currentFlight.id || currentFlight._id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-800 font-semibold">Status:</span>
                        <span className={`font-semibold ${currentFlight.isActive ? 'text-green-700' : 'text-red-700'}`}>
                          {currentFlight.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-800 font-semibold">Partner:</span>
                        <span className="font-semibold text-gray-900">{currentFlight.partner?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-800 font-semibold">Created:</span>
                        <span className="font-semibold text-sm text-gray-900">
                          {currentFlight.createdAt ? new Date(currentFlight.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
