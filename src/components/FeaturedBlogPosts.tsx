/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { Calendar, Clock, User } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: any;
  featuredImage: string;
  publishedAt?: string;
  readTime: number;
  category: string;
}

interface FeaturedBlogPostsProps {
  posts: BlogPost[];
  isLoading: boolean;
}

export default function FeaturedBlogPosts({ posts, isLoading }: FeaturedBlogPostsProps) {
  // Debug: Log posts data to check for missing IDs
  console.log('FeaturedBlogPosts - posts:', posts);
  console.log('FeaturedBlogPosts - posts IDs:', posts?.map(post => post.id));
  
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Travel Blog
            </h2>
            <p className="text-lg text-gray-600">
              Get inspired with travel tips, destination guides, and adventure stories.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Travel Blog
          </h2>
          <p className="text-lg text-gray-600">
            Get inspired with travel tips, destination guides, and adventure stories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts && posts.length > 0 ? posts.map((post, index) => (
            <Link
              key={post.id || `post-${index}`}
              href={`/blog/${post.slug}`}
              className="group block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.featuredImage || '/placeholder-blog.jpg'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>{post.author?.name || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
                {post.publishedAt && (
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </Link>
          )) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500">No blog posts available at the moment.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
          >
            Read More Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
