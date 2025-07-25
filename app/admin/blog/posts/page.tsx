'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  Filter,
  ArrowLeft,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { FullScreenLoader } from '@/components/ui/loader';
import AdminLayout from '@/components/admin/AdminLayout';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  published: boolean;
  views: number;
  createdAt: string;
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
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export default function AdminBlogPostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewFilter, setViewFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: statusFilter,
        viewFilter: viewFilter,
        sortBy: sortBy,
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/admin/blog/posts?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts);
        setTotalPages(data.pagination.pages);
      } else {
        toast.error('Erreur lors du chargement des articles');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, viewFilter, sortBy, searchTerm]);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchPosts();
  }, [session, status, router, fetchPosts]);

  const handleDeletePost = async (slug: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/posts/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Article supprimé avec succès');
        fetchPosts();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (status === 'loading' || loading) {
    return <FullScreenLoader />;
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout
      title="Gestion des Articles"
      description="Créez, modifiez et gérez tous vos articles de blog"
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Articles</p>
                  <p className="text-2xl font-bold text-blue-900">{posts.length}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Publiés</p>
                  <p className="text-2xl font-bold text-green-900">{posts.filter(p => p.published).length}</p>
                </div>
                <div className="p-3 bg-green-200 rounded-full">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Brouillons</p>
                  <p className="text-2xl font-bold text-yellow-900">{posts.filter(p => !p.published).length}</p>
                </div>
                <div className="p-3 bg-yellow-200 rounded-full">
                  <Edit className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Vues Totales</p>
                  <p className="text-2xl font-bold text-purple-900">{posts.reduce((sum, p) => sum + p.views, 0)}</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-full">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-green-600" />
              Filtres de Recherche
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Rechercher des articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 h-12">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les articles</SelectItem>
                    <SelectItem value="published">Publiés</SelectItem>
                    <SelectItem value="draft">Brouillons</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Analytics Filters */}
              <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-gray-200">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Filtrer par vues
                  </label>
                  <Select value={viewFilter} onValueChange={setViewFilter}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Filtrer par vues" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les vues</SelectItem>
                      <SelectItem value="high">Vues élevées (&gt;100)</SelectItem>
                      <SelectItem value="medium">Vues moyennes (10-100)</SelectItem>
                      <SelectItem value="low">Vues faibles (&lt;10)</SelectItem>
                      <SelectItem value="no-views">Aucune vue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Trier par
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Plus récents</SelectItem>
                      <SelectItem value="oldest">Plus anciens</SelectItem>
                      <SelectItem value="most-viewed">Plus vus</SelectItem>
                      <SelectItem value="least-viewed">Moins vus</SelectItem>
                      <SelectItem value="recently-viewed">Récemment consultés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-6 w-6 text-blue-600" />
              Articles ({posts.length})
            </CardTitle>
            <CardDescription>
              Liste de tous vos articles de blog
            </CardDescription>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="mb-6">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun article trouvé</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {searchTerm || statusFilter !== 'all'
                      ? "Aucun article ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
                      : "Vous n'avez pas encore créé d'articles. Commencez par créer votre premier article de blog."
                    }
                  </p>
                </div>
                <Link href="/admin/blog/posts/new">
                  <Button className="bg-gradient-to-r text-white from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer votre premier article
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {posts.map((post, index) => (
                  <div
                    key={post.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 group animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-6 mb-4">
                          {post.featuredImage && (
                            <div className="flex-shrink-0">
                              <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-40 h-28 object-cover rounded-lg border-2 border-gray-100 shadow-sm"
                              />
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2" style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  lineHeight: '1.4',
                                  minHeight: '2.8em',
                                  wordBreak: 'break-word'
                                }}>
                                  {post.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm text-gray-500 font-medium">Slug:</span>
                                  <code className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded font-mono">
                                    {post.slug}
                                  </code>
                                </div>
                              </div>
                              <Badge
                                variant={post.published ? "default" : "secondary"}
                                className={post.published
                                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-sm"
                                  : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-sm"
                                }
                              >
                                {post.published ? "✓ Publié" : "📝 Brouillon"}
                              </Badge>
                            </div>

                            {post.excerpt && (
                              <p className="text-gray-600 mb-4 leading-relaxed" style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: '1.6',
                                maxHeight: '3.2em',
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word'
                              }}>
                                {post.excerpt.length > 120 ? `${post.excerpt.substring(0, 120)}...` : post.excerpt}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                            <User className="h-4 w-4 text-green-600" />
                            <span className="font-medium">{post.author.name}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                            <Eye className="h-4 w-4 text-purple-600" />
                            <span>{post.views} vues</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {post.category && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                                📁 {post.category.name}
                              </Badge>
                            )}

                            {post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag.id} variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                                    #{tag.name}
                                  </Badge>
                                ))}
                                {post.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500">
                                    +{post.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {post.published && (
                              <Link href={`/blog/${post.slug}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
                                  title="Voir l'article publié"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                            )}
                            <Link href={`/admin/blog/posts/${post.id}/edit`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                                title={post.published ? "Modifier l'article" : "Modifier le brouillon"}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePost(post.slug)}
                              className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                              title="Supprimer l'article"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card className="mt-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Précédent
                </Button>

                <div className="flex gap-1 mx-4">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      onClick={() => setCurrentPage(i + 1)}
                      className={currentPage === i + 1
                        ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                        : "bg-white hover:bg-gray-50"
                      }
                      size="sm"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Suivant
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              </div>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  Page {currentPage} sur {totalPages} • {posts.length} article{posts.length > 1 ? 's' : ''} au total
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
