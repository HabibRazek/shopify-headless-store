'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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

export function OrdersHistory({ className }: OrdersHistoryProps) {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const fetchOrders = async (forceRefresh = false, showRefreshToast = false, isAutoSync = false) => {
    if (!session?.user) return;

    try {
      if (showRefreshToast) {
        setIsRefreshing(true);
        toast.info('Actualisation des commandes...', {
          description: 'Synchronisation avec Shopify en cours',
        });
      } else if (isAutoSync) {
        setIsAutoSyncing(true);
      }

      // Use refresh parameter only when explicitly requested
      const refreshParam = forceRefresh ? '?refresh=true' : '';
      const response = await fetch(`/api/user/orders${refreshParam}`);

      if (response.ok) {
        const data = await response.json();
        const newOrders = data.orders || [];

        // Check if any orders have updated status
        const hasStatusUpdates = orders.some(oldOrder => {
          const newOrder = newOrders.find(o => o.id === oldOrder.id);
          return newOrder && newOrder.status !== oldOrder.status;
        });

        setOrders(newOrders);
        setLastSyncTime(new Date());

        if (showRefreshToast) {
          toast.success('Commandes actualisées', {
            description: `${newOrders.length} commande(s) trouvée(s)`,
          });
        } else if (isAutoSync && hasStatusUpdates) {
          toast.success('Statut mis à jour', {
            description: 'Le statut de vos commandes a été actualisé',
          });
        }
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (showRefreshToast) {
        toast.error('Erreur de chargement', {
          description: 'Impossible de charger vos commandes',
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsAutoSyncing(false);
    }
  };

  useEffect(() => {
    // Initial load without refresh for faster loading
    fetchOrders(false, false);

    // Set up automatic refresh every 30 seconds for pending orders
    const interval = setInterval(() => {
      const hasPendingOrders = orders.some(order =>
        ['pending', 'pending_payment', 'processing', 'confirmed'].includes(order.status.toLowerCase())
      );

      if (hasPendingOrders && !isRefreshing && !isAutoSyncing) {
        console.log('🔄 Auto-refreshing orders with pending status...');
        fetchOrders(true, false, true); // Sync with Shopify, no toast, is auto-sync
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [session, orders, isRefreshing]);

  const handleRefresh = () => {
    // Force refresh with Shopify sync
    fetchOrders(true, true);
  };

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

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return ['pending', 'pending_payment', 'processing', 'confirmed'].includes(order.status.toLowerCase());
    if (filter === 'completed') return ['delivered', 'completed', 'fulfilled'].includes(order.status.toLowerCase());
    if (filter === 'cancelled') return ['cancelled', 'refunded'].includes(order.status.toLowerCase());
    return true;
  });

  if (isLoading) {
    return (
      <div className={className}>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                <Package className="absolute inset-0 m-auto h-6 w-6 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Chargement de vos commandes</h3>
                <p className="text-gray-600">Veuillez patienter...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={className}>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune commande trouvée</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Vous n'avez pas encore passé de commande. Découvrez notre collection de produits d'emballage !
                </p>
              </div>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                onClick={() => window.location.href = '/products'}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Découvrir nos produits
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Mes Commandes</h2>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-gray-600 font-normal">{filteredOrders.length} commande(s) trouvée(s)</p>
                  {isAutoSyncing && (
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Synchronisation...</span>
                    </div>
                  )}
                  {lastSyncTime && !isAutoSyncing && !isRefreshing && (
                    <div className="text-xs text-gray-500">
                      Dernière sync: {lastSyncTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              </div>
            </CardTitle>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-green-200 hover:bg-green-50"
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Actualiser
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4">
            {[
              { key: 'all', label: 'Toutes', count: orders.length },
              { key: 'pending', label: 'En cours', count: orders.filter(o => ['pending', 'pending_payment', 'processing', 'confirmed'].includes(o.status.toLowerCase())).length },
              { key: 'completed', label: 'Terminées', count: orders.filter(o => ['delivered', 'completed', 'fulfilled'].includes(o.status.toLowerCase())).length },
              { key: 'cancelled', label: 'Annulées', count: orders.filter(o => ['cancelled', 'refunded'].includes(o.status.toLowerCase())).length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
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
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(order.status)}
                            <Badge className={`${getStatusColor(order.status)} px-3 py-1 font-medium`}>
                              {getStatusText(order.status)}
                            </Badge>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">
                              #{order.orderNumber || order.id.slice(-8)}
                            </span>
                            {order.shopifyOrderId && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" />
                                Shopify
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">
                            {formatPrice(order.total, order.currency || 'TND')}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 justify-end">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Package className="h-4 w-4" />
                            <span>{order.items?.length || 0} article(s)</span>
                          </div>
                          {order.paymentMethod && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <CreditCard className="h-4 w-4" />
                              <span>{order.paymentMethod}</span>
                            </div>
                          )}
                          {order.bankReceiptPath && (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <FileImage className="h-4 w-4" />
                              <span>Reçu joint</span>
                            </div>
                          )}
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              className="flex items-center gap-2 border-green-200 hover:bg-green-50 group-hover:border-green-300"
                            >
                              <Eye className="h-4 w-4" />
                              Voir détails
                              <ChevronRight className="h-4 w-4" />
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
