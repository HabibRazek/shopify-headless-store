'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, ArrowRight, BookOpen, Clock, Eye, Tag, Filter, RotateCcw, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { InlineLoader } from '@/components/ui/loader';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  published: boolean;
  views: number;
  createdAt: string;
  content: string;
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

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  _count: {
    posts: number;
  };
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [viewFilter, setViewFilter] = useState('all');

  const fetchPosts = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
        sortBy: sortBy,
        viewFilter: viewFilter,
      });

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/blog/posts?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, searchTerm, sortBy, viewFilter]);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [fetchPosts]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      const data = await response.json();

      if (response.ok) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching blog categories:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <InlineLoader text="Chargement des articles..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen sm:mt-20 mt-10 bg-white">
      {/* Clean Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            

            <h1 className="text-5xl md:text-6xl font-bold text-green-600 mb-6 leading-tight">
              Actualités &
              <span className="block text-green-500">
                Innovations
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Découvrez nos dernières actualités, conseils d'experts et innovations dans le domaine de l'emballage durable
            </p>
          </div>

          {/* Clean Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <div className="relative bg-white rounded-2xl border-2 border-green-200 shadow-lg">
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Rechercher un article, une catégorie..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-14 pr-4 py-4 w-full text-lg border-0 focus:ring-0 bg-transparent placeholder:text-gray-500 rounded-xl"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 rounded-xl shadow-lg ml-2"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Clean Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100">
              <div className="text-3xl font-bold text-green-600 mb-2">{posts.length}+</div>
              <div className="text-green-600">Articles publiés</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100">
              <div className="text-3xl font-bold text-green-600 mb-2">{categories.length}</div>
              <div className="text-green-600">Catégories</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100">
              <div className="text-3xl font-bold text-green-600 mb-2">Expert</div>
              <div className="text-green-600">Conseils pro</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 -mt-16 relative z-10">
        {/* Clean Filters Section */}
        <div className="mb-12">
          <div className="bg-white rounded-3xl shadow-lg border border-green-100 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-green-600 mb-2">Explorez nos articles</h2>
              <p className="text-gray-600">Filtrez et trouvez exactement ce que vous cherchez</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-green-600 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Trier par
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full h-12 border-2 border-green-200 focus:border-green-500 rounded-xl shadow-sm hover:shadow-md transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">📅 Plus récents</SelectItem>
                    <SelectItem value="oldest">📅 Plus anciens</SelectItem>
                    <SelectItem value="most-viewed">🔥 Plus vus</SelectItem>
                    <SelectItem value="least-viewed">👁️ Moins vus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-green-600 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Popularité
                </label>
                <Select value={viewFilter} onValueChange={setViewFilter}>
                  <SelectTrigger className="w-full h-12 border-2 border-green-200 focus:border-green-500 rounded-xl shadow-sm hover:shadow-md transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">👁️ Tous les articles</SelectItem>
                    <SelectItem value="high">🔥 Très populaires (500+)</SelectItem>
                    <SelectItem value="medium">⭐ Populaires (100-499)</SelectItem>
                    <SelectItem value="low">📈 Modérés (10-99)</SelectItem>
                    <SelectItem value="new">🆕 Nouveaux (0-9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-green-600 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Catégorie
                </label>
                <Select value={selectedCategory || 'all'} onValueChange={(value) => {
                  setSelectedCategory(value === 'all' ? null : value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-full h-12 border-2 border-green-200 focus:border-green-500 rounded-xl shadow-sm hover:shadow-md transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">📂 Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        📁 {category.name} ({category._count.posts})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Button */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-green-600 opacity-0">Reset</label>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSortBy('newest');
                    setViewFilter('all');
                    setSelectedCategory(null);
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="w-full h-12 border-2 border-green-200 text-green-600 hover:bg-green-600 hover:text-white font-semibold transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-green-50 rounded-2xl p-12 border border-green-100">
                <BookOpen className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-600 mb-2">Aucun article trouvé</h3>
                <p className="text-gray-600 mb-6">
                  Aucun article ne correspond à vos critères de recherche.
                </p>
                <Button
                  onClick={() => {
                    setSortBy('newest');
                    setViewFilter('all');
                    setSelectedCategory(null);
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Voir tous les articles
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map((post) => (
                  <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border-green-100 hover:border-green-200">
                    <div className="relative overflow-hidden rounded-t-lg">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          width={400}
                          height={250}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-48 bg-green-50 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-green-400" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        {post.category && (
                          <Badge className="bg-green-600 text-white hover:bg-green-700">
                            {post.category.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {post.author.image ? (
                            <Image
                              src={post.author.image}
                              alt={post.author.name}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-sm font-medium">
                                {post.author.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <span className="text-sm text-gray-600">{post.author.name}</span>
                        </div>

                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                            Lire la suite
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>

                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-green-100">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag.id} variant="secondary" className="text-xs bg-green-50 text-green-600 hover:bg-green-100">
                              #{tag.name}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Précédent
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "border-green-200 text-green-600 hover:bg-green-50"
                        }
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="border-green-200 text-green-600 hover:bg-green-50"
                  >
                    Suivant
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
