'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Tablet,
  RefreshCw,
  Download,
  Filter,
  Activity
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
      color: 'text-blue-600',
      description: 'Visiteurs uniques cette période'
    },
    {
      title: 'Pages Vues',
      value: '8,234',
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: Eye,
      color: 'text-green-600',
      description: 'Total des pages consultées'
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
    <AdminLayout>
      <div className="space-y-4 max-w-full overflow-hidden">
        {/* Professional Page Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-4 sm:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] rounded-lg flex items-center justify-center shadow-lg">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Statistiques</h1>
                </div>
                <p className="text-gray-600 text-sm sm:text-lg">Analysez les performances et l'engagement de votre site</p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40 border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Dernières 24h</SelectItem>
                    <SelectItem value="7d">7 derniers jours</SelectItem>
                    <SelectItem value="30d">30 derniers jours</SelectItem>
                    <SelectItem value="90d">90 derniers jours</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-gray-800 hover:to-[#9BC70A] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={stat.title} className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center">
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs période précédente</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Pages Chart */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#B4E50D]" />
                  Pages les Plus Visitées
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {timeRange === '7d' ? '7 jours' : timeRange === '30d' ? '30 jours' : timeRange}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{page.page}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={page.percentage} className="flex-1 h-2" />
                            <span className="text-xs text-gray-500 w-12">{page.percentage}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-semibold text-gray-900">{page.views.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">vues</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Statistics */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Monitor className="h-5 w-5 text-[#B4E50D]" />
                Répartition par Appareil
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {deviceStats.map((device) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] rounded-lg flex items-center justify-center">
                        <device.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{device.device}</p>
                        <p className="text-xs text-gray-500">{device.percentage}% du trafic</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] transition-all duration-300"
                          style={{ width: `${device.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4 border-b border-gray-100">
            <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#B4E50D]" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#B4E50D] rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.page}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
