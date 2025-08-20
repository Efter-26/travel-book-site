'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <Search className="h-full w-full" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors ml-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>
          
          <div className="mt-12">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Pages</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/destinations"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Destinations
              </Link>
              <Link
                href="/hotels"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Hotels
              </Link>
              <Link
                href="/flights"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Flights
              </Link>
              <Link
                href="/blog"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
