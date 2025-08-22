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
  Activity,
  User,
  MoreHorizontal,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import Avatar from '@/components/admin/Avatar';

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

  const getStatusIcon = (published: boolean) => {
    return published ? <Eye className="h-4 w-4 text-green-500" /> : <Edit className="h-4 w-4 text-amber-500" />;
  };

  const getStatusLabel = (published: boolean) => {
    return published ? 'Publié' : 'Brouillon';
  };

  // Define table columns
  const columns = [
    {
      key: 'id',
      label: 'ID',
      width: '120px',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm font-mono text-gray-900 bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
          #{value.slice(-8)}
        </span>
      )
    },
    {
      key: 'title',
      label: 'Article',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center group">
          <Avatar name={value} size="lg" variant="blue" className="mr-4 shadow-lg group-hover:shadow-xl transition-shadow" />
          <div>
            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{value}</div>
            {row.excerpt && (
              <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                {row.excerpt}
              </div>
            )}
            {row.category && (
              <div className="text-xs text-gray-400 mt-0.5 font-medium flex items-center gap-1">
                <Folder className="w-3 h-3" />
                {row.category.name}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'author',
      label: 'Auteur',
      width: '140px',
      render: (value: any) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{value?.name || 'Anonyme'}</span>
        </div>
      )
    },
    {
      key: 'views',
      label: 'Vues',
      width: '100px',
      sortable: true,
      align: 'center' as const,
      render: (value: number) => (
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{value.toLocaleString()}</div>
          <div className="text-xs text-gray-500">vues</div>
        </div>
      )
    },
    {
      key: 'published',
      label: 'Statut',
      width: '140px',
      sortable: true,
      render: (value: boolean) => (
        <StatusBadge
          status={value ? 'published' : 'draft'}
          variant={value ? 'success' : 'warning'}
          icon={getStatusIcon(value)}
          size="lg"
        >
          {getStatusLabel(value)}
        </StatusBadge>
      )
    },
    {
      key: 'createdAt',
      label: 'Date de création',
      width: '140px',
      sortable: true,
      render: (value: string) => (
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-900">
            {new Date(value).toLocaleDateString('fr-FR')}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(value).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '160px',
      align: 'right' as const,
      render: (_: any, row: any) => (
        <div className="flex items-center justify-end gap-2">
          <Link href={`/admin/blog/posts/${row.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-green-50 hover:text-green-600 rounded-lg shadow-sm border border-transparent hover:border-green-200 transition-all"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <Link href={`/admin/blog/posts/${row.id}/edit`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg shadow-sm border border-transparent hover:border-blue-200 transition-all"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Link href={`/blog/${row.slug}`} target="_blank">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-purple-50 hover:text-purple-600 rounded-lg shadow-sm border border-transparent hover:border-purple-200 transition-all"
            >
              <Activity className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )
    }
  ];

  // Calculate statistics
  const stats = {
    total: blogStats.totalPosts,
    published: blogStats.publishedPosts,
    drafts: blogStats.draftPosts,
    views: blogStats.totalViews
  };

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-full overflow-hidden">
        {/* Professional Page Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-4 sm:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] rounded-lg flex items-center justify-center shadow-lg">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Gestion du Blog</h1>
                </div>
                <p className="text-gray-600 text-sm sm:text-lg">Gérez vos articles, catégories et tags de manière professionnelle</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total articles</p>
                  <p className="text-sm font-medium text-gray-900">{stats.total}</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/blog/posts">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-[#B4E50D]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Articles</h3>
                    <p className="text-sm text-gray-600">Gérer les articles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/blog/categories">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-[#B4E50D]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <Folder className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Catégories</h3>
                    <p className="text-sm text-gray-600">Organiser par catégories</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/blog/tags">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-[#B4E50D]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <Tag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Tags</h3>
                    <p className="text-sm text-gray-600">Gérer les étiquettes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Statistics Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Aperçu du Blog</h2>
              <p className="text-sm text-gray-600 mt-1">Statistiques en temps réel de votre blog</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Données en direct</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Articles</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Articles Publiés</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.published}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Brouillons</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.drafts}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <Edit className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Vues</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.views.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Posts Section */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-gray-900">Articles Récents</CardTitle>
              <Link href="/admin/blog/posts/new">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-gray-800 hover:to-[#9BC70A] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Article
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Chargement des articles...</span>
              </div>
            ) : recentPosts.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun article trouvé</h3>
                  <p className="text-gray-500 mb-6">Créez votre premier article pour commencer.</p>
                  <Link href="/admin/blog/posts/new">
                    <Button className="bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-gray-800 hover:to-[#9BC70A] text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer le premier article
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 bg-gray-50/50">
                      <TableHead className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Article
                      </TableHead>
                      <TableHead className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Catégorie
                      </TableHead>
                      <TableHead className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Statut
                      </TableHead>
                      <TableHead className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Vues
                      </TableHead>
                      <TableHead className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </TableHead>
                      <TableHead className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPosts.map((post) => (
                      <TableRow
                        key={post.id}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                      >
                        <TableCell className="py-4 px-6">
                          <div>
                            <div className="text-sm font-semibold text-gray-900 line-clamp-1">
                              {post.title}
                            </div>
                            {post.excerpt && (
                              <div className="text-sm text-gray-500 line-clamp-2 mt-1">{post.excerpt}</div>
                            )}
                            {post.author && (
                              <div className="text-xs text-gray-400 mt-1">Par {post.author.name}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          {post.category ? (
                            <Badge variant="secondary" className="text-xs font-medium">
                              {post.category.name}
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-xs">Aucune</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4 px-6 text-center">
                          <Badge
                            variant={post.published ? 'default' : 'secondary'}
                            className={`text-xs font-medium ${
                              post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {post.published ? 'Publié' : 'Brouillon'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#B4E50D]/10 text-[#6B7C00] border border-[#B4E50D]/20">
                            {post.views.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString('fr-FR', { weekday: 'short' })}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`/admin/blog/posts/${post.slug}`, '_blank');
                                }}
                                className="cursor-pointer"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`/blog/${post.slug}`, '_blank');
                                }}
                                className="cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Voir l'article
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
