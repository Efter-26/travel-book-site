'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { createDestination } from '@/store/slices/destinationSlice';
import Layout from '@/components/Layout';
import Toast from '@/components/Toast';
import { generateSlug } from '@/utils/slug';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus,
  MapPin,
  Globe,
  Calendar,
  DollarSign,
  Users,
  Camera,
  Tag
} from 'lucide-react';

export default function CreateDestinationPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.destination);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    thumbnail: '',
    country: '',
    city: '',
    climate: '',
    bestTimeToVisit: '',
    currency: '',
    language: '',
    timezone: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    slug: '',
    isActive: true,
  });

  const [images, setImages] = useState<string[]>(['']);
  const [attractions, setAttractions] = useState<{ name: string; description: string; images: string[] }[]>([
    { name: '', description: '', images: [''] }
  ]);
  const [tags, setTags] = useState<string[]>(['']);
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });

  const countries = [
    'France', 'Japan', 'Indonesia', 'USA', 'UK', 'Italy', 'Spain', 'Thailand', 'Australia'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      };
      
      // Auto-generate slug when name changes
      if (name === 'name' && value) {
        newData.slug = generateSlug(value);
      }
      
      return newData;
    });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImage = () => {
    setImages([...images, '']);
  };

  const removeImage = (index: number) => {
    if (images.length > 1) {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
    }
  };

  const handleAttractionChange = (index: number, field: 'name' | 'description', value: string) => {
    const newAttractions = [...attractions];
    newAttractions[index] = { ...newAttractions[index], [field]: value };
    setAttractions(newAttractions);
  };

  const handleAttractionImageChange = (attractionIndex: number, imageIndex: number, value: string) => {
    const newAttractions = [...attractions];
    newAttractions[attractionIndex].images[imageIndex] = value;
    setAttractions(newAttractions);
  };

  const addAttractionImage = (attractionIndex: number) => {
    const newAttractions = [...attractions];
    newAttractions[attractionIndex].images.push('');
    setAttractions(newAttractions);
  };

  const removeAttractionImage = (attractionIndex: number, imageIndex: number) => {
    const newAttractions = [...attractions];
    if (newAttractions[attractionIndex].images.length > 1) {
      newAttractions[attractionIndex].images.splice(imageIndex, 1);
      setAttractions(newAttractions);
    }
  };

  const addAttraction = () => {
    setAttractions([...attractions, { name: '', description: '', images: [''] }]);
  };

  const removeAttraction = (index: number) => {
    if (attractions.length > 1) {
      const newAttractions = attractions.filter((_, i) => i !== index);
      setAttractions(newAttractions);
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const addTag = () => {
    setTags([...tags, '']);
  };

  const removeTag = (index: number) => {
    if (tags.length > 1) {
      const newTags = tags.filter((_, i) => i !== index);
      setTags(newTags);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.country || !formData.city) {
      setToast({ message: 'Please fill in all required fields (Name, Country, and City)', type: 'error' });
      return;
    }

    // Prepare destination data
    const destinationData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      images: images.filter(img => img.trim() !== ''),
      thumbnail: formData.thumbnail.trim() || (images[0] ? images[0].trim() : ''),
      country: formData.country,
      city: formData.city.trim(),
      coordinates: {
        lat: parseFloat(coordinates.lat) || 0,
        lng: parseFloat(coordinates.lng) || 0,
      },
      climate: formData.climate.trim(),
      bestTimeToVisit: formData.bestTimeToVisit.trim(),
      currency: formData.currency.trim(),
      language: formData.language.trim(),
      timezone: formData.timezone.trim(),
      attractions: attractions.filter(attr => attr.name.trim() !== '' || attr.description.trim() !== ''),
      tags: tags.filter(tag => tag.trim() !== ''),
      isActive: formData.isActive,
      seoTitle: formData.seoTitle.trim() || formData.name.trim(),
      seoDescription: formData.seoDescription.trim() || formData.description.trim(),
      seoKeywords: formData.seoKeywords.trim() ? formData.seoKeywords.split(',').map(k => k.trim()).filter(k => k !== '') : [],
    };

    console.log('Submitting destination data:', destinationData);

    setIsSubmitting(true);
    
    try {
      const result = await dispatch(createDestination(destinationData)).unwrap();
      console.log('Destination created successfully:', result);
      
      // Show success message
      setToast({ message: 'Destination created successfully!', type: 'success' });
      
      // Redirect to admin dashboard after a short delay
      setTimeout(() => {
        router.push('/admin?tab=destinations');
      }, 1500);
    } catch (error) {
      console.error('Failed to create destination:', error);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to create destination. Please try again.';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => router.back()}
                  className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Create New Destination</h1>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="destination-form"
                  disabled={isLoading || isSubmitting}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading || isSubmitting ? 'Creating...' : 'Create Destination'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form id="destination-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Paris, Tokyo, Bali"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Paris, Tokyo, Denpasar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="auto-generated from name"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be used in the URL: /destinations/{formData.slug || 'your-slug'}
                  </p>
                </div>



                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the destination..."
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Images</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Images
                  </label>
                  {images.map((image, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImage}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Image
                  </button>
                </div>
              </div>
            </div>

            {/* Travel Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Travel Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Climate
                  </label>
                  <input
                    type="text"
                    name="climate"
                    value={formData.climate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Tropical, Mediterranean"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Best Time to Visit
                  </label>
                  <input
                    type="text"
                    name="bestTimeToVisit"
                    value={formData.bestTimeToVisit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., March to May, September to November"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., USD, EUR, JPY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., English, French, Japanese"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <input
                    type="text"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., UTC+1, UTC+9"
                  />
                </div>
              </div>
            </div>

            {/* Attractions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Attractions</h2>
              {attractions.map((attraction, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Attraction Name
                      </label>
                      <input
                        type="text"
                        value={attraction.name}
                        onChange={(e) => handleAttractionChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Eiffel Tower"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={attraction.description}
                        onChange={(e) => handleAttractionChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief description of the attraction"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Images
                    </label>
                    {attraction.images.map((image, imageIndex) => (
                      <div key={imageIndex} className="flex items-center space-x-2 mb-2">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => handleAttractionImageChange(index, imageIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://example.com/attraction-image.jpg"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttractionImage(index, imageIndex)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addAttractionImage(index)}
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Image
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => removeAttraction(index)}
                      className="flex items-center text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove Attraction
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addAttraction}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Attraction
              </button>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Tags</h2>
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., romantic, family-friendly, adventure"
                  />
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Tag
              </button>
            </div>

            {/* SEO Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">SEO Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="SEO optimized title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="SEO meta description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="travel, vacation, tourism, adventure"
                  />
                </div>
              </div>
            </div>

            {/* Coordinates */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Location Coordinates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    value={coordinates.lat}
                    onChange={(e) => setCoordinates(prev => ({ ...prev, lat: e.target.value }))}
                    step="any"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="48.8566"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    value={coordinates.lng}
                    onChange={(e) => setCoordinates(prev => ({ ...prev, lng: e.target.value }))}
                    step="any"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2.3522"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Active Destination
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
