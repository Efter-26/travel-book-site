# 🛫 TravelBook - Travel Booking Platform

## 📋 Project Overview

*TravelBook* is a comprehensive travel booking platform built with Next.js 15 and TypeScript. This platform allows users to book hotels, flights, packages, and read travel blogs.

## 🛠 Tech Stack

### *Frontend Technologies:*
- *Next.js 15* - React Framework (App Router)
- *TypeScript* - Type-safe programming
- *React 19* - User Interface library
- *Tailwind CSS 4* - CSS Framework
- *Redux Toolkit* - State Management
- *React Redux* - Redux React Integration

### *UI/UX Libraries:*
- *Lucide React* - Icon library
- *React Toastify* - Notification system
- *React Hook Form* - Form handling
- *React Datepicker* - Date picker
- *React Share* - Social sharing

### *HTTP & API:*
- *Axios* - HTTP client
- *React Query* - Server state management

### *Development Tools:*
- *ESLint* - Code linting
- *PostCSS* - CSS processing
- *TypeScript* - Type checking

## 🏗 Project Architecture

```
travel-booking-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Home page
│   │   ├── layout.tsx         # Root layout
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── hotels/            # Hotel listing
│   │   ├── flights/           # Flight listing
│   │   ├── packages/          # Package listing
│   │   ├── destinations/      # Destination listing
│   │   ├── blog/              # Blog section
│   │   ├── checkout/          # Checkout page
│   │   ├── booking-success/   # Booking success page
│   │   ├── admin/             # Admin dashboard
│   │   └── profile/           # User profile
│   ├── components/            # Reusable components
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Footer.tsx         # Footer
│   │   ├── ShoppingCart.tsx   # Shopping cart panel
│   │   ├── Layout.tsx         # Main layout
│   │   └── ...                # Other components
│   ├── store/                 # Redux store
│   │   ├── index.ts           # Store configuration
│   │   └── slices/            # Redux slices
│   │       ├── authSlice.ts   # Authentication
│   │       ├── cartSlice.ts   # Cart management
│   │       ├── bookingSlice.ts # Booking management
│   │       ├── hotelSlice.ts  # Hotel data
│   │       ├── flightSlice.ts # Flight data
│   │       ├── packageSlice.ts # Package data
│   │       └── ...            # Other slices
│   ├── providers/             # React providers
│   ├── config/                # Configuration files
│   └── utils/                 # Utility functions
├── public/                    # Static files
└── package.json              # Dependency management

```
## ✨ Core Features

### 🔐 *Authentication System*
- *Login/Registration* - JWT token-based
- *Role-based Access* - CUSTOMER, ADMIN, SUPER_ADMIN, PARTNER
- *Password Reset* - Forgot password functionality
- *Auto Login* - Session persistence with localStorage
- *Profile Management* - User information updates

### 🏨 *Hotel Booking System*
- *Hotel Search* - By location, date, guests
- *Filtering* - Price, rating, amenities
- *Hotel Details* - Room types, images, reviews
- *Room Selection* - Check-in/check-out dates
- *Guest Count* - Adults and children

### ✈ *Flight Booking System*
- *Flight Search* - From/to, date-based
- *Class Selection* - Economy, Business, First
- *Passenger Count* - Seat selection
- *Flight Details* - Airline, time, price
- *Real-time Pricing* - Dynamic pricing

### 📦 *Package Booking System*
- *Package Search* - By destination, duration
- *Package Details* - Hotels, flights, activities
- *Tour Guide* - Guide information
- *Price Classes* - Economy, Business, First
- *Activity Plan* - Daily itinerary

### 🗺 *Destination Management*
- *Popular Destinations* - Trending locations
- *Destination Search* - By country, city
- *Destination Details* - Images, descriptions
- *Filtering* - Category, price range

### 📝 *Blog System*
- *Blog Listing* - Published posts
- *Blog Details* - Full article view
- *Social Sharing* - Facebook, Instagram sharing
- *Reading Progress* - Scroll-based progress bar
- *Comment System* - User reviews

### 🛒 *Shopping Cart System*
- *Cart Management* - Add, Remove, Update
- *Local Storage* - Data persistence on page reload
- *Multi-item* - Hotels, flights, packages
- *Price Calculation* - Total price
- *Quantity Control* - Item count

### 💳 *Checkout System*
- *Multi-step Checkout* - 3-step process
- *Guest Information* - Personal details
- *Payment Information* - Credit card details
- *Booking Confirmation* - Review and confirm
- *Booking Success* - Confirmation page

### 👨‍💼 *Admin Dashboard*
- *Role-based Access* - ADMIN, SUPER_ADMIN
- *User Management* - User list, status
- *Booking Management* - Booking status updates
- *Content Management* - Hotels, flights, packages
- *Analytics* - Booking statistics

### 🔔 *Notification System*
- *React Toastify* - Success/error messages
- *Real-time Notifications* - Booking status
- *Email Notifications* - Booking confirmations

## 🎨 UI/UX Features

### *Design System*
- *Tailwind CSS* - Utility-first CSS
- *Responsive Design* - Mobile, tablet, desktop
- *Dark/Light Theme* - Theme switching
- *Animations* - CSS animations, transitions
- *Loading States* - Skeleton loaders

### *User Experience*
- *Interactive Search* - Real-time search
- *Filtering* - Advanced filters
- *Pagination* - Load more functionality
- *Sorting* - By price, rating, date
- *Favorites* - Save with heart icon

## 🔧 Technical Features

### *State Management*
- *Redux Toolkit* - Centralized state
- *Redux Persist* - Local storage persistence
- *Async Thunks* - API call handling
- *DevTools* - Redux DevTools integration

### *API Integration*
- *Axios* - HTTP client
- *Interceptors* - Token auto-injection
- *Error Handling* - Centralized error management
- *Retry Logic* - Failed request retry

### *Routing*
- *Next.js App Router* - File-based routing
- *Dynamic Routes* - [id], [slug] parameters
- *Middleware* - Authentication checks
- *Redirects* - Login redirects

### *Performance*
- *Code Splitting* - Lazy loading
- *Image Optimization* - Next.js Image
- *Caching* - React Query cache
- *Bundle Optimization* - Webpack optimization

## 🚀 Installation & Running

### *Prerequisites*
bash
Node.js 18+ 
npm or yarn


### *Installation*
bash
# Clone repository
git clone <repository-url>
cd travel-booking-frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Production build
npm run build
npm start


### *Environment Variables*
env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=TravelBook


## 📱 Responsive Design

- *Mobile* - 320px - 768px
- *Tablet* - 768px - 1024px
- *Desktop* - 1024px+

## 🔒 Security Features

- *JWT Tokens* - Secure authentication
- *HTTPS* - Encrypted communication
- *Input Validation* - Zod schema validation
- *XSS Prevention* - React security
- *CSRF Prevention* - Token-based prevention

## 📊 Data Flow


User Action → Redux Action → API Call → Backend → Response → Redux State → UI Update


## 🧪 Testing

bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage


## 📈 Deployment

### *Vercel*
bash
npm run build
vercel --prod


### *Netlify*
bash
npm run build
netlify deploy --prod


## 🤝 Contribution

1. *Fork* repository
2. *Create* feature branch
3. *Commit* changes
4. *Submit* pull request

## 📄 License

MIT License - See [LICENSE](LICENSE) file

## 📞 Contact

- *Email*: support@travelbook.com
- *Website*: https://travelbook.com
- *Documentation*: https://docs.travelbook.com

---

*TravelBook* - For your next adventure 🛫✈🏨
