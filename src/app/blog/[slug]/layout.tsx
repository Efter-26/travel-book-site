import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    
    // Fetch blog post data
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/blog/${resolvedParams.slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      return {
        title: 'Blog Post Not Found | TravelBook',
        description: 'The blog post you are looking for does not exist.',
      };
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
      return {
        title: 'Blog Post Not Found | TravelBook',
        description: 'The blog post you are looking for does not exist.',
      };
    }

    const post = data.data;
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${resolvedParams.slug}`;

    return {
      title: `${post.title} | TravelBook`,
      description: post.excerpt || post.description || 'Travel blog post from TravelBook.',
      openGraph: {
        title: post.title,
        description: post.excerpt || post.description || 'Travel blog post from TravelBook.',
        type: 'article',
        url: url,
        images: [
          {
            url: post.featuredImage || post.image || '/placeholder-blog.jpg',
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        siteName: 'TravelBook',
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || post.description || 'Travel blog post from TravelBook.',
        images: [post.featuredImage || post.image || '/placeholder-blog.jpg'],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post | TravelBook',
      description: 'Travel blog post from TravelBook.',
    };
  }
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}