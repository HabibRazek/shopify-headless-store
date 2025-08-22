'use client';

import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import OrderDetailsDrawer from './OrderDetailsDrawer';

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
}

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
  user: User | null;
  items: OrderItem[];
}

interface OrdersDataTableProps {
  className?: string;
}

const statusColors = {
  pending: 'bg-gradient-to-r from-[#B4E50D]/20 to-[#B4E50D]/30 text-[#6B7C00] border-[#B4E50D]/40 shadow-md',
  pending_payment: 'bg-gradient-to-r from-[#093FB4]/20 to-[#093FB4]/30 text-[#093FB4] border-[#093FB4]/40 shadow-md',
  confirmed: 'bg-gradient-to-r from-[#B4E50D]/20 to-[#B4E50D]/30 text-[#6B7C00] border-[#B4E50D]/40 shadow-md',
  processing: 'bg-gradient-to-r from-[#093FB4]/20 to-[#093FB4]/30 text-[#093FB4] border-[#093FB4]/40 shadow-md',
  completed: 'bg-gradient-to-r from-[#B4E50D]/25 to-[#B4E50D]/35 text-[#6B7C00] border-[#B4E50D]/50 shadow-lg font-semibold',
  cancelled: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300 shadow-md',
  refunded: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300 shadow-md',
};

const statusLabels = {
  pending: 'En attente',
  pending_payment: 'Paiement en attente',
  confirmed: 'Confirmée',
  processing: 'En traitement',
  completed: 'Terminée',
  cancelled: 'Annulée',
  refunded: 'Remboursée',
};

export default function OrdersDataTable({ className }: OrdersDataTableProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<Record<string, number>>({});

  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, [currentPage, search, statusFilter, sortBy, sortOrder]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search,
        status: statusFilter === 'all' ? '' : statusFilter,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/admin/orders?${params}`);
      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      setOrders(data.orders);
      setTotalPages(data.pagination.totalPages);
      setTotalCount(data.pagination.totalCount);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const syncShopifyOrders = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/admin/orders/sync', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to sync orders');

      const data = await response.json();
      toast.success(`${data.stats.totalSynced} commandes synchronisées avec succès`);
      fetchOrders(); // Refresh the table
    } catch (error) {
      console.error('Error syncing orders:', error);
      toast.error('Erreur lors de la synchronisation');
    } finally {
      setSyncing(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      const result = await response.json();

      if (result.shopifyUpdated) {
        toast.success('Statut mis à jour dans Shopify et localement');
      } else {
        toast.success('Statut mis à jour localement');
      }

      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: currency || 'TND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="h-4 w-4" />;
    return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailsDrawerOpen(true);
  };

  const handleCloseDetailsDrawer = () => {
    setIsDetailsDrawerOpen(false);
    setSelectedOrderId(null);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(stats).map(([status, count]) => {
          const borderColors = {
            pending: 'border-l-[#B4E50D]',
            pending_payment: 'border-l-[#093FB4]',
            confirmed: 'border-l-[#B4E50D]',
            processing: 'border-l-[#093FB4]',
            completed: 'border-l-[#B4E50D]',
            cancelled: 'border-l-red-400',
            refunded: 'border-l-gray-400',
          };


          return (
            <Card key={status} className={`border-l-4 ${borderColors[status as keyof typeof borderColors] || 'border-l-gray-400'} shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-gray-50/50`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {statusLabels[status as keyof typeof statusLabels] || status}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                  <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100'}>
                    {count}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>


      <Card className="shadow-lg border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-white to-gray-50/30">
        <CardHeader className="bg-gradient-to-r from-[#B4E50D]/5 to-[#093FB4]/5 border-b border-[#093FB4]/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-[#B4E50D] to-[#093FB4] rounded-full"></div>
              Gestion des Commandes ({totalCount})
            </CardTitle>
            <div className="flex gap-3">
              <Button
                onClick={syncShopifyOrders}
                disabled={syncing}
                className="bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-gray-800 hover:to-[#9BC70A] text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 font-semibold"
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
                Synchroniser Shopify
              </Button>
              <Button
                variant="outline"
                className="bg-gradient-to-r from-[#093FB4]/10 to-[#093FB4]/20 border-[#093FB4]/30 text-[#093FB4] hover:from-[#093FB4]/20 hover:to-[#093FB4]/30 hover:border-[#093FB4]/50 shadow-md hover:shadow-lg transition-all duration-300 font-medium"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par numéro, client, ville..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value === 'all' ? '' : value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          <div className="border-2 border-[#093FB4]/20 rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-white to-gray-50/50">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#B4E50D]/10 via-[#093FB4]/10 to-[#B4E50D]/10 border-b-2 border-[#093FB4]/30">
                  <TableHead
                    className="cursor-pointer hover:bg-gradient-to-r hover:from-[#B4E50D]/20 hover:to-[#093FB4]/20 transition-all duration-300 font-semibold text-gray-800"
                    onClick={() => handleSort('orderNumber')}
                  >
                    <div className="flex items-center gap-2">
                      Commande
                      {getSortIcon('orderNumber')}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-800">Client</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gradient-to-r hover:from-[#B4E50D]/20 hover:to-[#093FB4]/20 transition-all duration-300 font-semibold text-gray-800"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center gap-2">
                      Total
                      {getSortIcon('total')}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-800">Statut</TableHead>
                  <TableHead className="font-semibold text-gray-800">Livraison</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gradient-to-r hover:from-[#B4E50D]/20 hover:to-[#093FB4]/20 transition-all duration-300 font-semibold text-gray-800"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      {getSortIcon('createdAt')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-800">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7}>
                        <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Aucune commande trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gradient-to-r hover:from-[#B4E50D]/5 hover:to-[#093FB4]/5 transition-all duration-300 border-b border-gray-100 hover:border-[#093FB4]/20">
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-1 h-4 bg-gradient-to-b from-[#B4E50D] to-[#093FB4] rounded-full"></span>
                            #{order.orderNumber}
                          </p>
                          {order.shopifyOrderId && (
                            <span className="text-xs text-[#093FB4] bg-gradient-to-r from-[#093FB4]/10 to-[#093FB4]/20 px-2 py-0.5 rounded-full inline-block w-fit mt-1 font-medium border border-[#093FB4]/30">
                              Shopify
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={order.user?.image || ''} />
                            <AvatarFallback className="bg-gray-100 text-gray-700">
                              {order.user?.name?.charAt(0)?.toUpperCase() || 'G'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.user?.name || 'Client invité'}
                            </p>
                            <p className="text-sm text-gray-500">{order.user?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(order.total, order.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100'}>
                          {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.shippingCity && (
                            <p className="text-gray-900">{order.shippingCity}</p>
                          )}
                          {order.shippingCountry && (
                            <p className="text-gray-500">{order.shippingCountry}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-gradient-to-r hover:from-[#B4E50D]/20 hover:to-[#093FB4]/20 hover:text-[#093FB4] transition-all duration-300 rounded-lg shadow-sm hover:shadow-md"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(order.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {Object.entries(statusLabels).map(([status, label]) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={() => handleStatusChange(order.id, status)}
                                disabled={order.status === status}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Marquer comme {label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">
                Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, totalCount)} sur {totalCount} commandes
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-gradient-to-r from-[#B4E50D]/10 to-[#B4E50D]/20 border-[#B4E50D]/30 text-[#6B7C00] hover:from-[#B4E50D]/20 hover:to-[#B4E50D]/30 hover:border-[#B4E50D]/50 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Button>
                <span className="text-sm font-semibold px-4 py-2 bg-gradient-to-r from-[#B4E50D]/20 to-[#B4E50D]/30 text-[#6B7C00] rounded-lg shadow-md border border-[#B4E50D]/40">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="bg-gradient-to-r from-[#B4E50D]/10 to-[#B4E50D]/20 border-[#B4E50D]/30 text-[#6B7C00] hover:from-[#B4E50D]/20 hover:to-[#B4E50D]/30 hover:border-[#B4E50D]/50 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>


      <OrderDetailsDrawer
        orderId={selectedOrderId}
        isOpen={isDetailsDrawerOpen}
        onClose={handleCloseDetailsDrawer}
      />
    </div>
  );
}
