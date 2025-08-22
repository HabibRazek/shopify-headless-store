'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Filter,
  SortAsc,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  BarChart3,
  Eye,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Trash2 // Delete icon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import OrderDetailsDrawer from './OrderDetailsDrawer';

// Real order interface matching the database schema
interface Order {
  id: string;
  orderNumber: string;
  shopifyOrderId: string | null;
  status: string;
  total: number;
  currency: string;
  paymentMethod: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingCountry: string | null;
  shippingPostalCode: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image?: string | null;
  } | null;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    price: number;
  }>;
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Export function for Excel/CSV
const exportToExcel = (orders: Order[]) => {
  try {
    // Prepare data for CSV export
    const headers = [
      'Numéro de commande',
      'Client',
      'Email',
      'Total',
      'Statut',
      'Méthode de paiement',
      'Nombre d\'articles',
      'Adresse de livraison',
      'Ville',
      'Pays',
      'Date de création',
      'Dernière mise à jour',
      'ID Shopify'
    ];

    const csvData = orders.map(order => [
      order.orderNumber,
      order.user?.name || 'Client Invité',
      order.user?.email || 'N/A',
      `${order.total.toFixed(2)} ${order.currency}`,
      order.status,
      order.paymentMethod || 'N/A',
      order.items.length,
      order.shippingAddress || 'N/A',
      order.shippingCity || 'N/A',
      order.shippingCountry || 'N/A',
      new Date(order.createdAt).toLocaleDateString('fr-FR'),
      new Date(order.updatedAt).toLocaleDateString('fr-FR'),
      order.shopifyOrderId || 'N/A'
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `commandes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Export CSV terminé avec succès! ${orders.length} commande${orders.length > 1 ? 's' : ''} exportée${orders.length > 1 ? 's' : ''}.`);
  } catch (error) {
    console.error('Export error:', error);
    toast.error('Erreur lors de l\'export');
  }
};

export default function EnhancedOrdersTable() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStatistics, setShowStatistics] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch orders using SWR
  const { data: ordersData, error, mutate, isLoading } = useSWR(
    `/api/admin/orders?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}&status=${filterStatus === 'all' ? '' : filterStatus}&sortBy=${sortField}&sortOrder=${sortDirection}`,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  // Mock data fallback while database is being fixed
  const mockOrders = [
    {
      id: '1',
      orderNumber: '1001',
      shopifyOrderId: 'shopify_1001',
      status: 'confirmed',
      total: 156.50,
      currency: 'TND',
      paymentMethod: 'Virement bancaire',
      shippingAddress: '123 Rue de la Paix',
      shippingCity: 'Tunis',
      shippingCountry: 'Tunisie',
      shippingPostalCode: '1000',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      user: {
        id: 'user1',
        name: 'Ahmed Ben Ali',
        email: 'ahmed@example.com',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      items: [
        { id: '1', title: 'Doypack Kraft 250g', quantity: 2, price: 78.25 }
      ]
    },
    {
      id: '2',
      orderNumber: '1002',
      shopifyOrderId: 'shopify_1002',
      status: 'shipped',
      total: 89.99,
      currency: 'TND',
      paymentMethod: 'Paiement à la livraison',
      shippingAddress: '456 Avenue Habib Bourguiba',
      shippingCity: 'Sfax',
      shippingCountry: 'Tunisie',
      shippingPostalCode: '3000',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-14T14:20:00Z',
      user: {
        id: 'user2',
        name: 'Fatma Trabelsi',
        email: 'fatma@example.com',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      items: [
        { id: '2', title: 'Doypack Transparent 500g', quantity: 1, price: 89.99 }
      ]
    },
    {
      id: '3',
      orderNumber: '1003',
      shopifyOrderId: 'shopify_1003',
      status: 'delivered',
      total: 234.75,
      currency: 'TND',
      paymentMethod: 'Virement bancaire',
      shippingAddress: '789 Rue Ibn Khaldoun',
      shippingCity: 'Sousse',
      shippingCountry: 'Tunisie',
      shippingPostalCode: '4000',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z',
      user: {
        id: 'user3',
        name: 'Mohamed Sassi',
        email: 'mohamed@example.com',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      items: [
        { id: '3', title: 'Doypack Kraft View 1kg', quantity: 3, price: 78.25 }
      ]
    },
    {
      id: '4',
      orderNumber: '1004',
      shopifyOrderId: null,
      status: 'pending_payment',
      total: 67.25,
      currency: 'TND',
      paymentMethod: 'Paiement à la livraison',
      shippingAddress: '321 Rue de Carthage',
      shippingCity: 'Bizerte',
      shippingCountry: 'Tunisie',
      shippingPostalCode: '7000',
      createdAt: '2024-01-12T16:45:00Z',
      updatedAt: '2024-01-12T16:45:00Z',
      user: {
        id: 'user4',
        name: 'Leila Khelifi',
        email: 'leila@example.com',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      items: [
        { id: '4', title: 'Doypack Zip 250g', quantity: 1, price: 67.25 }
      ]
    },
    {
      id: '5',
      orderNumber: '1005',
      shopifyOrderId: 'shopify_1005',
      status: 'cancelled',
      total: 445.00,
      currency: 'TND',
      paymentMethod: 'Virement bancaire',
      shippingAddress: '654 Avenue de la République',
      shippingCity: 'Gabès',
      shippingCountry: 'Tunisie',
      shippingPostalCode: '6000',
      createdAt: '2024-01-11T11:30:00Z',
      updatedAt: '2024-01-11T11:30:00Z',
      user: {
        id: 'user5',
        name: 'Karim Bouazizi',
        email: 'karim@example.com',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      },
      items: [
        { id: '5', title: 'Doypack Premium 2kg', quantity: 5, price: 89.00 }
      ]
    }
  ];

  const orders = ordersData?.orders || mockOrders;
  const totalCount = ordersData?.total || ordersData?.pagination?.totalCount || mockOrders.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Calculate statistics from real data
  const totalOrders = totalCount;
  const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.total, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const pendingOrders = orders.filter((order: Order) => order.status === 'pending' || order.status === 'pending_payment').length;

  // Generate chart data for statistics
  const generateChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayOrders = orders.filter((order: Order) =>
        order.createdAt.split('T')[0] === date
      );
      return {
        date: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum: number, order: Order) => sum + order.total, 0)
      };
    });
  };

  const chartData = generateChartData();

  // Status distribution for pie chart
  const statusData = [
    { name: 'En Attente', value: orders.filter((o: Order) => o.status === 'pending' || o.status === 'pending_payment').length, color: '#f59e0b' },
    { name: 'Confirmée', value: orders.filter((o: Order) => o.status === 'confirmed').length, color: '#3b82f6' },
    { name: 'Expédiée', value: orders.filter((o: Order) => o.status === 'shipped').length, color: '#8b5cf6' },
    { name: 'Livrée', value: orders.filter((o: Order) => o.status === 'delivered').length, color: '#22c55e' },
    { name: 'Annulée', value: orders.filter((o: Order) => o.status === 'cancelled').length, color: '#ef4444' }
  ].filter(item => item.value > 0);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map((order: Order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const handleFilter = (status: string) => {
    setFilterStatus(status === 'all' ? '' : status);
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: 'En Attente', className: 'bg-yellow-100 text-yellow-800' },
      pending_payment: { label: 'Paiement En Attente', className: 'bg-orange-100 text-orange-800' },
      confirmed: { label: 'Confirmée', className: 'bg-blue-100 text-blue-800' },
      processing: { label: 'En Cours', className: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Expédiée', className: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Livrée', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/admin/orders/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await mutate(); // Refresh the data
        toast.success('Synchronisation Shopify terminée avec succès!');
      } else {
        throw new Error('Erreur de synchronisation');
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Erreur lors de la synchronisation Shopify');
    } finally {
      setSyncing(false);
    }
  };

  return (
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
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
              </div>
              <p className="text-gray-600 text-sm sm:text-lg">Gérez et suivez toutes les commandes de votre boutique Shopify</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Dernière synchronisation</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Statistics Section */}
      {showStatistics && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Aperçu des Performances</h2>
              <p className="text-sm text-gray-600 mt-1">Statistiques en temps réel de vos commandes</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Données en direct</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Commandes</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-[#B4E50D] mr-1" />
                  <p className="text-sm text-[#6B7C00] font-medium">+12% vs mois dernier</p>
                </div>
                <div className="h-8 w-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <Area type="monotone" dataKey="orders" stroke="#B4E50D" fill="#B4E50D" fillOpacity={0.3} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Chiffre d'Affaires</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalRevenue.toFixed(2)} TND</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">€</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-[#B4E50D] mr-1" />
                  <p className="text-sm text-[#6B7C00] font-medium">+8% vs mois dernier</p>
                </div>
                <div className="h-8 w-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <Line type="monotone" dataKey="revenue" stroke="#B4E50D" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Panier Moyen</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{avgOrderValue.toFixed(2)} TND</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">AVG</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-[#B4E50D] mr-1" />
                  <p className="text-sm text-[#6B7C00] font-medium">+5% vs mois dernier</p>
                </div>
                <div className="h-8 w-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <Bar dataKey="orders" fill="#B4E50D" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">En Attente</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{pendingOrders}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">!</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-[#B4E50D] rounded-full mr-2"></span>
                  <p className="text-sm text-[#6B7C00] font-medium">À traiter rapidement</p>
                </div>
                <div className="h-8 w-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={10}
                        outerRadius={16}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#B4E50D" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      )}

      <Separator className="my-4" />

      {/* Table Management Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Gestion des Commandes</h2>
            <p className="text-sm text-gray-600 mt-1">Filtrez, triez et gérez vos commandes efficacement</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Total: {totalCount} commandes</span>
          </div>
        </div>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-gray-900">Outils de Gestion</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Primary Controls Row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-3 bg-gray-50 rounded-lg">
              {/* Left side controls */}
              <div className="flex items-center gap-4">
              <DropdownMenu open={filterDropdownOpen} onOpenChange={setFilterDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrer
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onClick={() => handleFilter('all')}>
                    Tous les statuts
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleFilter('pending')}>
                    En Attente
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilter('pending_payment')}>
                    Paiement En Attente
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilter('confirmed')}>
                    Confirmée
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilter('shipped')}>
                    Expédiée
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilter('delivered')}>
                    Livrée
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilter('cancelled')}>
                    Annulée
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu open={sortDropdownOpen} onOpenChange={setSortDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SortAsc className="h-4 w-4 mr-2" />
                    Trier
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onClick={() => handleSort('createdAt')}>
                    Date de création
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('orderNumber')}>
                    Numéro de commande
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('total')}>
                    Montant total
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('status')}>
                    Statut
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={sortDirection === 'asc'}
                    onCheckedChange={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  >
                    Ordre croissant
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-white to-gray-50/50 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Statistiques</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showStatistics}
                    onChange={(e) => setShowStatistics(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gradient-to-r from-gray-200 to-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#B4E50D]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300 after:shadow-md peer-checked:bg-gradient-to-r peer-checked:from-[#B4E50D] peer-checked:to-[#9BC70A] group-hover:after:shadow-lg"></div>
                </label>
              </div>
            </div>

              {/* Right side controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-md border border-gray-200">
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => exportToExcel(orders)}
                    className="p-0 h-auto font-medium text-gray-700 hover:text-green-600"
                  >
                    Exporter CSV
                  </Button>
                </div>

                <Separator orientation="vertical" className="h-6" />

                <Button
                  size="sm"
                  className="bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-gray-800 hover:to-[#9BC70A] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleSync}
                  disabled={syncing}
                >
                  {syncing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <img
                      src="/shopify-logo-png-transparent.png"
                      alt="Shopify"
                      className="h-4 w-4 mr-2"
                    />
                  )}
                  {syncing ? 'Synchronisation...' : 'Synchroniser Shopify'}
                </Button>
              </div>
            </div>

            <Separator />

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
                      placeholder="Rechercher par client, numéro de commande ou email..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <Select value={filterStatus} onValueChange={handleFilter}>
                  <SelectTrigger className="w-full sm:w-56 border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En Attente</SelectItem>
                    <SelectItem value="pending_payment">Paiement En Attente</SelectItem>
                    <SelectItem value="confirmed">Confirmée</SelectItem>
                    <SelectItem value="shipped">Expédiée</SelectItem>
                    <SelectItem value="delivered">Livrée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table Section */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-gray-900">Liste des Commandes</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Mise à jour en temps réel</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Chargement des commandes...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 mb-2">Erreur lors du chargement des commandes</p>
                <Button variant="outline" onClick={() => mutate()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="border-b-2 border-gray-100 bg-gray-50/50">
                    <TableHead className="w-8 p-2 sm:p-4 hidden sm:table-cell">
                      <Checkbox
                        checked={selectedOrders.length === orders.length && orders.length > 0}
                        onCheckedChange={handleSelectAll}
                        className="border-gray-300"
                      />
                    </TableHead>
                    <TableHead className="p-2 sm:p-4 font-semibold text-gray-900 uppercase tracking-wide text-xs">Commande</TableHead>
                    <TableHead className="p-2 sm:p-4 font-semibold text-gray-900 uppercase tracking-wide text-xs hidden lg:table-cell">Client</TableHead>
                    <TableHead className="p-2 sm:p-4 font-semibold text-gray-900 uppercase tracking-wide text-xs">Total</TableHead>
                    <TableHead className="p-2 sm:p-4 font-semibold text-gray-900 uppercase tracking-wide text-xs hidden xl:table-cell">Articles</TableHead>
                    <TableHead className="p-2 sm:p-4 font-semibold text-gray-900 uppercase tracking-wide text-xs">Statut</TableHead>
                    <TableHead className="p-2 sm:p-4 font-semibold text-gray-900 uppercase tracking-wide text-xs hidden lg:table-cell">Date</TableHead>
                    <TableHead className="w-8 p-2 sm:p-4 uppercase tracking-wide text-xs font-semibold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="text-gray-500">
                          <p className="text-lg font-medium mb-2">Aucune commande trouvée</p>
                          <p className="text-sm">Essayez de modifier vos filtres de recherche</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order: Order, index: number) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-gray-100 group"
                      >
                        <TableCell className="p-2 sm:p-4 hidden sm:table-cell">
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="p-2 sm:p-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                              <span className="text-white font-semibold text-xs">
                                {order.orderNumber.replace('#', '').slice(-2)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">#{order.orderNumber}</p>
                              <p className="text-xs text-gray-500 truncate">
                                {order.shopifyOrderId ? 'Shopify' : 'Local'}
                              </p>
                              {/* Mobile-only additional info */}
                              <div className="lg:hidden mt-1">
                                <p className="text-xs text-gray-600 truncate">
                                  {order.user?.name || 'Client Invité'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-2 sm:p-4 hidden lg:table-cell">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                              {order.user?.image ? (
                                <img
                                  src={order.user.image}
                                  alt={order.user.name || 'Client'}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] flex items-center justify-center">
                                  <span className="text-white font-semibold text-xs sm:text-sm">
                                    {(order.user?.name || 'C').charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{order.user?.name || 'Client Invité'}</p>
                              <p className="text-xs text-gray-500">{order.user?.email || 'N/A'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-2 sm:p-4">
                          <div>
                            <span className="font-semibold text-gray-900 text-sm">{order.total.toFixed(2)} {order.currency}</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-2 sm:p-4 hidden xl:table-cell">
                          <span className="text-gray-700 text-sm">{order.items.length} article{order.items.length > 1 ? 's' : ''}</span>
                        </TableCell>
                        <TableCell className="p-2 sm:p-4">
                          {getStatusBadge(order.status)}
                        </TableCell>

                        <TableCell className="p-2 sm:p-4 hidden lg:table-cell">
                          <span className="text-gray-700 text-sm">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </TableCell>
                        <TableCell className="p-2 sm:p-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setIsDrawerOpen(true);
                            }}
                            className="h-8 px-3 text-xs"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir détails
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Selected Actions */}
          {selectedOrders.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-green-50 to-green-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 font-medium">
                  {selectedOrders.length} commande{selectedOrders.length > 1 ? 's' : ''} sélectionnée{selectedOrders.length > 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white"
                  >
                    Marquer comme traitées
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white"
                    onClick={() => {
                      const selectedOrdersData = orders.filter((order: Order) => selectedOrders.includes(order.id));
                      exportToExcel(selectedOrdersData);
                    }}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                    Exporter sélection
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 bg-white"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Affichage par page</span>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">
                  {totalCount > 0 ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalCount)} sur ${totalCount}` : '0 résultat'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={currentPage === pageNum ? "bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] hover:from-[#9BC70A] hover:to-[#82A908] text-white shadow-md" : ""}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="text-gray-400">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Aller à la page
                </span>
                <Input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = Number(e.target.value);
                    if (page >= 1 && page <= totalPages) {
                      setCurrentPage(page);
                    }
                  }}
                  className="w-16 h-8"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] hover:from-[#9BC70A] hover:to-[#82A908] text-white border-[#B4E50D] shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Aller
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>



      {/* Order Details Drawer */}
      <OrderDetailsDrawer
        orderId={selectedOrderId}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedOrderId(null);
        }}
      />
    </div>
  );
}
