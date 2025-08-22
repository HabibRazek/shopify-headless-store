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
  FileText,
  MoreHorizontal,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
  const [categories, setCategories] = useState<{ id: string; name: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
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

      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
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
  }, [currentPage, statusFilter, categoryFilter, viewFilter, sortBy, searchTerm]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/blog/categories');
      const data = await response.json();

      if (response.ok) {
        setCategories(data);
      } else {
        console.error('Error fetching categories:', data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchPosts();
    fetchCategories();
  }, [session, status, router, fetchPosts, fetchCategories]);

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

  const handleDelete = async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      await handleDeletePost(post.slug);
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
    <AdminLayout>
      <div className="space-y-4 max-w-full overflow-hidden">
        {/* Professional Page Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-4 sm:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Link href="/admin/blog" className="text-gray-400 hover:text-gray-600">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] rounded-lg flex items-center justify-center shadow-lg">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Gestion des Articles</h1>
                </div>
                <p className="text-gray-600 text-sm sm:text-lg">Créez, modifiez et gérez tous vos articles de blog</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total articles</p>
                  <p className="text-sm font-medium text-gray-900">{posts.length}</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Articles</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{posts.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900 mt-1">{posts.filter(p => p.published).length}</p>
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
                  <p className="text-2xl font-bold text-gray-900 mt-1">{posts.filter(p => !p.published).length}</p>
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
                  <p className="text-2xl font-bold text-gray-900 mt-1">{posts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Section */}
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-gray-900">Actions et Filtres</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Temps réel</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
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
            </div>

            {/* Search and Filter Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Recherche et Filtres</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      placeholder="Rechercher par titre, auteur, catégorie..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="published">Publiés</SelectItem>
                      <SelectItem value="draft">Brouillons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-48">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Filtrer par catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Table */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-gray-900">Liste des Articles</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Mise à jour en temps réel</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Chargement des articles...</span>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun article trouvé</h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                      ? 'Aucun article ne correspond à vos critères de recherche.'
                      : 'Créez votre premier article pour commencer.'}
                  </p>
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
                        Auteur
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
                    {posts.map((post) => (
                      <TableRow
                        key={post.id}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                      >
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            {post.featuredImage && (
                              <div className="flex-shrink-0">
                                <img
                                  src={post.featuredImage}
                                  alt={post.title}
                                  className="w-16 h-12 object-cover rounded-lg border border-gray-200"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-gray-900 line-clamp-2">
                                {post.title}
                              </div>
                              {post.excerpt && (
                                <div className="text-sm text-gray-500 line-clamp-1 mt-1">
                                  {post.excerpt.length > 80 ? `${post.excerpt.substring(0, 80)}...` : post.excerpt}
                                </div>
                              )}
                              <div className="text-xs text-gray-400 mt-1 font-mono">
                                /{post.slug}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {post.author.image && (
                              <img
                                src={post.author.image}
                                alt={post.author.name}
                                className="w-8 h-8 rounded-full border border-gray-200"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {post.author.name}
                              </div>
                            </div>
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
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(post.id);
                                }}
                                className="cursor-pointer text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
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
