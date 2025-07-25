'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Edit,
  Tag,
  Folder,
  Eye,
  BarChart3,
  TrendingUp,
  Calendar,
  Clock,
  Activity,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  published: boolean;
  views: number;
  createdAt: string;
  author?: {
    name: string;
  };
  category?: {
    name: string;
  };
}

export default function BlogAdminPage() {
  const [blogStats, setBlogStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    categories: 0,
    tags: 0
  });
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    setIsLoading(true);
    try {
      const [postsRes, categoriesRes, tagsRes] = await Promise.all([
        fetch('/api/admin/blog/posts'),
        fetch('/api/blog/categories'),
        fetch('/api/blog/tags')
      ]);

      // Handle posts data
      let posts: BlogPost[] = [];
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        posts = Array.isArray(postsData) ? postsData : postsData.posts || [];
      }

      // Handle categories data
      let categories: unknown[] = [];
      if (categoriesRes.ok) {
        categories = await categoriesRes.json();
      }

      // Handle tags data
      let tags: unknown[] = [];
      if (tagsRes.ok) {
        tags = await tagsRes.json();
      }

      const publishedPosts = posts.filter((post: BlogPost) => post.published);
      const draftPosts = posts.filter((post: BlogPost) => !post.published);
      const totalViews = posts.reduce((sum: number, post: BlogPost) => sum + (post.views || 0), 0);

      setBlogStats({
        totalPosts: posts.length,
        publishedPosts: publishedPosts.length,
        draftPosts: draftPosts.length,
        totalViews,
        categories: categories.length,
        tags: tags.length
      });

      // Get recent posts (last 5)
      const sortedPosts = posts
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentPosts(sortedPosts);

    } catch (error) {
      console.error('Error fetching blog data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Nouvel Article',
      description: 'Créer un nouveau post de blog',
      href: '/admin/blog/posts/new',
      icon: Plus,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Gérer Articles',
      description: 'Voir et modifier les articles',
      href: '/admin/blog/posts',
      icon: FileText,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Catégories',
      description: 'Organiser les catégories',
      href: '/admin/blog/categories',
      icon: Folder,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Tags',
      description: 'Gérer les étiquettes',
      href: '/admin/blog/tags',
      icon: Tag,
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  const statsCards = [
    {
      title: 'Total Articles',
      value: blogStats.totalPosts,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Articles Publiés',
      value: blogStats.publishedPosts,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Brouillons',
      value: blogStats.draftPosts,
      icon: Edit,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Total Vues',
      value: blogStats.totalViews,
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Catégories',
      value: blogStats.categories,
      icon: Folder,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Tags',
      value: blogStats.tags,
      icon: Tag,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  return (
    <AdminLayout
      title="Gestion du Blog"
      description="Gérez vos articles, catégories et tags"
      actions={
        <Link href="/admin/blog/posts/new">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Article
          </Button>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {statsCards.map((stat, index) => (
            <Card key={stat.title} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {isLoading ? '...' : stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={action.href} href={action.href}>
                <Card className="border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${action.color} transition-colors`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Articles Récents</h2>
            <Link href="/admin/blog/posts">
              <Button variant="outline" size="sm">
                Voir Tous
              </Button>
            </Link>
          </div>
          
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 text-center text-gray-500">
                  Chargement des articles...
                </div>
              ) : recentPosts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Aucun article trouvé
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {recentPosts.map((post, index) => (
                    <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                                {post.title}
                              </h3>
                              {post.excerpt && (
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                  {post.excerpt}
                                </p>
                              )}
                            </div>
                            <Badge variant={post.published ? "default" : "secondary"} className="flex-shrink-0">
                              {post.published ? 'Publié' : 'Brouillon'}
                            </Badge>
                          </div>

                          <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500">
                            {post.author && (
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {post.author.name}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.views || 0} vues
                            </span>
                            {post.category && (
                              <span className="flex items-center gap-1">
                                <Folder className="h-4 w-4" />
                                {post.category.name}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {post.published && (
                            <Link href={`/blog/${post.slug}`}>
                              <Button variant="outline" size="sm" title="Voir l'article">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          <Link href={`/admin/blog/posts/${post.slug}/edit`}>
                            <Button variant="outline" size="sm" title="Modifier l'article" className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
