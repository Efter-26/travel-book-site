'use client';

import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  description: string;
  country: string;
  city: string;
  images: string[];
  thumbnail: string;
  tags: string[];
}

interface FeaturedDestinationsProps {
  destinations: Destination[];
  isLoading: boolean;
}

export default function FeaturedDestinations({ destinations, isLoading }: FeaturedDestinationsProps) {
  if (isLoading) {
    return (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.filter(destination => destination.id).map((destination) => (
            <Link
              key={destination.id}
              href={`/destinations/${destination.id}`}
              className="group block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={destination.images && destination.images.length > 0 ? destination.images[0] : destination.thumbnail || '/placeholder-destination.jpg'}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center text-white text-sm mb-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{destination.city}, {destination.country}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg">
                    {destination.name}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {destination.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {destination.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={`${destination.id}-tag-${index}`}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/destinations"
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
          >
            View All Destinations
          </Link>
        </div>
      </div>
    </section>
  );
}
