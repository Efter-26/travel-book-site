'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { removeFromCart, updateCartItem, clearCart, closeCart } from '@/store/slices/cartSlice';
import { useRouter } from 'next/navigation';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Calendar, 
  MapPin, 
  Users, 
  Plane,
  Bed,
  Package,
  CreditCard,
  BookOpen
} from 'lucide-react';

export default function ShoppingCartPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items, isOpen, totalItems, totalPrice, currency } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleQuantityChange = (id: string, type: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(`${id}-${type}`);
    dispatch(updateCartItem({ id, type, updates: { quantity: newQuantity } }));
    setTimeout(() => setIsUpdating(null), 300);
  };

  const handleRemoveItem = (id: string, type: string) => {
    dispatch(removeFromCart({ id, type }));
  };

  const handleCheckout = () => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
    dispatch(closeCart());
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
        return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 bg-opacity-20 transition-opacity"
        onClick={() => dispatch(closeCart())}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">My Bookings</h2>
            </div>
            <button
              onClick={() => dispatch(closeCart())}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-4">Start adding hotels, flights, or packages to your booking list</p>
                <button
                  onClick={() => {
                    dispatch(closeCart());
                    router.push('/');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Travel Options
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.type}`} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        {getItemIcon(item.type)}
                        <span className="ml-2 text-xs font-medium text-gray-500 uppercase">
                          {item.type}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.type)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Item Image and Title */}
                    <div className="flex mb-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-md mr-3"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/64x64?text=Image';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                          {item.title}
                        </h4>
                        {item.location && (
                          <div className="flex items-center text-gray-600 text-xs mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {item.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="space-y-2 mb-3">
                      {/* Hotel Details */}
                      {item.type === 'hotel' && item.checkIn && item.checkOut && (
                        <div className="flex items-center text-gray-600 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(item.checkIn)} - {formatDate(item.checkOut)}
                        </div>
                      )}
                      
                      {/* Flight Details */}
                      {item.type === 'flight' && item.departure && item.arrival && (
                        <div className="flex items-center text-gray-600 text-xs">
                          <Plane className="w-3 h-3 mr-1" />
                          {item.departure} → {item.arrival}
                        </div>
                      )}

                      {/* Package Details */}
                      {item.type === 'package' && item.duration && (
                        <div className="flex items-center text-gray-600 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {item.duration}
                        </div>
                      )}

                      {/* Guests/Passengers */}
                      {(item.guests || item.passengers) && (
                        <div className="flex items-center text-gray-600 text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {item.guests || item.passengers} {item.type === 'hotel' ? 'guests' : 'passengers'}
                        </div>
                      )}
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-semibold text-gray-900">
                          ${item.price}
                        </span>
                        <span className="text-gray-500 ml-1">per {item.type === 'hotel' ? 'night' : 'person'}</span>
                      </div>
                      
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.type, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                          {isUpdating === `${item.id}-${item.type}` ? '...' : item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.type, item.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="mt-2 text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Total ({totalItems} items)</span>
                <span className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {user ? 'Proceed to Booking' : 'Login to Book'}
                </button>
                
                <button
                  onClick={() => dispatch(clearCart())}
                  className="w-full px-4 py-2 text-gray-600 hover:text-red-600 transition-colors text-sm"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
