'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,

  Folder,
  Eye,
  BarChart3,
  Users,

  TrendingUp,
  TrendingDown,

  Activity,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AdminLayout from '@/components/admin/AdminLayout';

interface BlogPost {
  id: string;
  title: string;
  published: boolean;
  views: number;
}

export default function AdminDashboard() {
  const [userStats, setUserStats] = useState({
    totalUsers: 4,
    activeUsers: 4,
    adminUsers: 1,
  });

  useEffect(() => {
    // Fetch user statistics
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/admin/users?limit=1000');
      if (response.ok) {
        const data = await response.json();
        const users = data.users || [];

        setUserStats({
          totalUsers: users.length || 4,
          activeUsers: users.filter((user: any) => user.status === 'active').length || 4,
          adminUsers: users.filter((user: any) => user.role === 'admin' || user.role === 'super_admin').length || 1,
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  // Main dashboard stats with exact data from your request
  const mainStats = [
    {
      title: 'Total Utilisateurs',
      value: userStats.totalUsers,
      change: '+12.5%',
      changeType: 'increase' as const,
      description: 'Utilisateurs inscrits',
      icon: Users,
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Articles Publiés',
      value: 0,
      change: '+8.2%',
      changeType: 'increase' as const,
      description: 'Articles en ligne',
      icon: FileText,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Vues Totales',
      value: 0,
      change: '+23.1%',
      changeType: 'increase' as const,
      description: 'Lectures d\'articles',
      icon: Eye,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      title: 'Utilisateurs Actifs',
      value: userStats.activeUsers,
      change: '-2.4%',
      changeType: 'decrease' as const,
      description: 'Actifs ce mois',
      icon: Activity,
      color: 'bg-orange-50 border-orange-200'
    }
  ];

  const quickStats = [
    { label: 'Brouillons', value: 0, total: 1, progress: 0 },
    { label: 'Catégories', value: 0, total: 20, progress: 0 },
    { label: 'Tags', value: 0, total: 50, progress: 0 },
    { label: 'Admins', value: userStats.adminUsers, total: 4, progress: (userStats.adminUsers / 4) * 100 }
  ];

  const recentActivity = [
    {
      action: 'Nouvel utilisateur inscrit',
      user: 'Marie Dubois',
      time: 'Il y a 5 minutes',
      icon: Users,
      color: 'text-green-600'
    },
    {
      action: 'Article publié',
      user: 'Admin',
      time: 'Il y a 1 heure',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      action: 'Commentaire approuvé',
      user: 'Jean Martin',
      time: 'Il y a 2 heures',
      icon: MessageSquare,
      color: 'text-purple-600'
    },
    {
      action: 'Nouvelle catégorie créée',
      user: 'Admin',
      time: 'Il y a 3 heures',
      icon: Folder,
      color: 'text-orange-600'
    }
  ];

  const quickActions = [
    {
      title: 'Messages Contact',
      description: 'Voir les messages reçus',
      href: '/admin/messages',
      icon: MessageSquare,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Nouvel Article',
      description: 'Créer un nouveau post de blog',
      href: '/admin/blog/posts/new',
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Gérer Utilisateurs',
      description: 'Administrer les comptes utilisateurs',
      href: '/admin/users',
      icon: Users,
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
      title="Welcome back, Jenny"
      description="Here's what's happening with your store today"
      actions={
        <Link href="/admin/blog/posts/new">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Article
          </Button>
        </Link>
      }
    >
      <div className="space-y-8 bg-gray-50 min-h-screen p-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainStats.map((stat, index) => (
            <Card key={stat.title} className={`${stat.color} border-2 hover:shadow-lg transition-all duration-300`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <stat.icon className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">{stat.description}</p>
                  <Badge
                    className={`${
                      stat.changeType === 'increase'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    } font-semibold`}
                  >
                    {stat.changeType === 'increase' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Statistiques Rapides</CardTitle>
              <CardDescription className="text-gray-600">Aperçu des métriques importantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickStats.map((item, index) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {item.value}/{item.total}
                    </span>
                  </div>
                  <Progress
                    value={item.progress}
                    className="h-2 bg-gray-100"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Activité Récente</CardTitle>
              <CardDescription className="text-gray-600">Dernières actions sur la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">par {activity.user}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Link key={action.href} href={action.href}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer group">
                    <div className={`p-2 rounded-lg ${action.color} transition-colors`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 group-hover:text-gray-700 text-sm">
                        {action.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
