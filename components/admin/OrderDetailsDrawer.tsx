"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader } from '@/components/ui/loader';
import { motion } from "motion/react";
import {
  Package,
  User,
  MapPin,
  Copy,
  X,
  Phone,
  Mail
} from "lucide-react";
import { toast } from 'sonner';

interface OrderDetailsDrawerProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  shopifyOrderId?: string;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
    image?: string;
  };
  shippingAddress?: {
    firstName?: string;
    lastName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
  };
  orderItems?: Array<{
    id: string;
    productTitle: string;
    variantTitle?: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
}

const drawerVariants = {
  hidden: {
    y: "100%",
    opacity: 0,
    rotateX: 5,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      mass: 0.8,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    y: 20,
    opacity: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
  },
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800 border-gray-200',
  confirmed: 'bg-gray-100 text-gray-800 border-gray-200',
  processing: 'bg-gray-200 text-gray-900 border-gray-300',
  shipped: 'bg-gray-200 text-gray-900 border-gray-300',
  delivered: 'bg-gray-900 text-white border-gray-900',
  completed: 'bg-gray-900 text-white border-gray-900',
  cancelled: 'bg-gray-300 text-gray-700 border-gray-400',
  refunded: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusLabels = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  processing: 'En traitement',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  completed: 'Terminée',
  cancelled: 'Annulée',
  refunded: 'Remboursée',
};

export default function OrderDetailsDrawer({ orderId, isOpen, onClose }: OrderDetailsDrawerProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch order details');
      }

      const data = await response.json();
      console.log('Order data received:', data); // Debug log

      // Handle both nested and direct response formats
      const orderData = data.order || data;
      setOrder(orderData);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement');
      toast.error('Erreur lors du chargement des détails de la commande');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId && isOpen) {
      fetchOrderDetails();
    }
  }, [orderId, isOpen, fetchOrderDetails]);

  const copyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      toast.success('Numéro de commande copié!');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date non disponible';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date invalide';

    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number, currency: string = 'TND') => {
    if (isNaN(price) || price === null || price === undefined) return '0,00 DT';

    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: currency === 'TND' ? 'TND' : 'EUR',
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-2xl mx-auto max-h-[90vh] overflow-hidden">
        <motion.div
          variants={drawerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col h-full"
        >
          <motion.div variants={itemVariants}>
            <DrawerHeader className="border-b bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gray-100 rounded-md">
                    <Package className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <DrawerTitle className="text-lg font-semibold text-gray-900">
                      Détails de la commande
                    </DrawerTitle>
                    {order && (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-gray-600 text-xs">#{order.orderNumber}</span>
                        <Badge className={`text-xs ${statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100'}`}>
                          {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
                <DrawerClose asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <X className="h-3 w-3" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>
          </motion.div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-32 space-y-3">
                <Loader size="md" />
                <p className="text-xs text-gray-500 animate-pulse">Chargement des détails...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-32 space-y-3">
                <div className="text-red-500">
                  <Loader size="md" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-red-600 font-medium">Erreur de chargement</p>
                  <p className="text-xs text-gray-500 mt-1">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchOrderDetails()}
                    className="mt-2 text-xs border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Réessayer
                  </Button>
                </div>
              </div>
            ) : order ? (
              <motion.div variants={itemVariants} className="space-y-3">
                {/* Compact Order Summary */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Résumé de la commande</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Numéro:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">#{order.orderNumber}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={copyOrderNumber}
                        >
                          <Copy className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Total:</span>
                      <span className="font-medium text-green-600">{formatPrice(order.total, order.currency)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Date:</span>
                      <span className="font-medium">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Statut:</span>
                      <Badge className={`text-xs ${statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100'}`}>
                        {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Compact Customer Information */}
                {order.user && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Informations client</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={order.user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${order.user.name || order.user.email}`} />
                        <AvatarFallback className="text-xs">
                          {order.user.name?.charAt(0) || order.user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        {order.user.name && (
                          <p className="text-sm font-medium text-gray-900 truncate">{order.user.name}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          {order.user.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{order.user.email}</span>
                            </div>
                          )}
                          {order.user.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{order.user.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Compact Shipping Address */}
                {order.shippingAddress && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Adresse de livraison</span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p className="font-medium text-gray-900">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p>{order.shippingAddress.address1}</p>
                      {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>
                )}

                {/* Compact Order Items */}
                {order.orderItems && order.orderItems.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Articles commandés ({order.orderItems.length})</span>
                    </div>
                    <div className="space-y-2">
                      {order.orderItems.map((item, index) => (
                        <div key={item.id || index} className="flex items-center gap-2 p-2 bg-white rounded border">
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.productTitle}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <Package className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">{item.productTitle}</p>
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>Qté: {item.quantity}</span>
                              <span>{formatPrice(item.price, order.currency)}</span>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-gray-900">
                            {formatPrice(item.price * item.quantity, order.currency)}
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-900">Total</span>
                          <span className="text-sm font-bold text-gray-900">{formatPrice(order.total, order.currency)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="mb-2">
                      <Loader size="sm" />
                    </div>
                    <p className="text-xs text-gray-500">Aucun article trouvé</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 space-y-3">
                <Loader size="md" />
                <p className="text-xs text-gray-500">Commande non trouvée</p>
              </div>
            )}
          </div>

          {/* Compact Footer */}
          {order && (
            <motion.div variants={itemVariants}>
              <DrawerFooter className="border-t bg-white px-4 py-3">
                <div className="flex justify-end">
                  <DrawerClose asChild>
                    <Button className="group text-xs bg-gray-900 hover:bg-gray-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden px-4 py-2">
                      <span className="relative z-10">Fermer</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerFooter>
            </motion.div>
          )}
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
}
