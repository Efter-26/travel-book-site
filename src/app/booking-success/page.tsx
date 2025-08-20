'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Layout from '@/components/Layout';
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Calendar, 
  MapPin, 
  Users, 
  CreditCard,
  ArrowRight,
  Home,
  BookOpen
} from 'lucide-react';

export default function BookingSuccessPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentBooking } = useSelector((state: RootState) => state.booking);
  
  const [bookingNumber] = useState(`BK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);

  useEffect(() => {
    // Redirect if no user is logged in
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-2">
              Thank you for your booking. Your reservation has been successfully confirmed.
            </p>
            <p className="text-sm text-gray-500">
              Booking Number: <span className="font-mono font-semibold text-gray-900">{bookingNumber}</span>
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Booking Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Guest</p>
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <p className="font-medium text-green-600">Paid</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Booking Status</p>
                    <p className="font-medium text-blue-600">Confirmed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-8 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What&apos;s Next?</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Confirmation Email</p>
                  <p className="text-gray-600">You&apos;ll receive a detailed confirmation email within the next few minutes.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Travel Documents</p>
                  <p className="text-gray-600">Your travel vouchers and tickets will be available in your booking dashboard.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Pre-trip Information</p>
                  <p className="text-gray-600">We&apos;ll send you important information about your trip 24-48 hours before departure.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/bookings')}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              View My Bookings
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </div>

          {/* Additional Information */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Need help? Contact our customer support team
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <a href="mailto:support@travelbook.com" className="text-blue-600 hover:text-blue-700">
                support@travelbook.com
              </a>
              <span className="text-gray-300">|</span>
              <a href="tel:+1-800-TRAVEL" className="text-blue-600 hover:text-blue-700">
                +1-800-TRAVEL
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
