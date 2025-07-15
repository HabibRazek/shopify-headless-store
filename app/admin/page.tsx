'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Edit,
  Tag,
  Folder,
  Eye,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FullScreenLoader, InlineLoader } from '@/components/ui/loader';

interface BlogPost {
  id: string;
  title: string;
  published: boolean;
  views: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blogStats, setBlogStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    categories: 0,
    tags: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    // Fetch blog statistics
    fetchBlogStats();
  }, [session, status, router]);

  const fetchBlogStats = async () => {
    setIsLoadingStats(true);
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
      } else {
        console.error('Failed to fetch posts:', await postsRes.text());
      }

      // Handle categories data
      let categories: unknown[] = [];
      if (categoriesRes.ok) {
        categories = await categoriesRes.json();
      } else {
        console.error('Failed to fetch categories:', await categoriesRes.text());
      }

      // Handle tags data
      let tags: unknown[] = [];
      if (tagsRes.ok) {
        tags = await tagsRes.json();
      } else {
        console.error('Failed to fetch tags:', await tagsRes.text());
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
    } catch (error) {
      console.error('Error fetching blog stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  if (status === 'loading') {
    return <FullScreenLoader />;
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Gestion du Blog
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Bienvenue, {session.user.name}. Créez et gérez votre contenu blog pour engager vos clients.
            </p>
            <Link href="/admin/blog/posts/new">
              <Button size="lg" className="bg-green-600 text-white hover:bg-green-700 font-semibold px-8 py-3">
                <Plus className="h-5 w-5 mr-2" />
                Créer un nouvel article
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Blog Statistics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistiques du Blog</h2>
          {isLoadingStats ? (
            <div className="py-12">
              <InlineLoader text="Chargement des statistiques..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Articles</CardTitle>
                <FileText className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{blogStats.totalPosts}</div>
                <p className="text-sm text-gray-500 mt-1">
                  {blogStats.publishedPosts} publiés, {blogStats.draftPosts} brouillons
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Vues Totales</CardTitle>
                <Eye className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{blogStats.totalViews.toLocaleString()}</div>
                <p className="text-sm text-gray-500 mt-1">
                  Lectures de vos articles
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Catégories & Tags</CardTitle>
                <Tag className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{blogStats.categories + blogStats.tags}</div>
                <p className="text-sm text-gray-500 mt-1">
                  {blogStats.categories} catégories, {blogStats.tags} tags
                </p>
              </CardContent>
            </Card>
          </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/admin/blog/posts/new">
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer bg-green-50 hover:bg-green-100">
                <CardContent className="p-6 text-center">
                  <Plus className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">Nouvel Article</h3>
                  <p className="text-gray-600 text-sm">Créer un nouveau post</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/blog/posts">
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer bg-gray-50 hover:bg-gray-100">
                <CardContent className="p-6 text-center">
                  <Edit className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">Gérer Articles</h3>
                  <p className="text-gray-600 text-sm">Modifier vos posts</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/blog/categories">
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer bg-purple-50 hover:bg-purple-100">
                <CardContent className="p-6 text-center">
                  <Folder className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">Catégories</h3>
                  <p className="text-gray-600 text-sm">Organiser le contenu</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/blog/tags">
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer bg-orange-50 hover:bg-orange-100">
                <CardContent className="p-6 text-center">
                  <Tag className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">Tags</h3>
                  <p className="text-gray-600 text-sm">Étiqueter les articles</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Blog Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Content Management */}
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
                <FileText className="h-6 w-6 text-blue-600" />
                Gestion du Contenu
              </CardTitle>
              <CardDescription className="text-gray-600">
                Créez et organisez vos articles de blog
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Link href="/admin/blog/posts">
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer bg-white hover:bg-gray-50">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Edit className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-gray-900">Gérer les Articles</div>
                      <div className="text-sm text-gray-600">Modifier, supprimer vos posts</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/blog">
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer bg-white hover:bg-gray-50">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Eye className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-gray-900">Voir le Blog Public</div>
                      <div className="text-sm text-gray-600">Aperçu de votre blog</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
                <Folder className="h-6 w-6 text-purple-600" />
                Organisation
              </CardTitle>
              <CardDescription className="text-gray-600">
                Structurez votre contenu avec des catégories et tags
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Link href="/admin/blog/categories">
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer bg-white hover:bg-gray-50">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Folder className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-gray-900">Gérer les Catégories</div>
                      <div className="text-sm text-gray-600">{blogStats.categories} catégories actives</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/blog/tags">
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer bg-white hover:bg-gray-50">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Tag className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-gray-900">Gérer les Tags</div>
                      <div className="text-sm text-gray-600">{blogStats.tags} tags disponibles</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Tips & Resources */}
        <Card className="border border-gray-200 shadow-sm bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              Conseils pour votre Blog
            </CardTitle>
            <CardDescription className="text-gray-600">
              Optimisez votre contenu pour un meilleur engagement
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Publiez régulièrement</p>
                    <p className="text-sm text-gray-600">Maintenez un rythme de publication constant pour fidéliser vos lecteurs</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Utilisez des images</p>
                    <p className="text-sm text-gray-600">Les articles avec images obtiennent plus d'engagement</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Organisez avec des catégories</p>
                    <p className="text-sm text-gray-600">Facilitez la navigation de vos lecteurs</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Rédigez des extraits</p>
                    <p className="text-sm text-gray-600">Les extraits aident au référencement et à l'aperçu</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
