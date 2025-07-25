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
  Users,
  Settings,
  Shield,
  TrendingUp,
  Calendar,
  Clock,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardStats from '@/components/admin/DashboardStats';

interface BlogPost {
  id: string;
  title: string;
  published: boolean;
  views: number;
}

export default function AdminDashboard() {
  const [blogStats, setBlogStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    categories: 0,
    tags: 0
  });
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    // Fetch blog statistics and user statistics
    fetchBlogStats();
    fetchUserStats();
  }, []);

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

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/admin/users?limit=1000'); // Get all users for stats
      if (response.ok) {
        const data = await response.json();
        const users = data.users || [];

        setUserStats({
          totalUsers: users.length,
          activeUsers: users.filter((user: any) => user.status === 'active').length,
          adminUsers: users.filter((user: any) => user.role === 'admin' || user.role === 'super_admin').length,
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
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
      title: 'Gérer Utilisateurs',
      description: 'Administrer les comptes utilisateurs',
      href: '/admin/users',
      icon: Users,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Voir Articles',
      description: 'Gérer les articles existants',
      href: '/admin/blog/posts',
      icon: FileText,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Statistiques',
      description: 'Voir les métriques détaillées',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  return (
    <AdminLayout
      title="Tableau de Bord"
      description="Vue d'ensemble de votre administration"
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
        {/* Dashboard Statistics */}
        <DashboardStats userStats={userStats} blogStats={blogStats} />

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

      </div>
    </AdminLayout>
  );
}
