/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchBlogPost } from '@/store/slices/blogSlice';
import Layout from '@/components/Layout';
import { BLOG_ROUTES } from '@/config/routes';
import { 
  FacebookShareButton, 
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon
} from 'react-share';
import { 
  Calendar, 
  User, 
  Eye, 
  ArrowLeft, 
  Tag, 
  Edit3,
  Share2,
  Heart,
  BookOpen,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Quote,
  MapPin,
  Star,
  Instagram
} from 'lucide-react';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentPost, isLoading, error } = useSelector((state: RootState) => state.blog);
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const contentRef = useRef<HTMLDivElement | null>(null);

  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      dispatch(fetchBlogPost(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    // Sync local comments when post changes
    setComments(currentPost?.comments || []);
  }, [currentPost]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const el = contentRef.current;
      const rect = el.getBoundingClientRect();
      const elTop = rect.top + window.scrollY;
      const elHeight = el.offsetHeight;
      const start = elTop - 100;
      const end = elTop + elHeight - window.innerHeight;
      const percent = ((window.scrollY - start) / Math.max(1, end - start)) * 100;
      setReadingProgress(Math.max(0, Math.min(100, percent)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentPost) return;
    try {
      await fetch(BLOG_ROUTES.COMMENTS(currentPost.id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText })
      });
      setComments([
        {
          user: user?.name || 'Anonymous',
          content: commentText,
          createdAt: new Date().toISOString(),
        },
        ...comments,
      ]);
      setCommentText('');
    } catch (err) {
      // ignore
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEdit = () => {
    if (currentPost) {
      router.push(`/admin/blog/edit/${currentPost.id}`);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !currentPost) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
              <p className="text-gray-600 mb-8 text-lg">The blog post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              <button
                onClick={() => router.push('/blog')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Blog
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout readingProgress={readingProgress}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 via-purple-700/20 to-blue-700/20"></div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
            {/* Navigation and Actions */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => router.push('/blog')}
                className="inline-flex items-center text-blue-100 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </button>
              
              <div className="flex items-center space-x-3">
                {user && (user.role === 'SUPER_ADMIN' || user.role === 'PARTNER') && (
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                )}
              </div>
            </div>
            
            <div className="text-center">
              {/* Category Badge */}
              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-8 border border-white/30">
                <Tag className="w-4 h-4 mr-2" />
                {currentPost.category}
              </div>
              
              {/* Title */}
              <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight drop-shadow-lg">
                {currentPost.title}
              </h1>
              
              {/* Excerpt */}
              <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
                {currentPost.excerpt}
              </p>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <User className="w-4 h-4 mr-2" />
                  <span className="font-medium">{typeof currentPost.author === 'string' ? currentPost.author : (currentPost.author as { name: string })?.name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-medium">{formatDate(currentPost.publishedAt)}</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-medium">{currentPost.readTime || 5} min read</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="font-medium">{currentPost.views || 0} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Content Wrapper (no sidebar) */}
          <div ref={contentRef} className="max-w-4xl mx-auto">
            {/* Featured Image (no card) */}
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
              <img
                src={currentPost.featuredImage || currentPost.image || '/placeholder-blog.jpg'}
                alt={currentPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              {/* Image Overlay Content */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`flex items-center px-4 py-2 rounded-full backdrop-blur-sm transition-colors ${
                        isLiked 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="font-medium">{currentPost.likes + (isLiked ? 1 : 0)}</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                      <Star className="w-4 h-4 mr-1" />
                      <span>Featured</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Body (no card) */}
            <div className="pt-8 md:pt-12">
              {/* Tags */}
              {currentPost.tags && currentPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-8">
                  {currentPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm rounded-full font-medium border border-blue-200 hover:from-blue-200 hover:to-purple-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Content with Enhanced Typography */}
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ 
                    __html: currentPost.content
                      .replace(/<h1/g, '<h1 class="text-4xl font-bold text-gray-900 mb-6 mt-8 border-b-2 border-blue-200 pb-2"')
                      .replace(/<h2/g, '<h2 class="text-3xl font-bold text-gray-900 mb-5 mt-8"')
                      .replace(/<h3/g, '<h3 class="text-2xl font-semibold text-gray-800 mb-4 mt-6"')
                      .replace(/<p/g, '<p class="text-lg leading-8 mb-6 text-gray-700"')
                      .replace(/<blockquote/g, '<blockquote class="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg italic text-gray-700 my-8"')
                      .replace(/<ul/g, '<ul class="list-disc list-inside space-y-2 mb-6 text-gray-700"')
                      .replace(/<ol/g, '<ol class="list-decimal list-inside space-y-2 mb-6 text-gray-700"')
                      .replace(/<li/g, '<li class="text-lg leading-7"')
                      .replace(/<strong/g, '<strong class="font-bold text-gray-900"')
                      .replace(/<em/g, '<em class="italic text-gray-800"')
                      .replace(/<a/g, '<a class="text-blue-600 hover:text-blue-800 underline font-medium"')
                  }}
                />
              </div>

              {/* Author Section */}
              <div className="border-t-2 border-gray-100 mt-12 pt-8">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {(typeof currentPost.author === 'string' ? currentPost.author : (currentPost.author as { name: string })?.name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-1">
                        {typeof currentPost.author === 'string' ? currentPost.author : (currentPost.author as { name: string })?.name || 'Anonymous'}
                      </h4>
                      <p className="text-gray-600 mb-2">Travel Writer & Adventure Enthusiast</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>Worldwide Explorer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Enjoyed this article?</h3>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      isLiked 
                        ? 'bg-red-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked!' : 'Like this post'}
                  </button>
                  
                  <FacebookShareButton
                    url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`}
                  >
                    <div className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
                      <Facebook className="w-5 h-5 mr-2" />
                      Share on Facebook
                    </div>
                  </FacebookShareButton>
                  
                  <button
                    onClick={() => {
                      const instagramText = `${currentPost?.title}\n\n${currentPost?.excerpt}\n\nRead more: ${window.location.href}`;
                      navigator.clipboard.writeText(instagramText).then(() => {
                        alert('Content copied to clipboard! You can now paste it in your Instagram story or post.');
                      });
                    }}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <Instagram className="w-5 h-5 mr-2" />
                    Share on Instagram
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Comments</h3>
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write your comment..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                  <div className="mt-2 text-right">
                    <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Post Comment
                    </button>
                  </div>
                </form>

                <div className="space-y-4">
                  {comments && comments.length > 0 ? comments.map((c, idx) => (
                    <div key={`${idx}-${c.createdAt || c.user}`} className="bg-white rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-900">{typeof c.user === 'string' ? c.user : (c.user?.name || 'Anonymous')}</div>
                        <div className="text-xs text-gray-500">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-line">{c.content}</p>
                    </div>
                  )) : (
                    <p className="text-gray-600">No comments yet. Be the first to share your thoughts!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
