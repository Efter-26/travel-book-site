'use client';

import Link from 'next/link';
import { Plane, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart, Award, Clock, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">TravelBook</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your ultimate travel booking platform for flights, hotels, packages, and tours. 
              Discover amazing destinations and create unforgettable memories with our trusted service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-300">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/destinations" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <Plane className="w-4 h-4 mr-2" />
                  Hotels
                </Link>
              </li>
              <li>
                <Link href="/flights" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <Plane className="w-4 h-4 mr-2" />
                  Flights
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Packages
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Travel Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-300">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-blue-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-300">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-1" />
                <span className="text-gray-300">Mirpur 14, Dhaka, Bangladesh </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">+880-1712345678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">no-reply@travel.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">24/7 Support Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-yellow-400" />
              <div>
                <h4 className="font-semibold text-white">Best Prices</h4>
                <p className="text-sm text-gray-400">Guaranteed lowest rates</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-green-400" />
              <div>
                <h4 className="font-semibold text-white">Secure Booking</h4>
                <p className="text-sm text-gray-400">100% secure transactions</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-blue-400" />
              <div>
                <h4 className="font-semibold text-white">24/7 Support</h4>
                <p className="text-sm text-gray-400">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6 text-red-400" />
              <div>
                <h4 className="font-semibold text-white">Customer First</h4>
                <p className="text-sm text-gray-400">Your satisfaction guaranteed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 TravelBook. All rights reserved. Made with ❤️ for travelers worldwide.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terms" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
