'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/store';
import { createHotel } from '@/store/slices/hotelSlice';
import { fetchDestinations } from '@/store/slices/destinationSlice';
import Layout from '@/components/Layout';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  MapPin, 
  Star, 
  DollarSign, 
  Users, 
  Bed,
  Phone,
  Mail,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface RoomType {
  name: string;
  description: string;
  price: number;
  capacity: number;
  available: number;
}

export default function CreateHotelPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isLoading } = useSelector((state: RootState) => state.hotel);
  const { destinations } = useSelector((state: RootState) => state.destination);
  const { user } = useSelector((state: RootState) => state.auth);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    destination: '',
    address: '',
    coordinates: {
      lat: 0,
      lng: 0
    },
    images: [''],
    thumbnail: '',
    rating: 0,
    priceRange: {
      min: 0,
      max: 0,
      currency: 'USD'
    },
    amenities: [''],
    roomTypes: [] as RoomType[],
    contactInfo: {
      phone: '',
      email: '',
      website: ''
    },
    policies: {
      checkIn: '2:00 PM',
      checkOut: '11:00 AM',
      cancellation: 'Free cancellation up to 24 hours before check-in'
    },
    isActive: true,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ['']
  });

  // Fetch destinations for dropdown
  useEffect(() => {
    dispatch(fetchDestinations({ page: 1, limit: 100, isActive: true }));
  }, [dispatch]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent: 'coordinates' | 'priceRange' | 'contactInfo' | 'policies', field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field: 'images' | 'amenities' | 'seoKeywords', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'images' | 'amenities' | 'seoKeywords') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'images' | 'amenities' | 'seoKeywords', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addRoomType = () => {
    const newRoomType: RoomType = {
      name: '',
      description: '',
      price: 0,
      capacity: 1,
      available: 1
    };
    setFormData(prev => ({
      ...prev,
      roomTypes: [...prev.roomTypes, newRoomType]
    }));
  };

  const removeRoomType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((_, i) => i !== index)
    }));
  };

  const handleRoomTypeChange = (index: number, field: keyof RoomType, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.map((room, i) => 
        i === index ? { ...room, [field]: value } : room
      )
    }));
  };

  const amenitiesOptions = [
    'Free WiFi', 'Free Parking', 'Restaurant', 'Swimming Pool', 'Fitness Center',
    'Spa & Wellness', 'Room Service', 'Concierge', 'Business Center', 'Laundry Service',
    'Air Conditioning', 'Mini Bar', 'Safe', 'Balcony', 'Ocean View', 'Mountain View',
    'Garden View', 'City View', 'Kitchen', 'Living Room', 'Dining Area', 'Terrace',
    'BBQ Facilities', 'Tennis Court', 'Golf Course', 'Beach Access', 'Ski Storage',
    'Bicycle Rental', 'Car Rental', 'Airport Shuttle', 'Tour Desk', 'Currency Exchange'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.destination) {
      alert('Please select a destination');
      return;
    }

    if (!user) {
      alert('User not authenticated');
      return;
    }

    setIsSubmitting(true);

    try {
      // Find the selected destination
      const selectedDestination = destinations.find(d => (d.id || d._id) === formData.destination);
      if (!selectedDestination) {
        alert('Selected destination not found');
        return;
      }

      const cleanedFormData = {
        ...formData,
        destination: {
          id: selectedDestination.id || selectedDestination._id || '',
          name: selectedDestination.name,
          city: selectedDestination.city,
          country: selectedDestination.country
        },
        images: formData.images.filter(img => img.trim() !== ''),
        amenities: formData.amenities.filter(amenity => amenity.trim() !== ''),
        seoKeywords: formData.seoKeywords.filter(keyword => keyword.trim() !== ''),
        partner: {
          id: user.id,
          name: user.name || user.email || 'Unknown'
        }
      };

      await dispatch(createHotel(cleanedFormData)).unwrap();
      alert('Hotel created successfully!');
      router.push('/admin?tab=hotels');
    } catch (error) {
      console.error('Failed to create hotel:', error);
      alert('Failed to create hotel. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Create New Hotel</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter hotel name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination *
                  </label>
                  <select
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a destination</option>
                    {destinations.map((destination) => (
                      <option key={destination.id || destination._id} value={destination.id || destination._id}>
                        {destination.name} - {destination.city}, {destination.country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the hotel..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.coordinates.lat}
                    onChange={(e) => handleNestedChange('coordinates', 'lat', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 48.8566"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.coordinates.lng}
                    onChange={(e) => handleNestedChange('coordinates', 'lng', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 2.3522"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Images</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.thumbnail}
                    onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Images
                  </label>
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => handleArrayChange('images', index, e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('images', index)}
                        className="px-3 py-3 text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('images')}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Image URL
                  </button>
                </div>
              </div>
            </div>

            {/* Rating and Pricing */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Rating & Pricing
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Price *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.priceRange.min}
                    onChange={(e) => handleNestedChange('priceRange', 'min', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Price *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.priceRange.max}
                    onChange={(e) => handleNestedChange('priceRange', 'max', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.priceRange.currency}
                    onChange={(e) => handleNestedChange('priceRange', 'currency', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Amenities
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {amenitiesOptions.map((amenity) => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            amenities: [...prev.amenities, amenity]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            amenities: prev.amenities.filter(a => a !== amenity)
                          }));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Room Types */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Bed className="w-5 h-5 mr-2" />
                  Room Types
                </h2>
                <button
                  type="button"
                  onClick={addRoomType}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Room Type
                </button>
              </div>
              
              {formData.roomTypes.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No room types added yet. Click &quot;Add Room Type&quot; to get started.</p>
              ) : (
                <div className="space-y-4">
                  {formData.roomTypes.map((room, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Room Type {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeRoomType(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Room Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={room.name}
                            onChange={(e) => handleRoomTypeChange(index, 'name', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Deluxe Room"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price per Night *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={room.price}
                            onChange={(e) => handleRoomTypeChange(index, 'price', parseInt(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Capacity (Guests) *
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={room.capacity}
                            onChange={(e) => handleRoomTypeChange(index, 'capacity', parseInt(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="1"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Available Rooms *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={room.available}
                            onChange={(e) => handleRoomTypeChange(index, 'available', parseInt(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="1"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={room.description}
                            onChange={(e) => handleRoomTypeChange(index, 'description', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Describe this room type..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleNestedChange('contactInfo', 'phone', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactInfo.email}
                    onChange={(e) => handleNestedChange('contactInfo', 'email', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="hotel@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.contactInfo.website}
                    onChange={(e) => handleNestedChange('contactInfo', 'website', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://hotel-website.com"
                  />
                </div>
              </div>
            </div>

            {/* Hotel Policies */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Hotel Policies
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Time
                  </label>
                  <input
                    type="text"
                    value={formData.policies.checkIn}
                    onChange={(e) => handleNestedChange('policies', 'checkIn', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2:00 PM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Time
                  </label>
                  <input
                    type="text"
                    value={formData.policies.checkOut}
                    onChange={(e) => handleNestedChange('policies', 'checkOut', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="11:00 AM"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Policy
                  </label>
                  <textarea
                    rows={3}
                    value={formData.policies.cancellation}
                    onChange={(e) => handleNestedChange('policies', 'cancellation', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the cancellation policy..."
                  />
                </div>
              </div>
            </div>

            {/* SEO Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                SEO Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Hotel Name - Location | Travel Site"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.seoDescription}
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description for search engines..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Keywords
                  </label>
                  {formData.seoKeywords.map((keyword, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => handleArrayChange('seoKeywords', index, e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="keyword"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('seoKeywords', index)}
                        className="px-3 py-3 text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('seoKeywords')}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Keyword
                  </button>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Status</h2>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Active (visible to users)</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Hotel'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
