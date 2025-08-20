'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

export default function HeroSection() {
  const [searchType, setSearchType] = useState<'hotels' | 'flights' | 'packages'>('hotels');

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Your Next
            <span className="block text-yellow-300">Adventure</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Book flights, hotels, and vacation packages to the world&apos;s most amazing destinations. 
            Start your journey with us today.
          </p>

          {/* Search Tabs */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto mb-8">
            <div className="flex justify-center mb-6">
              <div className="flex bg-white/20 rounded-lg p-1">
                {[
                  { key: 'hotels', label: 'Hotels', icon: '🏨' },
                  { key: 'flights', label: 'Flights', icon: '✈️' },
                  { key: 'packages', label: 'Packages', icon: '🎒' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSearchType(tab.key as 'hotels' | 'flights' | 'packages')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                      searchType === tab.key
                        ? 'bg-white text-blue-600 shadow-lg'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={searchType === 'hotels' ? 'Where are you going?' : 'From'}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {searchType === 'flights' && (
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="To"
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4+ Guests</option>
                </select>
              </div>
            </div>

            <button className="w-full mt-4 bg-yellow-400 text-blue-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center justify-center">
              <Search className="w-5 h-5 mr-2" />
              Search {searchType.charAt(0).toUpperCase() + searchType.slice(1)}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">500+</div>
              <div className="text-blue-100">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">10K+</div>
              <div className="text-blue-100">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">24/7</div>
              <div className="text-blue-100">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
