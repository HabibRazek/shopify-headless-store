'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  FileText, 
  Calendar,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: 'Visiteurs Uniques',
      value: '2,847',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Pages Vues',
      value: '8,234',
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: Eye,
      color: 'text-green-600'
    },
    {
      title: 'Articles Lus',
      value: '1,456',
      change: '+23.1%',
      changeType: 'increase' as const,
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      title: 'Temps Moyen',
      value: '3m 24s',
      change: '-2.4%',
      changeType: 'decrease' as const,
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  const topPages = [
    { page: '/blog/emballage-ecologique', views: 1234, percentage: 85 },
    { page: '/blog/tendances-packaging', views: 987, percentage: 68 },
    { page: '/produits/doypacks', views: 756, percentage: 52 },
    { page: '/blog/design-packaging', views: 543, percentage: 37 },
    { page: '/contact', views: 432, percentage: 30 }
  ];

  const deviceStats = [
    { device: 'Desktop', percentage: 45, icon: Monitor, color: 'bg-blue-500' },
    { device: 'Mobile', percentage: 38, icon: Smartphone, color: 'bg-green-500' },
    { device: 'Tablet', percentage: 17, icon: Tablet, color: 'bg-purple-500' }
  ];

  const recentActivity = [
    { action: 'Nouvelle visite', page: '/blog/emballage-ecologique', time: 'Il y a 2 min' },
    { action: 'Article lu', page: '/blog/tendances-packaging', time: 'Il y a 5 min' },
    { action: 'Contact formulaire', page: '/contact', time: 'Il y a 8 min' },
    { action: 'Nouvelle visite', page: '/produits/doypacks', time: 'Il y a 12 min' },
    { action: 'Article partagé', page: '/blog/design-packaging', time: 'Il y a 15 min' }
  ];

  if (loading) {
    return (
      <AdminLayout title="Statistiques" description="Analysez les performances de votre site">
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Statistiques"
      description="Analysez les performances et l'engagement de votre site"
    >
      <div className="space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={`text-xs font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs période précédente</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Pages Populaires
              </CardTitle>
              <CardDescription>
                Les pages les plus visitées cette semaine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div key={page.page} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {page.page}
                      </span>
                      <span className="text-sm text-gray-500">
                        {page.views.toLocaleString()} vues
                      </span>
                    </div>
                    <Progress value={page.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-green-600" />
                Appareils
              </CardTitle>
              <CardDescription>
                Répartition par type d'appareil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceStats.map((device) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${device.color}`}>
                        <device.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">{device.device}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{device.percentage}%</span>
                      <div className="w-16">
                        <Progress value={device.percentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-600" />
              Activité Récente
            </CardTitle>
            <CardDescription>
              Dernières interactions sur votre site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.page}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">💡 Conseils d'Optimisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900">Améliorer l'Engagement</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Ajoutez plus de contenu interactif</li>
                  <li>• Optimisez la vitesse de chargement</li>
                  <li>• Créez des call-to-action clairs</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900">Optimisation Mobile</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 38% de vos visiteurs sont sur mobile</li>
                  <li>• Testez l'expérience mobile régulièrement</li>
                  <li>• Optimisez les images pour mobile</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
