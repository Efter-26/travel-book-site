'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/store';
import { fetchPopularDestinations } from '@/store/slices/destinationSlice';
import { fetchHotels } from '@/store/slices/hotelSlice';
import { fetchFlights } from '@/store/slices/flightSlice';
import { fetchPackages } from '@/store/slices/packageSlice';
import Layout from '@/components/Layout';
import { Search, MapPin, Calendar, Users, Star, ArrowRight, Plane, Hotel, Package, Heart, Clock, Award } from 'lucide-react';
import { fetchBlogPosts } from '@/store/slices/blogSlice';

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  featuredImage?: string;
  image?: string;
  category?: string;
  author?: string | { name: string };
  publishedAt: string;
  slug?: string;
}

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const { popularDestinations, isLoading: destinationsLoading } = useSelector(
    (state: RootState) => state.destination
  );
  const { posts, isLoading:blogLoading } = useSelector((state: RootState) => state.blog);

  console.log({posts})
  // Search state
  const [searchType, setSearchType] = useState<'hotels' | 'flights' | 'packages'>('hotels');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState('1');

  useEffect(() => {
    dispatch(fetchPopularDestinations(6));
    dispatch(fetchHotels({ page: 1, limit: 6 }));
    dispatch(fetchFlights({ page: 1, limit: 6 }));
    dispatch(fetchPackages({ page: 1, limit: 6 }));
    dispatch(fetchBlogPosts({ page: 1, limit: 6 }));
  
  }, [dispatch]);

  const handleSearch = () => {
    if (searchType === 'hotels') {
      router.push(`/hotels?search=${searchQuery}&checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guests}`);
    } else if (searchType === 'flights') {
      router.push(`/flights?from=${fromLocation}&to=${toLocation}&date=${checkInDate}`);
    } else if (searchType === 'packages') {
      router.push(`/packages?search=${searchQuery}&date=${checkInDate}&guests=${guests}`);
    }
  };

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      comment: "Amazing experience! Found the perfect hotel in Paris at a great price. The booking process was smooth and the customer service was excellent.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Toronto, Canada",
      rating: 5,
      comment: "Booked a flight to Tokyo and everything went perfectly. Great prices and the flight was on time. Highly recommend!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emma Davis",
      location: "London, UK",
      rating: 5,
      comment: "The vacation package to Bali was incredible! Everything was well-organized and we had the best time. Will definitely book again.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const stats = [
    { number: "500+", label: "Destinations", icon: MapPin },
    { number: "10K+", label: "Happy Travelers", icon: Users },
    { number: "24/7", label: "Support", icon: Clock },
    { number: "4.9", label: "Rating", icon: Star }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section with Working Search */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
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

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 z-10">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Discover Your Next
                <span className="block text-yellow-300">Adventure</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                Book flights, hotels, and vacation packages to the world&apos;s most amazing destinations. 
                Start your journey with us today.
              </p>

              {/* Working Search Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto mb-8">
                <div className="flex justify-center mb-6">
                  <div className="flex bg-white/20 rounded-lg p-1">
                    {[
                      { key: 'hotels', label: 'Hotels', icon: Hotel },
                      { key: 'flights', label: 'Flights', icon: Plane },
                      { key: 'packages', label: 'Packages', icon: Package },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setSearchType(tab.key as 'hotels' | 'flights' | 'packages')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all flex items-center ${
                          searchType === tab.key
                            ? 'bg-white text-blue-600 shadow-lg'
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        <tab.icon className="w-4 h-4 mr-2" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Search Form */}
                <div className={`grid gap-4 ${
                  searchType === 'packages' 
                    ? 'grid-cols-1 md:grid-cols-3 max-w-2xl mx-auto' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                }`}>
                  {searchType === 'hotels' && (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Where to go?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  
                  {searchType === 'flights' && (
                    <>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="From"
                          value={fromLocation}
                          onChange={(e) => setFromLocation(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="To"
                          value={toLocation}
                          onChange={(e) => setToLocation(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}

                  {searchType === 'packages' && (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Destination"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {searchType === 'hotels' && (
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select 
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4+ Guests</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleSearch}
                  className="w-full mt-4 bg-yellow-400 text-blue-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center justify-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search {searchType.charAt(0).toUpperCase() + searchType.slice(1)}
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-yellow-300 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 mr-2" />
                      {stat.number}
                    </div>
                    <div className="text-blue-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Popular Destinations Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Popular Destinations
              </h2>
              <p className="text-lg text-gray-600">
                Discover the most sought-after travel destinations around the world.
              </p>
            </div>

            {destinationsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-xl mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {popularDestinations.filter(destination => destination.id).map((destination) => (
                  <div
                    key={destination.id}
                    className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    onClick={() => router.push(`/destinations/${destination.id}`)}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={destination.images && destination.images.length > 0 ? destination.images[0] : destination.thumbnail || '/placeholder-destination.jpg'}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-xl">
                          {destination.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <button
                onClick={() => router.push('/destinations')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Destinations
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </section>

        {/* Featured Blog Posts */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Travel Inspiration
              </h2>
              <p className="text-lg text-gray-600">
                Get inspired with our latest travel stories and tips.
              </p>
            </div>

            {blogLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-80 rounded-xl mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {posts.map((post, index) => (
                  <div
                    key={post.id || `post-${index}`}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => router.push(`/blog/${post.slug || post.id}`)}
                  >
                    <div className="relative h-80">
                      <img
                        src={post.featuredImage || post.image || '/placeholder-blog.jpg'}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {post.category || 'Travel'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <button
                onClick={() => router.push('/blog')}
                className="inline-flex items-center px-6 py-3 border border-blue-600 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:text-white transition-colors"
              >
                Read More Stories
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Why Choose TravelBook?
              </h2>
              <p className="text-xl text-blue-100">
                We make your travel dreams come true with the best service and prices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
                <p className="text-blue-100">Guaranteed lowest prices on flights, hotels, and packages.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-blue-100">Round-the-clock customer support for all your travel needs.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Service</h3>
                <p className="text-blue-100">Tailored recommendations based on your preferences.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plane className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Global Coverage</h3>
                <p className="text-blue-100">Access to destinations and services worldwide.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Our Travelers Say
              </h2>
              <p className="text-lg text-gray-600">
                Real experiences from our satisfied customers around the world.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                      <p className="text-sm text-gray-600">{review.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">&ldquo;{review.comment}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
