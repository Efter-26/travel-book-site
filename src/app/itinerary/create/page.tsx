'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '@/store';
import { createItinerary } from '@/store/slices/itinerarySlice';
import { fetchDestinations, fetchDestination } from '@/store/slices/destinationSlice';
import Layout from '@/components/Layout';
import { ArrowLeft, Calendar, MapPin, Clock, Save, Plus, Edit, Trash2, Plane, Hotel, Camera, DollarSign } from 'lucide-react';

interface Activity {
  type: 'activity' | 'transport' | 'accommodation';
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  cost: number;
}

interface Day {
  dayNumber: number;
  title: string;
  activities: Activity[];
}

 function CreateItineraryContent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destinationId: '',
    startDate: '',
    endDate: '',
    isPublic: false
  });

  const [days, setDays] = useState<Day[]>([]);
  const [showAddDay, setShowAddDay] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState<number | null>(null);
  const [newDayTitle, setNewDayTitle] = useState('');
  const [activityForm, setActivityForm] = useState<Activity>({
    type: 'activity',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    cost: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showAddDay || showAddActivity !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddDay, showAddActivity]);
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { destinations, currentDestination, isLoading: destinationsLoading } = useSelector((state: RootState) => state.destination);

  const destinationFromUrl = searchParams.get('destination');
  
  // Debug: Log the URL parameter
  console.log('URL destination parameter:', destinationFromUrl);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to create an itinerary');
      router.push('/login');
      return;
    }

    // If destination ID is provided in URL, fetch that specific destination
    if (destinationFromUrl) {
      console.log('Fetching destination details for ID:', destinationFromUrl);
      dispatch(fetchDestination(destinationFromUrl));
      setFormData(prev => ({ ...prev, destinationId: destinationFromUrl }));
    } else {
      // Otherwise, fetch all destinations for the dropdown
      dispatch(fetchDestinations({ page: 1, limit: 100 }));
    }
  }, [dispatch, user, router, destinationFromUrl]);

  // Debug effect to monitor destination loading and selection
  useEffect(() => {
    console.log('Destinations updated:', destinations.length);
    console.log('Current form destination ID:', formData.destinationId);
    if (formData.destinationId) {
      const found = destinations.find(dest => {
        const destId = dest.id || dest._id;
        return destId === formData.destinationId;
      });
      console.log('Found destination in list:', found);
    }
  }, [destinations, formData.destinationId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddDay = () => {
    if (!newDayTitle.trim()) return;
    
    const dayNumber = days.length + 1;
    const newDay: Day = {
      dayNumber,
      title: newDayTitle.trim(),
      activities: []
    };
    
    setDays(prev => [...prev, newDay]);
    setNewDayTitle('');
    setShowAddDay(false);
    toast.success('Day added successfully!');
  };

  const handleDeleteDay = (dayIndex: number) => {
    if (!window.confirm('Are you sure you want to delete this day?')) return;
    
    setDays(prev => prev.filter((_, index) => index !== dayIndex));
    toast.success('Day deleted successfully!');
  };

  const handleAddActivity = (dayIndex: number) => {
    if (!activityForm.title.trim() || !activityForm.description.trim() || !activityForm.location.trim()) {
      toast.error('Please fill in all required fields (title, description, location)');
      return;
    }

    // If start time is provided but end time is not, set a default end time
    if (activityForm.startTime && !activityForm.endTime) {
      const startTime = new Date(`1970-01-01T${activityForm.startTime}:00`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Add 1 hour
      activityForm.endTime = endTime.toTimeString().slice(0, 5);
    }
    // If end time is provided but start time is not, set a default start time
    if (activityForm.endTime && !activityForm.startTime) {
      const endTime = new Date(`1970-01-01T${activityForm.endTime}:00`);
      const startTime = new Date(endTime.getTime() - 60 * 60 * 1000); // Subtract 1 hour
      activityForm.startTime = startTime.toTimeString().slice(0, 5);
    }
    
    const newActivity: Activity = { ...activityForm };
    
    setDays(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { ...day, activities: [...day.activities, newActivity] }
        : day
    ));
    
    setActivityForm({
      type: 'activity',
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      cost: 0
    });
    setShowAddActivity(null);
    toast.success('Activity added successfully!');
  };

  const handleDeleteActivity = (dayIndex: number, activityIndex: number) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    
    setDays(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { ...day, activities: day.activities.filter((_, aIndex) => aIndex !== activityIndex) }
        : day
    ));
    toast.success('Activity deleted successfully!');
  };

  // Drag and drop functionality
  const [draggedItem, setDraggedItem] = useState<{ dayIndex: number; activityIndex: number } | null>(null);
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, dayIndex: number, activityIndex: number) => {
    setDraggedItem({ dayIndex, activityIndex });
    e.dataTransfer.setData('text/plain', `${dayIndex}-${activityIndex}`);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDayDragOver = (e: React.DragEvent, dayIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDay(dayIndex);
  };

  const handleDayDragLeave = () => {
    setDragOverDay(null);
  };

  const handleDayDrop = (e: React.DragEvent, targetDayIndex: number) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    const { dayIndex: sourceDayIndex, activityIndex: sourceActivityIndex } = draggedItem;
    
    // Don't do anything if dropping on the same day
    if (sourceDayIndex === targetDayIndex) {
      setDraggedItem(null);
      setDragOverDay(null);
      return;
    }
    
    setDays(prev => {
      const newDays = [...prev];
      
      // Get the activity being moved
      const sourceDay = newDays[sourceDayIndex];
      if (!sourceDay || !sourceDay.activities[sourceActivityIndex]) return prev;
      
      const activityToMove = sourceDay.activities[sourceActivityIndex];
      
      // Remove from source
      sourceDay.activities.splice(sourceActivityIndex, 1);
      
      // Add to target (at the end)
      const targetDay = newDays[targetDayIndex];
      if (!targetDay) return prev;
      
      targetDay.activities.push(activityToMove);
      
      return newDays;
    });
    
    setDraggedItem(null);
    setDragOverDay(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverDay(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.destinationId || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields (title, description, destination, start date, end date)');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Creating itinerary with data:', {
        title: formData.title.trim(),
        description: formData.description.trim(),
        destinationId: formData.destinationId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isPublic: formData.isPublic,
        daysCount: days.length
      });

      const itineraryData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        destinationId: formData.destinationId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isPublic: formData.isPublic,
        days: days.length > 0 ? days.map(day => ({
          dayNumber: day.dayNumber,
          date: formData.startDate, // Use start date as default
          title: day.title,
          activities: day.activities.map((activity, index) => ({
            type: activity.type, // Keep lowercase as defined in interface
            title: activity.title,
            description: activity.description,
            startTime: activity.startTime || '09:00', // Default start time
            endTime: activity.endTime || '10:00',   // Default end time
            location: activity.location,
            duration: activity.startTime && activity.endTime 
              ? Math.abs(new Date(`1970-01-01T${activity.endTime}:00`).getTime() - new Date(`1970-01-01T${activity.startTime}:00`).getTime()) / (1000 * 60)
              : 60, // default 60 minutes
            cost: activity.cost,
            bookingReference: '',
            notes: '',
            position: index
          }))
        })) : []
      };

      console.log('Final itinerary data being sent:', JSON.stringify(itineraryData, null, 2));
      
      await dispatch(createItinerary(itineraryData)).unwrap();
      toast.success('Itinerary created successfully!');
      router.push('/itinerary');
    } catch (error) {
      console.error('Create itinerary error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create itinerary. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'transport': return Plane;
      case 'accommodation': return Hotel;
      case 'activity': return Camera;
      default: return Camera;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'transport': return 'bg-blue-100 text-blue-800';
      case 'accommodation': return 'bg-green-100 text-green-800';
      case 'activity': return 'bg-purple-100 text-purple-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  const totalCost = days.reduce((total, day) => 
    total + day.activities.reduce((dayTotal, activity) => dayTotal + activity.cost, 0), 0
  );

  // Use currentDestination if available (from URL parameter), otherwise find from destinations list
  const selectedDestination = currentDestination || destinations.find(dest => {
    const destId = dest.id || dest._id;
    const formDestId = formData.destinationId;
    return destId === formDestId;
  });

  // Debug logging
  console.log('Destinations loaded:', destinations.length);
  console.log('Form destination ID:', formData.destinationId);
  console.log('Selected destination name:', selectedDestination?.name);

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Create New Itinerary</h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push('/itinerary')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create Itinerary'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Itinerary Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter itinerary title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination *
                  </label>
                  <input
                    type="text"
                    value={destinationsLoading 
                      ? (destinationFromUrl ? 'Loading destination...' : 'Select a destination')
                      : selectedDestination 
                        ? selectedDestination.name
                        : 'Select a destination'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your itinerary..."
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Make this itinerary public (shareable with others)
                  </span>
                </label>
              </div>
            </div>

            {/* Trip Dates */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Trip Dates</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Itinerary Builder */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Itinerary Builder</h2>
                <button
                  type="button"
                  onClick={() => setShowAddDay(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Day
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Days</p>
                      <p className="text-xl font-bold text-gray-900">{days.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Camera className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Activities</p>
                      <p className="text-xl font-bold text-gray-900">
                        {days.reduce((total, day) => total + day.activities.length, 0)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Cost</p>
                      <p className="text-xl font-bold text-gray-900">${totalCost}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Days and Activities */}
              <div className="space-y-6">
                {days.map((day, dayIndex) => (
                  <div 
                    key={dayIndex} 
                    className={`border border-gray-200 rounded-lg overflow-hidden transition-all ${
                      dragOverDay === dayIndex ? 'border-blue-400 bg-blue-50 shadow-lg' : ''
                    }`}
                    onDragOver={(e) => handleDayDragOver(e, dayIndex)}
                    onDragLeave={handleDayDragLeave}
                    onDrop={(e) => handleDayDrop(e, dayIndex)}
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Day {day.dayNumber}: {day.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setShowAddActivity(dayIndex)}
                            className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Activity
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDay(dayIndex)}
                            className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete Day
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Activities */}
                    <div className="p-6">
                      {day.activities.length > 0 ? (
                        <div className="space-y-2">
                          {day.activities.map((activity, activityIndex) => {
                            const Icon = getActivityIcon(activity.type);
                            return (
                              <div
                                key={activityIndex}
                                draggable
                                onDragStart={(e) => handleDragStart(e, dayIndex, activityIndex)}
                                onDragEnd={handleDragEnd}
                                className={`flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-move ${
                                  draggedItem?.dayIndex === dayIndex && draggedItem?.activityIndex === activityIndex
                                    ? 'opacity-50 scale-95 shadow-lg' : ''
                                }`}
                              >
                                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                      <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                                        <div className="flex items-center">
                                          <MapPin className="w-4 h-4 mr-1" />
                                          <span>{activity.location}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <Clock className="w-4 h-4 mr-1" />
                                          <span>{activity.startTime} - {activity.endTime}</span>
                                        </div>
                                        {activity.cost > 0 && (
                                          <div className="flex items-center">
                                            <DollarSign className="w-4 h-4 mr-1" />
                                            <span>${activity.cost}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteActivity(dayIndex, activityIndex)}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Camera className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No activities planned for this day.</p>
                          <button
                            type="button"
                            onClick={() => setShowAddActivity(dayIndex)}
                            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Add First Activity
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {days.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No days added yet</h3>
                    <p className="mb-4">Start building your itinerary by adding days and activities.</p>
                    <button
                      type="button"
                      onClick={() => setShowAddDay(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add Your First Day
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Destination Preview */}
            {selectedDestination && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">Destination Preview</h2>
                
                <div className="flex items-start space-x-4">
                  {selectedDestination.thumbnail && (
                    <img
                      src={selectedDestination.thumbnail}
                      alt={selectedDestination.name}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/96x96?text=Destination';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {selectedDestination.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{selectedDestination.city}, {selectedDestination.country}</span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {selectedDestination.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Add Day Modal */}
        {showAddDay && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-y-auto z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto overflow-y-auto border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Add New Day</h3>
              <input
                type="text"
                value={newDayTitle}
                onChange={(e) => setNewDayTitle(e.target.value)}
                placeholder="Day title (e.g., Day 1 - Arrival)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddDay()}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddDay(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDay}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Day
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Activity Modal */}
        {showAddActivity !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-auto border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Add New Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={activityForm.type}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, type: e.target.value as 'activity' | 'transport' | 'accommodation' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="activity">Activity</option>
                    <option value="transport">Transport</option>
                    <option value="accommodation">Accommodation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={activityForm.title}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Activity title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={activityForm.startTime}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={activityForm.endTime}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    value={activityForm.location}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                  <input
                    type="number"
                    value={activityForm.cost}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={activityForm.description}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Activity description"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
                              <div className="flex justify-end space-x-2 mt-6">
                  <button
                    onClick={() => {
                      setShowAddActivity(null);
                      setActivityForm({
                        type: 'activity',
                        title: '',
                        description: '',
                        startTime: '',
                        endTime: '',
                        location: '',
                        cost: 0
                      });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddActivity(showAddActivity)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Activity
                  </button>
                </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function CreateItineraryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateItineraryContent />
    </Suspense>
  );
}