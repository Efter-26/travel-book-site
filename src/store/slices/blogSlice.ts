import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { BLOG_ROUTES } from '@/config/routes';

interface ApiErrorResponse {
  message: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  image: string;
  featuredImage: string;
  images: string[];
  category: string;
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  comments: Array<{
    user: string;
    content: string;
    createdAt: string;
  }>;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  isFeatured: boolean;
}

interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  featuredPosts: BlogPost[];
  categories: string[];
  tags: string[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  featuredPosts: [],
  categories: [],
  tags: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

export const fetchBlogPosts = createAsyncThunk(
  'blog/fetchBlogPosts',
  async (params: { page?: number; limit?: number; category?: string; tag?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(BLOG_ROUTES.LIST, { params });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to fetch blog posts');
    }
  }
);

export const fetchBlogPost = createAsyncThunk(
  'blog/fetchBlogPost',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(BLOG_ROUTES.DETAILS(slug));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to fetch blog post');
    }
  }
);

export const fetchFeaturedPosts = createAsyncThunk(
  'blog/fetchFeaturedPosts',
  async (limit: number = 6, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BLOG_ROUTES.FEATURED}?limit=${limit}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue((axiosError.response?.data as ApiErrorResponse)?.message || 'Failed to fetch featured posts');
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBlogPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPost = action.payload.data;
      })
      .addCase(fetchBlogPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFeaturedPosts.fulfilled, (state, action) => {
        state.featuredPosts = action.payload.data;
      });
  },
});

export const { clearError, clearCurrentPost } = blogSlice.actions;
export default blogSlice.reducer;
