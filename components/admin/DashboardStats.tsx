'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  Eye,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Activity,
  Calendar,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
}

interface DashboardStatsProps {
  userStats?: {
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
  };
  blogStats?: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalViews: number;
    categories: number;
    tags: number;
  };
}

export default function DashboardStats({ userStats, blogStats }: DashboardStatsProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats: StatCard[] = [
    {
      title: 'Total Utilisateurs',
      value: userStats?.totalUsers || 0,
      change: 12.5,
      changeType: 'increase',
      icon: Users,
      description: 'Utilisateurs inscrits',
      color: 'bg-blue-500'
    },
    {
      title: 'Articles Publiés',
      value: blogStats?.publishedPosts || 0,
      change: 8.2,
      changeType: 'increase',
      icon: FileText,
      description: 'Articles en ligne',
      color: 'bg-green-500'
    },
    {
      title: 'Vues Totales',
      value: blogStats?.totalViews || 0,
      change: 23.1,
      changeType: 'increase',
      icon: Eye,
      description: 'Lectures d\'articles',
      color: 'bg-purple-500'
    },
    {
      title: 'Utilisateurs Actifs',
      value: userStats?.activeUsers || 0,
      change: -2.4,
      changeType: 'decrease',
      icon: Activity,
      description: 'Actifs ce mois',
      color: 'bg-orange-500'
    }
  ];

  const quickStats = [
    {
      label: 'Brouillons',
      value: blogStats?.draftPosts || 0,
      total: blogStats?.totalPosts || 1,
      color: 'bg-yellow-500'
    },
    {
      label: 'Catégories',
      value: blogStats?.categories || 0,
      total: 20,
      color: 'bg-indigo-500'
    },
    {
      label: 'Tags',
      value: blogStats?.tags || 0,
      total: 50,
      color: 'bg-pink-500'
    },
    {
      label: 'Admins',
      value: userStats?.adminUsers || 0,
      total: userStats?.totalUsers || 1,
      color: 'bg-red-500'
    }
  ];

  const recentActivity = [
    {
      action: 'Nouvel utilisateur inscrit',
      user: 'Marie Dubois',
      time: 'Il y a 5 minutes',
      type: 'user'
    },
    {
      action: 'Article publié',
      user: 'Admin',
      time: 'Il y a 1 heure',
      type: 'blog'
    },
    {
      action: 'Commentaire approuvé',
      user: 'Jean Martin',
      time: 'Il y a 2 heures',
      type: 'comment'
    },
    {
      action: 'Nouvelle catégorie créée',
      user: 'Admin',
      time: 'Il y a 3 heures',
      type: 'category'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-gray-500">{stat.description}</p>
                  <div className="flex items-center space-x-1">
                    {stat.changeType === 'increase' ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change > 0 ? '+' : ''}{stat.change}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Secondary Stats and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques Rapides</CardTitle>
              <CardDescription>Aperçu des métriques importantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickStats.map((item, index) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{item.label}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {item.value}/{item.total}
                    </span>
                  </div>
                  <Progress 
                    value={(item.value / item.total) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activité Récente</CardTitle>
              <CardDescription>Dernières actions sur la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'user' ? 'bg-blue-500' :
                      activity.type === 'blog' ? 'bg-green-500' :
                      activity.type === 'comment' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">par {activity.user}</p>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
