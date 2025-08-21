// API Base URL
export const API_BASE_URL = 'https://travelbook-backend-server.onrender.com';

// Authentication Routes
export const AUTH_ROUTES = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
};

// User Routes
export const USER_ROUTES = {
  PROFILE: `${API_BASE_URL}/users/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
  CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password`,
  UPLOAD_AVATAR: `${API_BASE_URL}/users/avatar`,
  PREFERENCES: `${API_BASE_URL}/users/preferences`,
  NOTIFICATIONS: `${API_BASE_URL}/users/notifications`,
  LIST: `${API_BASE_URL}/users`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/users/${id}`,
  UPDATE_ROLE: (id: string) => `${API_BASE_URL}/users/${id}/role`,
};

// Destination Routes
export const DESTINATION_ROUTES = {
  LIST: `${API_BASE_URL}/destinations`,
  CREATE: `${API_BASE_URL}/destinations`,
  POPULAR: `${API_BASE_URL}/destinations/popular`,
  FEATURED: `${API_BASE_URL}/destinations/featured`,
  DETAILS: (id: string) => `${API_BASE_URL}/destinations/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/destinations/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/destinations/${id}`,
  SEARCH: `${API_BASE_URL}/destinations/search`,
  CATEGORIES: `${API_BASE_URL}/destinations/categories`,
  BY_COUNTRY: (country: string) => `${API_BASE_URL}/destinations/country/${country}`,
};

// Hotel Routes
export const HOTEL_ROUTES = {
  LIST: `${API_BASE_URL}/hotels`,
  CREATE: `${API_BASE_URL}/hotels`,
  SEARCH: `${API_BASE_URL}/hotels/search`,
  DETAILS: (id: string) => `${API_BASE_URL}/hotels/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/hotels/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/hotels/${id}`,
  AVAILABILITY: (id: string) => `${API_BASE_URL}/hotels/${id}/availability`,
  REVIEWS: (id: string) => `${API_BASE_URL}/hotels/${id}/reviews`,
  AMENITIES: `${API_BASE_URL}/hotels/amenities`,
  PRICE_RANGE: `${API_BASE_URL}/hotels/price-range`,
  BY_DESTINATION: (destinationId: string) => `${API_BASE_URL}/hotels/destination/${destinationId}`,
  PARTNER_HOTELS: `${API_BASE_URL}/hotels/partner/my-hotels`,
};

// Flight Routes
export const FLIGHT_ROUTES = {
  LIST: `${API_BASE_URL}/flights`,
  CREATE: `${API_BASE_URL}/flights`,
  SEARCH: `${API_BASE_URL}/flights/search`,
  DETAILS: (id: string) => `${API_BASE_URL}/flights/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/flights/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/flights/${id}`,
  AVAILABILITY: `${API_BASE_URL}/flights/availability`,
  AIRLINES: `${API_BASE_URL}/flights/airlines`,
  PRICE_RANGE: `${API_BASE_URL}/flights/price-range`,
  BY_DESTINATION: (destinationId: string) => `${API_BASE_URL}/flights/destination/${destinationId}`,
  PARTNER_FLIGHTS: `${API_BASE_URL}/flights/partner/my-flights`,
};

// Package Routes
export const PACKAGE_ROUTES = {
  LIST: `${API_BASE_URL}/packages`,
  SEARCH: `${API_BASE_URL}/packages/search`,
  DETAILS: (id: string) => `${API_BASE_URL}/packages/${id}`,
  FEATURED: `${API_BASE_URL}/packages/featured`,
  CATEGORIES: `${API_BASE_URL}/packages/categories`,
  CUSTOM: `${API_BASE_URL}/packages/custom`,
};

// Tour Routes
export const TOUR_ROUTES = {
  LIST: `${API_BASE_URL}/tours`,
  SEARCH: `${API_BASE_URL}/tours/search`,
  DETAILS: (id: string) => `${API_BASE_URL}/tours/${id}`,
  FEATURED: `${API_BASE_URL}/tours/featured`,
  CATEGORIES: `${API_BASE_URL}/tours/categories`,
  GUIDES: `${API_BASE_URL}/tours/guides`,
};

// Itinerary Routes
export const ITINERARY_ROUTES = {
  // Public routes
  PUBLIC: (qrCode: string) => `${API_BASE_URL}/itineraries/public/${qrCode}`,
  
  // Authenticated routes
  CREATE: `${API_BASE_URL}/itineraries`,
  MY_ITINERARIES: `${API_BASE_URL}/itineraries/my-itineraries`,
  SHARED: `${API_BASE_URL}/itineraries/shared`,
  DETAILS: (id: string) => `${API_BASE_URL}/itineraries/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/itineraries/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/itineraries/${id}`,
  DUPLICATE: (id: string) => `${API_BASE_URL}/itineraries/${id}/duplicate`,
  
  // Day management
  ADD_DAY: (id: string) => `${API_BASE_URL}/itineraries/${id}/days`,
  UPDATE_DAY: (id: string, dayNumber: number) => `${API_BASE_URL}/itineraries/${id}/days/${dayNumber}`,
  DELETE_DAY: (id: string, dayNumber: number) => `${API_BASE_URL}/itineraries/${id}/days/${dayNumber}`,
  
  // Activity management
  ADD_ACTIVITY: (id: string, dayNumber: number) => `${API_BASE_URL}/itineraries/${id}/days/${dayNumber}/activities`,
  UPDATE_ACTIVITY: (id: string, dayNumber: number, activityId: string) => `${API_BASE_URL}/itineraries/${id}/days/${dayNumber}/activities/${activityId}`,
  DELETE_ACTIVITY: (id: string, dayNumber: number, activityId: string) => `${API_BASE_URL}/itineraries/${id}/days/${dayNumber}/activities/${activityId}`,
  REORDER_ACTIVITIES: (id: string, dayNumber: number) => `${API_BASE_URL}/itineraries/${id}/days/${dayNumber}/activities/reorder`,
  
  // Sharing and export
  SHARE: (id: string) => `${API_BASE_URL}/itineraries/${id}/share`,
  GENERATE_QR: (id: string) => `${API_BASE_URL}/itineraries/${id}/qr-code`,
  EXPORT_PDF: (id: string) => `${API_BASE_URL}/itineraries/${id}/export/pdf`,
};

// Booking Routes
export const BOOKING_ROUTES = {
  CREATE: `${API_BASE_URL}/bookings`,
  LIST: `${API_BASE_URL}/bookings`,
  USER_BOOKINGS: `${API_BASE_URL}/bookings/my-bookings`,
  DETAILS: (id: string) => `${API_BASE_URL}/bookings/${id}`,
  CANCEL: (id: string) => `${API_BASE_URL}/bookings/${id}/cancel`,
  MODIFY: (id: string) => `${API_BASE_URL}/bookings/${id}/modify`,
  PAYMENT: (id: string) => `${API_BASE_URL}/bookings/${id}/payment`,
  CONFIRM: (id: string) => `${API_BASE_URL}/bookings/${id}/confirm`,
};



// Blog Routes
export const BLOG_ROUTES = {
  LIST: `${API_BASE_URL}/blog`,
  CREATE: `${API_BASE_URL}/blog`,
  FEATURED: `${API_BASE_URL}/blog/featured`,
  DETAILS: (slug: string) => `${API_BASE_URL}/blog/${slug}`,
  UPDATE: (id: string) => `${API_BASE_URL}/blog/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/blog/${id}`,
  CATEGORIES: `${API_BASE_URL}/blog/categories`,
  TAGS: `${API_BASE_URL}/blog/tags`,
  SEARCH: `${API_BASE_URL}/blog/search`,
  BY_CATEGORY: (category: string) => `${API_BASE_URL}/blog/category/${category}`,
  BY_TAG: (tag: string) => `${API_BASE_URL}/blog/tag/${tag}`,
  COMMENTS: (id: string) => `${API_BASE_URL}/blog/${id}/comments`,
  LIKE: (id: string) => `${API_BASE_URL}/blog/${id}/like`,
  SHARE: (id: string) => `${API_BASE_URL}/blog/${id}/share`,
};

// Admin Routes
export const ADMIN_ROUTES = {
  DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
  USERS: `${API_BASE_URL}/admin/users`,
  BOOKINGS: `${API_BASE_URL}/admin/bookings`,
  DESTINATIONS: `${API_BASE_URL}/admin/destinations`,
  HOTELS: `${API_BASE_URL}/admin/hotels`,
  FLIGHTS: `${API_BASE_URL}/admin/flights`,
  PACKAGES: `${API_BASE_URL}/admin/packages`,
  TOURS: `${API_BASE_URL}/admin/tours`,
  BLOG_POSTS: `${API_BASE_URL}/admin/blog/posts`,
  PARTNERS: `${API_BASE_URL}/admin/partners`,
  ANALYTICS: `${API_BASE_URL}/admin/analytics`,
  SETTINGS: `${API_BASE_URL}/admin/settings`,
};

// Analytics Routes
export const ANALYTICS_ROUTES = {
  // Admin Analytics
  ADMIN_DASHBOARD: `${API_BASE_URL}/analytics/admin/dashboard`,
  ADMIN_REVENUE: `${API_BASE_URL}/analytics/admin/revenue`,
  ADMIN_BOOKINGS: `${API_BASE_URL}/analytics/admin/bookings`,
  ADMIN_INVENTORY_WARNINGS: `${API_BASE_URL}/analytics/admin/inventory-warnings`,
  
  // Partner Analytics
  PARTNER_DASHBOARD: `${API_BASE_URL}/analytics/partner/dashboard`,
  PARTNER_REVENUE: `${API_BASE_URL}/analytics/partner/revenue`,
  PARTNER_BOOKINGS: `${API_BASE_URL}/analytics/partner/bookings`,
  PARTNER_INVENTORY_WARNINGS: `${API_BASE_URL}/analytics/partner/inventory-warnings`,
};

// Availability Management Routes
export const AVAILABILITY_ROUTES = {
  PARTNER_OVERVIEW: `${API_BASE_URL}/availability/partner`,
  UPDATE_HOTEL: (id: string) => `${API_BASE_URL}/availability/hotels/${id}`,
  UPDATE_FLIGHT: (id: string) => `${API_BASE_URL}/availability/flights/${id}`,
  UPDATE_PACKAGE: (id: string) => `${API_BASE_URL}/availability/packages/${id}`,
  BULK_UPDATE: `${API_BASE_URL}/availability/bulk`,
  ALERTS: `${API_BASE_URL}/availability/alerts`,
};

// Real-time Updates (Socket.io) Routes
export const SOCKET_ROUTES = {
  CONNECT: `${API_BASE_URL}/socket/connect`,
  EVENTS: `${API_BASE_URL}/socket/events`,
};

// Payment Routes
export const PAYMENT_ROUTES = {
  CREATE_INTENT: `${API_BASE_URL}/payments/create-intent`,
  CONFIRM: `${API_BASE_URL}/payments/confirm`,
  REFUND: `${API_BASE_URL}/payments/refund`,
  METHODS: `${API_BASE_URL}/payments/methods`,
  HISTORY: `${API_BASE_URL}/payments/history`,
};

// Review Routes
export const REVIEW_ROUTES = {
  CREATE: `${API_BASE_URL}/reviews`,
  LIST: `${API_BASE_URL}/reviews`,
  USER_REVIEWS: `${API_BASE_URL}/reviews/my-reviews`,
  DETAILS: (id: string) => `${API_BASE_URL}/reviews/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/reviews/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/reviews/${id}`,
  LIKE: (id: string) => `${API_BASE_URL}/reviews/${id}/like`,
};

// Wishlist Routes
export const WISHLIST_ROUTES = {
  LIST: `${API_BASE_URL}/wishlist`,
  ADD: `${API_BASE_URL}/wishlist/add`,
  REMOVE: (id: string) => `${API_BASE_URL}/wishlist/${id}`,
  CLEAR: `${API_BASE_URL}/wishlist/clear`,
};

// Notification Routes
export const NOTIFICATION_ROUTES = {
  LIST: `${API_BASE_URL}/notifications`,
  MARK_READ: (id: string) => `${API_BASE_URL}/notifications/${id}/read`,
  MARK_ALL_READ: `${API_BASE_URL}/notifications/mark-all-read`,
  SETTINGS: `${API_BASE_URL}/notifications/settings`,
};

// Search Routes
export const SEARCH_ROUTES = {
  GLOBAL: `${API_BASE_URL}/search`,
  SUGGESTIONS: `${API_BASE_URL}/search/suggestions`,
  RECENT: `${API_BASE_URL}/search/recent`,
  POPULAR: `${API_BASE_URL}/search/popular`,
};

// Utility Routes
export const UTILITY_ROUTES = {
  COUNTRIES: `${API_BASE_URL}/utils/countries`,
  CITIES: `${API_BASE_URL}/utils/cities`,
  CURRENCIES: `${API_BASE_URL}/utils/currencies`,
  LANGUAGES: `${API_BASE_URL}/utils/languages`,
  TIMEZONES: `${API_BASE_URL}/utils/timezones`,
  UPLOAD: `${API_BASE_URL}/utils/upload`,
  HEALTH: `${API_BASE_URL}/health`,
};
