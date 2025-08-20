'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { useRouter } from 'next/navigation';
import { createBooking } from '@/store/slices/bookingSlice';
import { clearCart } from '@/store/slices/cartSlice';
import Layout from '@/components/Layout';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Calendar, 
  MapPin, 
  Users, 
  Plane,
  Bed,
  Package,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export default function CheckoutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items, totalPrice, currency } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const { isLoading, error } = useSelector((state: RootState) => state.booking);

  const [currentStep, setCurrentStep] = useState(1);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [bookingNotes, setBookingNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/');
    }
  }, [items, router]);

  const handleGuestInfoChange = (field: keyof GuestInfo, value: string) => {
    setGuestInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentInfoChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateGuestInfo = () => {
    return Object.values(guestInfo).every(value => value.trim() !== '');
  };

  const validatePaymentInfo = () => {
    return Object.values(paymentInfo).every(value => value.trim() !== '');
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateGuestInfo()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validatePaymentInfo()) {
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitBooking = async () => {
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    setIsProcessing(true);
    try {
      // Create bookings for each cart item
      const bookingPromises = items.map(item => {
        const bookingData = {
          bookingNumber: `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          title: item.title,
          image: item.image,
          location: item.location || '',
          type: item.type,
          status: 'pending' as const,
          paymentStatus: 'pending' as const,
          startDate: item.checkIn || item.startDate || new Date().toISOString(),
          endDate: item.checkOut || item.endDate || new Date().toISOString(),
          guests: item.guests || item.passengers || 1,
          totalPrice: item.price * item.quantity,
          currency: item.currency,
          paymentMethod: 'credit_card',
          // Additional details based on type
          ...(item.type === 'hotel' && {
            roomType: item.roomType,
            checkIn: item.checkIn,
            checkOut: item.checkOut,
          }),
          ...(item.type === 'flight' && {
            departure: item.departure,
            arrival: item.arrival,
            departureTime: item.departureTime,
            arrivalTime: item.arrivalTime,
            class: item.class,
          }),
          ...(item.type === 'package' && {
            duration: item.duration,
          }),
          notes: bookingNotes,
          guestInfo,
          paymentInfo,
        };

        return dispatch(createBooking(bookingData)).unwrap();
      });

      await Promise.all(bookingPromises);
      
      // Clear cart and redirect to success page
      dispatch(clearCart());
      router.push('/booking-success');
    } catch (error: unknown) {
      console.error('Booking failed:', error);
      
      // Handle authentication errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Authentication') || errorMessage.includes('log in')) {
        alert('Please log in to complete your booking.');
        router.push('/login?redirect=/checkout');
        return;
      }
      
      // Handle other errors
      alert(`Booking failed: ${errorMessage || 'Unknown error occurred'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return <Bed className="w-4 h-4" />;
      case 'flight':
        return <Plane className="w-4 h-4" />;
      case 'package':
        return <Package className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-4">Please add items to your cart before checkout.</p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-600">Complete your booking in a few simple steps</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Progress Steps */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      currentStep >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                    }`}>
                      {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
                    </div>
                    <span className="ml-2 font-medium">Guest Information</span>
                  </div>
                  <div className={`flex-1 h-px mx-4 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      currentStep >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                    }`}>
                      {currentStep > 2 ? <CheckCircle className="w-4 h-4" /> : '2'}
                    </div>
                    <span className="ml-2 font-medium">Payment</span>
                  </div>
                  <div className={`flex-1 h-px mx-4 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      currentStep >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                    }`}>
                      3
                    </div>
                    <span className="ml-2 font-medium">Review</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Guest Information */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Guest Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={guestInfo.firstName}
                        onChange={(e) => handleGuestInfoChange('firstName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={guestInfo.lastName}
                        onChange={(e) => handleGuestInfoChange('lastName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) => handleGuestInfoChange('email', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={guestInfo.phone}
                        onChange={(e) => handleGuestInfoChange('phone', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={guestInfo.address}
                        onChange={(e) => handleGuestInfoChange('address', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={guestInfo.city}
                        onChange={(e) => handleGuestInfoChange('city', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        value={guestInfo.country}
                        onChange={(e) => handleGuestInfoChange('country', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={guestInfo.zipCode}
                        onChange={(e) => handleGuestInfoChange('zipCode', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => handlePaymentInfoChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name</label>
                      <input
                        type="text"
                        value={paymentInfo.cardHolder}
                        onChange={(e) => handlePaymentInfoChange('cardHolder', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => handlePaymentInfoChange('expiryDate', e.target.value)}
                          placeholder="MM/YY"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) => handlePaymentInfoChange('cvv', e.target.value)}
                          placeholder="123"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review and Confirm */}
              {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Booking</h2>
                  
                  {/* Guest Information Review */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Guest Information</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-700">
                        <strong>{guestInfo.firstName} {guestInfo.lastName}</strong>
                      </p>
                      <p className="text-gray-600">{guestInfo.email}</p>
                      <p className="text-gray-600">{guestInfo.phone}</p>
                      <p className="text-gray-600">{guestInfo.address}</p>
                      <p className="text-gray-600">{guestInfo.city}, {guestInfo.country} {guestInfo.zipCode}</p>
                    </div>
                  </div>

                  {/* Booking Notes */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                    <textarea
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Any special requests or notes for your booking..."
                    />
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                        <p className="text-red-700">{error}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={handlePreviousStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
                <div className="ml-auto">
                  {currentStep < 3 ? (
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitBooking}
                      disabled={isProcessing}
                      className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isProcessing ? 'Processing...' : 'Confirm Booking'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.type}`} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {getItemIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                          <div className="text-xs text-gray-500 space-y-1">
                            {item.type === 'hotel' && item.checkIn && item.checkOut && (
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(item.checkIn)} - {formatDate(item.checkOut)}
                              </div>
                            )}
                            {item.type === 'flight' && item.departure && item.arrival && (
                              <div className="flex items-center">
                                <Plane className="w-3 h-3 mr-1" />
                                {item.departure} → {item.arrival}
                              </div>
                            )}
                            {item.type === 'package' && item.duration && (
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {item.duration}
                              </div>
                            )}
                            {(item.guests || item.passengers) && (
                              <div className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {item.guests || item.passengers} {item.type === 'hotel' ? 'guests' : 'passengers'}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">${item.price}</p>
                          <p className="text-xs text-gray-500">x{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Includes all taxes and fees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
