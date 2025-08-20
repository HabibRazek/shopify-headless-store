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
import DataTable from '@/components/admin/DataTable';
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge';
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
  const stats = [
    {
      label: 'Total des articles',
      value: blogStats.totalPosts,
      icon: <FileText className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: '+12% ce mois',
      changeType: 'increase' as const
    },
    {
      label: 'Articles publiés',
      value: blogStats.publishedPosts,
      icon: <Eye className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      change: '+8% ce mois',
      changeType: 'increase' as const
    },
    {
      label: 'Brouillons',
      value: blogStats.draftPosts,
      icon: <Edit className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      change: '3 nouveaux',
      changeType: 'neutral' as const
    },
    {
      label: 'Total des vues',
      value: blogStats.totalViews,
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      change: '+15% ce mois',
      changeType: 'increase' as const
    }
  ];

  return (
    <AdminLayout>
      <DataTable
        title="Gestion du Blog"
        subtitle="Gérez vos articles, catégories et tags de manière professionnelle"
        columns={columns}
        data={recentPosts}
        loading={isLoading}
        searchValue=""
        onSearchChange={() => {}}
        searchPlaceholder="Rechercher par titre, auteur, catégorie..."
        filters={[
          {
            key: 'published',
            label: 'Statut',
            options: [
              { value: 'all', label: 'Tous les statuts' },
              { value: 'true', label: 'Publié' },
              { value: 'false', label: 'Brouillon' }
            ],
            value: 'all',
            onChange: () => {}
          }
        ]}
        actions={
          <Link href="/admin/blog/posts/new">
            <Button className="bg-green-600 hover:bg-green-700 text-white h-10 gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              Nouvel Article
            </Button>
          </Link>
        }
        emptyState={{
          icon: <FileText className="w-16 h-16" />,
          title: 'Aucun article trouvé',
          description: 'Aucun article ne correspond aux critères de recherche actuels. Créez votre premier article pour commencer.'
        }}
        onRowClick={(post) => window.open(`/blog/${post.slug}`, '_blank')}
        showStats={true}
        stats={stats}
      />
    </AdminLayout>
  );
}
