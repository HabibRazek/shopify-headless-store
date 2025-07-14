'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Eye, ArrowLeft, Tag, Clock, Share2, Bookmark, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InlineLoader } from '@/components/ui/loader';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  images: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewTracked, setViewTracked] = useState(false);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/posts/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Article non trouvé');
        } else {
          setError('Erreur lors du chargement de l\'article');
        }
        return;
      }

      const data = await response.json();
      setPost(data);
      setError(null);
    } catch (error) {
      setError('Erreur lors du chargement de l\'article');
    } finally {
      setLoading(false);
    }
  };

  const trackView = async (slug: string) => {
    const viewKey = `blog_view_${slug}`;
    const viewedPosts = localStorage.getItem('viewedPosts') || '';
    
    if (viewTracked || viewedPosts.includes(viewKey)) return;

    try {
      const response = await fetch(`/api/blog/posts/${slug}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-viewed-posts': viewedPosts,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setViewTracked(true);

        if (data.viewIncremented) {
          const newViewedPosts = viewedPosts ? `${viewedPosts},${viewKey}` : viewKey;
          localStorage.setItem('viewedPosts', newViewedPosts);
          
          if (post) {
            setPost(prev => prev ? { ...prev, views: data.totalViews } : null);
          }
        }
      }
    } catch (error) {
      // Silent fail for view tracking
    }
  };

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  useEffect(() => {
    if (post && !viewTracked) {
      const timer = setTimeout(() => {
        trackView(slug);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [post, slug, viewTracked]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: post?.title || 'Article de blog',
      text: post?.excerpt || 'Découvrez cet article intéressant',
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Lien copié dans le presse-papiers !');
      }
    } catch (error) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Lien copié dans le presse-papiers !');
      } catch (clipboardError) {
        // Final fallback: show URL in prompt
        prompt('Copiez ce lien pour partager:', window.location.href);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <InlineLoader text="Chargement de l'article..." />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au blog
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Article non trouvé'}
            </h1>
            <p className="text-gray-600 mb-6">
              L'article que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Link href="/blog">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Enhanced Back Button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="outline" className="border-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 font-semibold shadow-sm hover:shadow-md transition-all duration-300 rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au blog
            </Button>
          </Link>
        </div>

        {/* Enhanced Article Container */}
        <article className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {post.featuredImage && (
            <div className="relative h-80 md:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

              {/* Category Badge on Image */}
              {post.category && (
                <div className="absolute top-6 left-6">
                  <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white font-medium px-4 py-2 text-sm shadow-lg backdrop-blur-sm">
                    📁 {post.category.name}
                  </Badge>
                </div>
              )}

              {/* Views Badge */}
              <div className="absolute top-6 right-6">
                <Badge variant="secondary" className="bg-white/90 text-gray-700 backdrop-blur-sm shadow-lg px-3 py-2">
                  <Eye className="h-4 w-4 mr-1" />
                  {post.views} vues
                </Badge>
              </div>
            </div>
          )}

          <div className="p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              {post.title}
            </h1>

            {/* Enhanced Meta Information */}
            <div className="flex flex-wrap items-center gap-8 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-2">
                <User className="h-5 w-5 text-green-600" />
                <span className="font-medium">{post.author.name}</span>
              </div>
              <div className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <span className="font-medium">{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="font-medium">{Math.ceil(post.content.length / 1000)} min de lecture</span>
              </div>
            </div>

            {/* Social Actions */}
            <div className="flex items-center justify-center mb-8 p-6 bg-green-50 rounded-2xl border border-green-100">
              <Button
                onClick={handleShare}
                className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 font-medium shadow-md hover:shadow-lg transition-all duration-300 text-lg"
                size="lg"
              >
                <Share2 className="h-5 w-5 mr-3" />
                Partager
              </Button>
            </div>

            {/* Enhanced Content */}
            <div className="prose prose-xl max-w-none mb-12">
              <div
                className="text-gray-800 leading-relaxed blog-content"
                style={{
                  lineHeight: '1.9',
                  fontSize: '1.125rem',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  textAlign: 'justify'
                }}
                dangerouslySetInnerHTML={{
                  __html: post.content
                    .replace(/\n/g, '<br>')
                    .replace(/\r\n/g, '<br>')
                    .replace(/\r/g, '<br>')
                }}
              />
            </div>

            {/* Additional Images Gallery */}
            {post.images && post.images.length > 0 && (
              <div className="mb-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Images de l'article</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {post.images.map((imageUrl, index) => (
                    <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
                      <Image
                        src={imageUrl}
                        alt={`Image ${index + 1} de l'article ${post.title}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Tags Section */}
            {post.tags.length > 0 && (
              <div className="pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Tag className="h-5 w-5 text-green-600" />
                  </div>
                  Tags de l'article
                </h3>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="text-sm px-4 py-2 border-2 border-green-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 rounded-xl text-green-600"
                    >
                      #{tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Footer Actions */}
            <div className="pt-8 border-t border-green-200 mt-8">
              <div className="flex justify-center">
                <Link href="/blog">
                  <Button variant="outline" className="border-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 font-semibold shadow-sm hover:shadow-md transition-all duration-300 rounded-xl px-8 py-3">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour au blog
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
