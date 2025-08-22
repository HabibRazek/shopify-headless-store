'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  MoreHorizontal,
  Plus,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AdminLayout from '@/components/admin/AdminLayout';

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
}

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 45230.50,
    totalOrders: 1247,
    totalProducts: 89,
    totalCustomers: 2847,
    revenueChange: 12.5,
    ordersChange: 8.2,
    productsChange: -2.1,
    customersChange: 15.3
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for recent orders
  const recentOrders: Order[] = [
    {
      id: 'ORD-001',
      customer: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      total: 299.99,
      status: 'delivered',
      date: '2024-01-15',
      items: 3
    },
    {
      id: 'ORD-002',
      customer: 'Jean Martin',
      email: 'jean.martin@email.com',
      total: 149.50,
      status: 'shipped',
      date: '2024-01-14',
      items: 2
    },
    {
      id: 'ORD-003',
      customer: 'Sophie Laurent',
      email: 'sophie.laurent@email.com',
      total: 89.99,
      status: 'processing',
      date: '2024-01-14',
      items: 1
    },
    {
      id: 'ORD-004',
      customer: 'Pierre Durand',
      email: 'pierre.durand@email.com',
      total: 459.99,
      status: 'pending',
      date: '2024-01-13',
      items: 5
    },
    {
      id: 'ORD-005',
      customer: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      total: 199.99,
      status: 'delivered',
      date: '2024-01-13',
      items: 2
    }
  ];

  // Chart data for revenue
  const chartData = [
    { name: 'Jan', revenue: 4000, orders: 240 },
    { name: 'Fév', revenue: 3000, orders: 198 },
    { name: 'Mar', revenue: 5000, orders: 320 },
    { name: 'Avr', revenue: 4500, orders: 280 },
    { name: 'Mai', revenue: 6000, orders: 390 },
    { name: 'Jun', revenue: 5500, orders: 350 },
    { name: 'Jul', revenue: 7000, orders: 450 }
  ];

  // Top products data
  const topProducts = [
    { name: 'Doypack Kraft Premium', sales: 245, revenue: 12250, trend: 'up' },
    { name: 'Emballage Écologique', sales: 189, revenue: 9450, trend: 'up' },
    { name: 'Sac Personnalisé', sales: 156, revenue: 7800, trend: 'down' },
    { name: 'Packaging Alimentaire', sales: 134, revenue: 6700, trend: 'up' },
    { name: 'Emballage Cosmétique', sales: 98, revenue: 4900, trend: 'up' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livré';
      case 'shipped': return 'Expédié';
      case 'processing': return 'En cours';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

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
                  <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Tableau de Bord</h1>
                </div>
                <p className="text-gray-600 text-sm sm:text-lg">Vue d'ensemble de votre boutique en ligne</p>
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

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Chiffre d'Affaires</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center">
                {stats.revenueChange > 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className={`text-sm font-medium ${
                  stats.revenueChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.revenueChange > 0 ? '+' : ''}{stats.revenueChange}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Commandes</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center">
                {stats.ordersChange > 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className={`text-sm font-medium ${
                  stats.ordersChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.ordersChange > 0 ? '+' : ''}{stats.ordersChange}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Produits</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center">
                {stats.productsChange > 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className={`text-sm font-medium ${
                  stats.productsChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.productsChange > 0 ? '+' : ''}{stats.productsChange}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Clients</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCustomers.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center">
                {stats.customersChange > 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className={`text-sm font-medium ${
                  stats.customersChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.customersChange > 0 ? '+' : ''}{stats.customersChange}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Revenue Chart */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#B4E50D]" />
                  Évolution du Chiffre d'Affaires
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {timeRange === '7d' ? '7 jours' : timeRange === '30d' ? '30 jours' : timeRange}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-[#B4E50D]/5 to-[#9BC70A]/5 rounded-lg border border-[#B4E50D]/20">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-[#B4E50D] mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Graphique des Revenus</p>
                  <p className="text-sm text-gray-500 mt-1">Données en temps réel</p>
                  <div className="mt-4 flex justify-center space-x-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#B4E50D] rounded-full"></div>
                      <span className="text-gray-600">Revenus</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-600">Commandes</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Star className="h-5 w-5 text-[#B4E50D]" />
                Produits les Plus Vendus
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sales} ventes</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{product.revenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                        <div className="flex items-center gap-1">
                          {product.trend === 'up' ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                          <span className={`text-xs ${product.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {product.trend === 'up' ? '+' : '-'}5%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Table */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-[#B4E50D]" />
                Commandes Récentes
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
                <Link href="/admin/orders">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-gray-800 hover:to-[#9BC70A] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Voir tout
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Chargement des commandes...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 bg-gray-50/50">
                      <TableHead className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Commande
                      </TableHead>
                      <TableHead className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Client
                      </TableHead>
                      <TableHead className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Statut
                      </TableHead>
                      <TableHead className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Total
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
                    {recentOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => window.open(`/admin/orders/${order.id}`, '_blank')}
                      >
                        <TableCell className="py-4 px-6">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {order.id}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.items} article{order.items > 1 ? 's' : ''}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.customer}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-center">
                          <Badge
                            variant="secondary"
                            className={`text-xs font-medium ${getStatusColor(order.status)}`}
                          >
                            {getStatusText(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            {order.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(order.date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(order.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
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
                                  window.open(`/admin/orders/${order.id}`, '_blank');
                                }}
                                className="cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle edit action
                                }}
                                className="cursor-pointer"
                              >
                                <Package className="mr-2 h-4 w-4" />
                                Modifier statut
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/orders/new">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Nouvelle Commande</h3>
                    <p className="text-sm text-gray-600">Créer une commande manuelle</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/products/new">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Nouveau Produit</h3>
                    <p className="text-sm text-gray-600">Ajouter un produit au catalogue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Voir Analytics</h3>
                    <p className="text-sm text-gray-600">Analyser les performances</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
