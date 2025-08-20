'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchBlogPosts } from '@/store/slices/blogSlice';
import Layout from '@/components/Layout';
import { Search, Filter, Calendar, User, Eye, Heart, Share2, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BlogPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  const dispatch = useDispatch<AppDispatch>();
  const { posts, isLoading } = useSelector((state: RootState) => state.blog);

  useEffect(() => {
    // Fetch blog posts from API with filters
    dispatch(fetchBlogPosts({ 
      page: 1, 
      limit: 10, 
      category: selectedCategory !== 'all' ? selectedCategory : undefined
    }));
  }, [dispatch, searchTerm, selectedCategory, sortBy]);

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'destinations', name: 'Destinations' },
    { id: 'travel-tips', name: 'Travel Tips' },
    { id: 'culture', name: 'Culture & History' },
    { id: 'food', name: 'Food & Dining' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'budget', name: 'Budget Travel' },
    { id: 'luxury', name: 'Luxury Travel' },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case 'popular':
        return b.views - a.views;
      case 'likes':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  // Debug: Log posts data to check for missing IDs
  console.log('BlogPage - posts:', posts);
  console.log('BlogPage - sortedPosts:', sortedPosts);
  console.log('BlogPage - posts IDs:', posts?.map(post => post.id));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white py-20 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-700/20 via-blue-700/20 to-green-700/20"></div>
          
          {/* Floating Circles Animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
            <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/10 rounded-full animate-pulse animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '5s' }}></div>
            <div className="absolute bottom-40 right-10 w-18 h-18 bg-white/10 rounded-full animate-pulse animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}></div>
          </div>
          
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-6 -translate-y-32 animate-pulse" style={{ animationDuration: '8s' }}></div>
          
          {/* Moving Light Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" style={{ animationDuration: '6s' }}></div>
            <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" style={{ animationDelay: '3s', animationDuration: '6s' }}></div>
          </div>
          
          {/* Animated Wave Effect */}
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/10 to-transparent animate-pulse" style={{ animationDuration: '10s' }}></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">Travel Blog & Guides</h1>
              <p className="text-xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed">
                Discover amazing destinations, travel tips, and inspiring stories from around the world
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    placeholder="Search articles, destinations, or travel tips..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50 border-2 border-white/30 shadow-lg text-lg bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100">
                <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                  <Filter className="w-6 h-6 mr-3 text-blue-600" />
                  Filters
                </h3>

                {/* Categories */}
                <div className="mb-8">
                  <h4 className="font-semibold mb-4 text-gray-700">Categories</h4>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={selectedCategory === category.id}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div className="mb-8">
                  <h4 className="font-semibold mb-4 text-gray-700">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="latest">Latest</option>
                    <option value="popular">Most Popular</option>
                    <option value="likes">Most Liked</option>
                  </select>
                </div>

                {/* Popular Tags */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-4 text-gray-700">Popular Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Europe', 'Asia', 'Beach', 'Mountains', 'City', 'Food', 'Culture', 'Adventure'].map((tag, index) => (
                      <button
                        key={tag}
                        className="px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm hover:from-blue-100 hover:to-purple-100 transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:scale-105"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="lg:w-3/4">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-lg animate-pulse overflow-hidden">
                      <div className="h-56 bg-gradient-to-r from-gray-200 to-gray-300"></div>
                      <div className="p-6">
                        <div className="flex items-center mb-3">
                          <div className="h-4 bg-gray-200 rounded w-24 mr-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-4"></div>
                          <div className="h-4 bg-gray-200 rounded w-20 ml-2"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex space-x-2">
                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                          </div>
                        </div>
                        <div className="h-10 bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                      {sortedPosts.length} Articles Found
                    </h2>
                    <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                      Latest updates
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sortedPosts && sortedPosts.length > 0 ? sortedPosts.map((post, index) => (
                      <article 
                        key={post.id || `post-${index}`} 
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 cursor-pointer"
                        onClick={() => router.push(`/blog/${post.slug || post.id}`)}
                      >
                        <div className="relative">
                          <img
                            src={post.featuredImage || post.image || '/placeholder-blog.jpg'}
                            alt={post.title}
                            className="w-full h-56 object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                              {post.category}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                              <Heart className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                            <span>{formatDate(post.publishedAt)}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <User className="w-4 h-4 mr-1 text-blue-500" />
                            <span>{String(post.author).includes('name') ? JSON.parse(String(post.author)).name : (typeof post.author === 'string' ? post.author : 'Anonymous')}</span>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-3 line-clamp-2 text-gray-800 hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
                                <Eye className="w-4 h-4 mr-1 text-blue-500" />
                                <span className="font-medium">{post.views}</span>
                              </div>
                              <div className="flex items-center bg-pink-50 px-2 py-1 rounded-full">
                                <Heart className="w-4 h-4 mr-1 text-pink-500" />
                                <span className="font-medium">{post.likes}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <Share2 className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags?.slice(0, 3).map((tag) => (
                              <span key={tag} className="flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <button 
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/blog/${post.slug || post.id}`);
                            }}
                          >
                            Read More
                          </button>
                        </div>
                      </article>
                    )) : (
                      <div className="col-span-2 text-center py-8">
                        <p className="text-gray-500">No blog posts available.</p>
                      </div>
                    )}
                  </div>

                  {sortedPosts.length === 0 && (
                    <div className="text-center py-16">
                      <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-12 h-12 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">No articles found</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Try adjusting your search criteria or filters to find what you&apos;re looking for.
                      </p>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                        }}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}

                  {/* Load More Button */}
                  {sortedPosts.length > 0 && (
                    <div className="mt-12 text-center">
                      <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Load More Articles
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
