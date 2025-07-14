'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  ChevronRight,
  ShoppingBag,
  RefreshCw,
  Download,
  Star,
  XCircle,
  Loader2,
  FileImage,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InlineLoader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt?: string;
  shopifyOrderId?: string;
  paymentMethod?: string;
  bankReceiptPath?: string;
  items: OrderItem[];
  shippingAddress?: string;
  shippingCity?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
}

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrdersHistoryProps {
  className?: string;
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function OrdersHistory({ className }: OrdersHistoryProps) {
  const { data: session } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Use SWR for data fetching with automatic deduplication
  const { data: ordersData, error, isLoading, mutate } = useSWR(
    session?.user ? '/api/user/orders' : null,
    fetcher,
    {
      refreshInterval: 0, // Disable automatic refresh
      revalidateOnFocus: false, // Disable revalidation on focus
      revalidateOnReconnect: false, // Disable revalidation on reconnect
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
    }
  );

  const orders = ordersData?.orders || [];

  // Debug logging
  console.log('🔍 OrdersHistory Debug:', {
    isLoading,
    hasOrdersData: !!ordersData,
    ordersCount: orders.length,
    orders: orders.map((o: Order) => ({ id: o.id, orderNumber: o.orderNumber, status: o.status }))
  });

  const handleRefresh = useCallback(async () => {
    // Prevent multiple simultaneous refreshes
    if (isRefreshing) {
      toast.info('Actualisation en cours...', {
        description: 'Veuillez patienter',
      });
      return;
    }

    try {
      setIsRefreshing(true);
      toast.info('Actualisation des commandes...', {
        description: 'Synchronisation avec Shopify en cours',
      });

      // Force refresh with Shopify sync
      const response = await fetch('/api/user/orders?refresh=true');

      if (response.ok) {
        const data = await response.json();
        const newOrders = data.orders || [];



        // Update SWR cache
        mutate({ orders: newOrders }, false);
        setLastSyncTime(new Date());

        toast.success('Commandes actualisées', {
          description: `${newOrders.length} commande(s) trouvée(s)`,
        });
      } else {
        throw new Error('Failed to refresh orders');
      }
    } catch (error) {
      console.error('Error refreshing orders:', error);
      toast.error('Erreur de chargement', {
        description: 'Impossible de charger vos commandes',
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, mutate]);

  // No useEffect needed - SWR handles data fetching automatically

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'pending_payment':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'processing':
      case 'confirmed':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'shipped':
      case 'in_transit':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered':
      case 'completed':
      case 'fulfilled':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
      case 'refunded':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'on_hold':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'pending_payment':
        return 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm';
      case 'processing':
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm';
      case 'shipped':
      case 'in_transit':
        return 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm';
      case 'delivered':
      case 'completed':
      case 'fulfilled':
        return 'bg-green-50 text-green-700 border-green-200 shadow-sm';
      case 'cancelled':
      case 'refunded':
        return 'bg-red-50 text-red-700 border-red-200 shadow-sm';
      case 'on_hold':
        return 'bg-orange-50 text-orange-700 border-orange-200 shadow-sm';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 shadow-sm';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'En attente';
      case 'pending_payment':
        return 'En attente de paiement';
      case 'processing':
        return 'En cours de traitement';
      case 'confirmed':
        return 'Confirmée';
      case 'shipped':
        return 'Expédiée';
      case 'in_transit':
        return 'En transit';
      case 'delivered':
        return 'Livrée';
      case 'completed':
        return 'Terminée';
      case 'fulfilled':
        return 'Exécutée';
      case 'cancelled':
        return 'Annulée';
      case 'refunded':
        return 'Remboursée';
      case 'on_hold':
        return 'En attente';
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter((order: Order) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return ['pending', 'pending_payment', 'processing', 'confirmed'].includes(order.status.toLowerCase());
    if (filter === 'completed') return ['delivered', 'completed', 'fulfilled'].includes(order.status.toLowerCase());
    if (filter === 'cancelled') return ['cancelled', 'refunded'].includes(order.status.toLowerCase());
    return true;
  });

  if (isLoading && !ordersData) {
    return (
      <div className={className}>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12">
            <InlineLoader text="Chargement de vos commandes..." />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={className}>
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Enhanced Empty State Icon */}
              <div className="relative mx-auto w-32 h-32">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-green-200 to-emerald-200 rounded-full animate-pulse"></div>
                <div className="absolute inset-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <ShoppingBag className="h-12 w-12 text-white" />
                </div>
                {/* Floating decorative elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full opacity-70"
                />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-1 -left-3 w-4 h-4 bg-purple-500 rounded-full opacity-60"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-gray-900">Aucune commande trouvée</h3>
                <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
                  Vous n'avez pas encore passé de commande. Découvrez notre collection exceptionnelle de produits d'emballage premium !
                </p>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  onClick={() => window.location.href = '/products'}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Découvrir nos produits
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-green-200 hover:bg-green-50 text-green-700 px-8 py-4 rounded-xl font-semibold transition-all duration-200"
                  onClick={() => window.location.href = '/collections'}
                >
                  <Package className="h-5 w-5 mr-2" />
                  Voir les collections
                </Button>
              </div>

              {/* Additional Info */}
              <div className="pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Besoin d'aide ? Contactez notre équipe pour un devis personnalisé
                </p>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Professional Orders Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mes Commandes</h2>
              <p className="text-gray-600">Suivez l'état de vos commandes et consultez l'historique</p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
            title="Synchroniser avec Shopify pour vérifier les statuts des commandes"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isRefreshing ? 'Synchronisation...' : 'Actualiser'}
          </Button>
        </div>

        {/* Orders Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">
                  {orders.filter((o: Order) => ['pending', 'pending_payment', 'processing', 'confirmed'].includes(o.status.toLowerCase())).length}
                </p>
                <p className="text-sm text-gray-600">En cours</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter((o: Order) => ['delivered', 'completed', 'fulfilled'].includes(o.status.toLowerCase())).length}
                </p>
                <p className="text-sm text-gray-600">Terminées</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {orders.filter((o: Order) => ['cancelled', 'refunded'].includes(o.status.toLowerCase())).length}
                </p>
                <p className="text-sm text-gray-600">Annulées</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-lg font-semibold text-gray-900">{filteredOrders.length} commande(s) trouvée(s)</p>
              {lastSyncTime && !isRefreshing && (
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Dernière sync: {lastSyncTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { key: 'all', label: 'Toutes', count: orders.length, icon: ShoppingBag, color: 'blue' },
              { key: 'pending', label: 'En cours', count: orders.filter((o: Order) => ['pending', 'pending_payment', 'processing', 'confirmed'].includes(o.status.toLowerCase())).length, icon: Clock, color: 'amber' },
              { key: 'completed', label: 'Terminées', count: orders.filter((o: Order) => ['delivered', 'completed', 'fulfilled'].includes(o.status.toLowerCase())).length, icon: CheckCircle, color: 'green' },
              { key: 'cancelled', label: 'Annulées', count: orders.filter((o: Order) => ['cancelled', 'refunded'].includes(o.status.toLowerCase())).length, icon: XCircle, color: 'red' },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    filter === tab.key
                      ? tab.color === 'blue' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transform scale-105' :
                        tab.color === 'amber' ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg transform scale-105' :
                        tab.color === 'green' ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg transform scale-105' :
                        'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    filter === tab.key
                      ? 'bg-white/20 text-white'
                      : tab.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                        tab.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                        tab.color === 'green' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {filteredOrders.map((order: Order, index: number) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 group bg-gradient-to-r from-white to-gray-50/50">
                    <CardContent className="p-6">
                      {/* Enhanced Order Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center group-hover:shadow-md transition-shadow">
                              {getStatusIcon(order.status)}
                            </div>
                            <div>
                              <Badge className={`${getStatusColor(order.status)} px-4 py-2 font-semibold text-sm`}>
                                {getStatusText(order.status)}
                              </Badge>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="font-bold text-lg text-gray-900">
                                  #{order.orderNumber || order.id.slice(-8)}
                                </span>
                                {order.shopifyOrderId && (
                                  <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                                    <ExternalLink className="h-3 w-3" />
                                    Shopify
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600 mb-1">
                            {formatPrice(order.total, order.currency || 'TND')}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 justify-end">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Enhanced Order Details */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-200">
                            <Package className="h-4 w-4" />
                            <span className="font-medium">{order.items?.length || 0} article(s)</span>
                          </div>
                          {order.paymentMethod && (
                            <div className="flex items-center gap-2 text-sm bg-gray-50 text-gray-700 px-3 py-2 rounded-lg border border-gray-200">
                              <CreditCard className="h-4 w-4" />
                              <span className="font-medium">{order.paymentMethod}</span>
                            </div>
                          )}
                          {order.bankReceiptPath && (
                            <div className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200">
                              <FileImage className="h-4 w-4" />
                              <span className="font-medium">Reçu joint</span>
                            </div>
                          )}
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => setSelectedOrder(order)}
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader className="border-b pb-4">
                              <DialogTitle className="flex items-center gap-3 text-xl">
                                <div className="p-2 bg-green-100 rounded-lg">
                                  <Package className="h-5 w-5 text-green-600" />
                                </div>
                                Commande #{selectedOrder?.orderNumber || selectedOrder?.id.slice(-8)}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-6 pt-6">
                                {/* Order Status */}
                                <div className={`flex items-center gap-4 p-4 rounded-xl ${getStatusColor(selectedOrder.status).replace('border-', 'border-2 border-')}`}>
                                  <div className="p-2 bg-white rounded-lg shadow-sm">
                                    {getStatusIcon(selectedOrder.status)}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-lg">
                                      {getStatusText(selectedOrder.status)}
                                    </p>
                                    <p className="text-sm opacity-75">
                                      Commandé le {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                    </p>
                                  </div>
                                  {selectedOrder.shopifyOrderId && (
                                    <div className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-lg shadow-sm">
                                      <ExternalLink className="h-4 w-4 text-green-600" />
                                      <span className="font-medium">Shopify</span>
                                    </div>
                                  )}
                                </div>

                                {/* Payment & Receipt Info */}
                                {(selectedOrder.paymentMethod || selectedOrder.bankReceiptPath) && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedOrder.paymentMethod && (
                                      <div className="p-4 bg-gray-50 rounded-xl">
                                        <h5 className="font-semibold mb-2 flex items-center gap-2">
                                          <CreditCard className="h-4 w-4 text-gray-600" />
                                          Mode de paiement
                                        </h5>
                                        <p className="text-gray-700">{selectedOrder.paymentMethod}</p>
                                      </div>
                                    )}
                                    {selectedOrder.bankReceiptPath && (
                                      <div className="p-4 bg-green-50 rounded-xl">
                                        <h5 className="font-semibold mb-2 flex items-center gap-2 text-green-700">
                                          <FileImage className="h-4 w-4" />
                                          Justificatif de paiement
                                        </h5>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-green-600 border-green-200 hover:bg-green-100"
                                          onClick={() => window.open(selectedOrder.bankReceiptPath, '_blank')}
                                        >
                                          <Download className="h-4 w-4 mr-2" />
                                          Voir le reçu
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Order Items */}
                                <div>
                                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                                    <Package className="h-5 w-5 text-green-600" />
                                    Articles commandés ({selectedOrder.items?.length || 0})
                                  </h4>
                                  <div className="space-y-3">
                                    {selectedOrder.items?.map((item) => (
                                      <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-green-200 transition-colors">
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                                          {item.image ? (
                                            <Image
                                              src={item.image}
                                              alt={item.title}
                                              width={64}
                                              height={64}
                                              className="rounded-xl object-cover"
                                            />
                                          ) : (
                                            <Package className="h-8 w-8 text-gray-400" />
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                                          <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                                          <p className="text-sm text-gray-500">Prix unitaire: {formatPrice(item.price, selectedOrder.currency || 'TND')}</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-lg font-bold text-green-600">
                                            {formatPrice(item.price * item.quantity, selectedOrder.currency || 'TND')}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <Separator />

                                {/* Order Total */}
                                <div className="bg-green-50 p-6 rounded-xl">
                                  <div className="flex justify-between items-center text-xl font-bold">
                                    <span className="text-gray-900">Total de la commande</span>
                                    <span className="text-green-600">
                                      {formatPrice(selectedOrder.total, selectedOrder.currency || 'TND')}
                                    </span>
                                  </div>
                                </div>

                                {/* Shipping Address */}
                                {(selectedOrder.shippingAddress || selectedOrder.shippingCity) && (
                                  <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                      <MapPin className="h-5 w-5 text-green-600" />
                                      Adresse de livraison
                                    </h4>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                      {selectedOrder.shippingAddress && <p className="font-medium">{selectedOrder.shippingAddress}</p>}
                                      <p>
                                        {selectedOrder.shippingCity && selectedOrder.shippingCity}
                                        {selectedOrder.shippingPostalCode && ` ${selectedOrder.shippingPostalCode}`}
                                      </p>
                                      {selectedOrder.shippingCountry && <p className="text-gray-600">{selectedOrder.shippingCountry}</p>}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
