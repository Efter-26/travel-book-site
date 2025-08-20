'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { updateProfile, changePassword } from '@/store/slices/authSlice';
import Layout from '@/components/Layout';
import { User, Lock, Bell, Globe, Shield, CreditCard, Palette, Moon, Sun, Mail, Phone, MapPin } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    language: 'en',
    currency: 'USD',
    timezone: 'UTC',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
    bookingUpdates: true,
    priceAlerts: true,
    newsletter: false,
  });
  const [theme, setTheme] = useState('light');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        language: user.language || 'en',
        currency: user.currency || 'USD',
        timezone: user.timezone || 'UTC',
      });
    }
  }, [user]);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'preferences', name: 'Preferences', icon: Palette },
    { id: 'payment', name: 'Payment', icon: CreditCard },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'JPY', name: 'Japanese Yen (¥)' },
    { code: 'CAD', name: 'Canadian Dollar (C$)' },
    { code: 'AUD', name: 'Australian Dollar (A$)' },
  ];

  const timezones = [
    { code: 'UTC', name: 'UTC (Coordinated Universal Time)' },
    { code: 'EST', name: 'Eastern Standard Time' },
    { code: 'PST', name: 'Pacific Standard Time' },
    { code: 'CET', name: 'Central European Time' },
    { code: 'JST', name: 'Japan Standard Time' },
    { code: 'AEST', name: 'Australian Eastern Standard Time' },
  ];

  const validateProfileForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }

    try {
      // TODO: Replace with actual API endpoint
      // await dispatch(updateProfile(formData)).unwrap();
      console.log('Updating profile with:', formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    try {
      // TODO: Replace with actual API endpoint
      // await dispatch(changePassword(passwordData)).unwrap();
      console.log('Changing password');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Password change failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access settings</h2>
            <p className="text-gray-600">You need to be authenticated to access this page.</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account preferences and settings</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </button>
                    </div>

                    <form onSubmit={handleProfileSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                                isEditing 
                                  ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                                  : 'border-gray-200 bg-gray-50'
                              } ${errors.firstName ? 'border-red-300' : ''}`}
                            />
                          </div>
                          {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                                isEditing 
                                  ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                                  : 'border-gray-200 bg-gray-50'
                              } ${errors.lastName ? 'border-red-300' : ''}`}
                            />
                          </div>
                          {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                                isEditing 
                                  ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                                  : 'border-gray-200 bg-gray-50'
                              } ${errors.email ? 'border-red-300' : ''}`}
                            />
                          </div>
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                                isEditing 
                                  ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                                isEditing 
                                  ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <select
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full p-2 border rounded-md ${
                              isEditing 
                                ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            {languages.map((lang) => (
                              <option key={lang.code} value={lang.code}>
                                {lang.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Currency
                          </label>
                          <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full p-2 border rounded-md ${
                              isEditing 
                                ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            {currencies.map((curr) => (
                              <option key={curr.code} value={curr.code}>
                                {curr.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="mt-6 flex justify-end">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                          >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
                    
                    <form onSubmit={handlePasswordSubmit} className="max-w-md">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="password"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                                errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                              } focus:ring-blue-500 focus:border-blue-500`}
                            />
                          </div>
                          {errors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="password"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                                errors.newPassword ? 'border-red-300' : 'border-gray-300'
                              } focus:ring-blue-500 focus:border-blue-500`}
                            />
                          </div>
                          {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                              } focus:ring-blue-500 focus:border-blue-500`}
                            />
                          </div>
                          {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isLoading ? 'Changing Password...' : 'Change Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Channels</h3>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notifications.email}
                              onChange={() => handleNotificationChange('email')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-sm text-gray-700">Email notifications</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notifications.sms}
                              onChange={() => handleNotificationChange('sms')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-sm text-gray-700">SMS notifications</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notifications.push}
                              onChange={() => handleNotificationChange('push')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-sm text-gray-700">Push notifications</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Types</h3>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notifications.bookingUpdates}
                              onChange={() => handleNotificationChange('bookingUpdates')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-sm text-gray-700">Booking updates and confirmations</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notifications.priceAlerts}
                              onChange={() => handleNotificationChange('priceAlerts')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-sm text-gray-700">Price alerts and deals</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notifications.newsletter}
                              onChange={() => handleNotificationChange('newsletter')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-sm text-gray-700">Weekly newsletter</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notifications.marketing}
                              onChange={() => handleNotificationChange('marketing')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-sm text-gray-700">Marketing communications</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Preferences</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => setTheme('light')}
                            className={`flex items-center px-4 py-2 rounded-md border ${
                              theme === 'light'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Sun className="w-4 h-4 mr-2" />
                            Light
                          </button>
                          <button
                            onClick={() => setTheme('dark')}
                            className={`flex items-center px-4 py-2 rounded-md border ${
                              theme === 'dark'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Moon className="w-4 h-4 mr-2" />
                            Dark
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy</h3>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-sm text-gray-700">Show my profile to other users</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-sm text-gray-700">Allow search engines to index my profile</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Tab */}
                {activeTab === 'payment' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Methods</h2>
                    
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CreditCard className="w-6 h-6 text-gray-400 mr-3" />
                            <div>
                              <p className="font-medium text-gray-900">Visa ending in 4242</p>
                              <p className="text-sm text-gray-600">Expires 12/25</p>
                            </div>
                          </div>
                          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                            Remove
                          </button>
                        </div>
                      </div>

                      <button className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Add Payment Method
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
