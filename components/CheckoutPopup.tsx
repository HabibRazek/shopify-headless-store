'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingBag,
  CreditCard,
  Truck,
  Check,
  Loader2,
  MapPin,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutPopup({ isOpen, onClose }: CheckoutPopupProps) {
  const { data: session } = useSession();
  const { cartItems, clearCart, cartTotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Delivery fee
  const deliveryFee = 8;
  const totalWithDelivery = cartTotal + deliveryFee;

  // Load user data if logged in
  useEffect(() => {
    if (session?.user && isOpen) {
      setFormData(prev => ({
        ...prev,
        firstName: session.user.name?.split(' ')[0] || '',
        lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
        email: session.user.email || '',
      }));
    }
  }, [session, isOpen]);

  // Reset state when popup opens
  useEffect(() => {
    if (isOpen) {
      setOrderSuccess(false);
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName) newErrors.lastName = 'Nom requis';
    if (!formData.email) newErrors.email = 'Email requis';
    if (!formData.phone) newErrors.phone = 'Téléphone requis';
    if (!formData.address) newErrors.address = 'Adresse requise';
    if (!formData.city) newErrors.city = 'Ville requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const orderData = {
        customerInfo: {
          ...formData,
          country: 'TN',
          state: formData.city,
        },
        cart: cartItems.map(item => ({
          variantId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.imageUrl
        }))
      };

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create order');
      }

      if (!result.success) {
        throw new Error(result.error || 'Order creation failed');
      }

      // Success
      setOrderSuccess(true);
      clearCart();

      toast.success('Commande confirmée!', {
        description: 'Votre commande a été créée avec succès.',
        duration: 5000,
      });

    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Erreur', {
        description: 'Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer.',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-hidden p-0">
        <div className="flex flex-col h-full max-h-[95vh]">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Finaliser votre commande</DialogTitle>
            <DialogDescription>
              Remplissez vos informations pour passer votre commande
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">

        {!orderSuccess ? (
          <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
            {/* Order Summary - Mobile First */}
            <div className="order-1 lg:order-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingBag className="h-5 w-5" />
                    Votre commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Cart Items - Compact Mobile Layout */}
                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs sm:text-sm leading-tight line-clamp-2">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">
                              Qté: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-semibold text-sm">
                              {formatPrice(parseFloat(item.price) * item.quantity, 'TND')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Price Summary - Compact */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sous-total</span>
                        <span className="font-medium">{formatPrice(cartTotal, 'TND')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Truck className="h-3 w-3" />
                          Livraison
                        </span>
                        <span className="font-medium">{formatPrice(deliveryFee, 'TND')}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-base sm:text-lg">
                        <span>Total</span>
                        <span className="text-green-600">{formatPrice(totalWithDelivery, 'TND')}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checkout Form */}
            <div className="order-2 lg:order-2 space-y-3">
              {/* User Info Status */}
              {session?.user && (
                <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-lg">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="text-xs sm:text-sm text-green-700">
                    Connecté: {session.user.name || session.user.email}
                  </span>
                </div>
              )}

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Informations de livraison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="firstName" className="text-sm">Prénom *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`h-9 ${errors.firstName ? 'border-red-500' : ''}`}
                        placeholder="Votre prénom"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm">Nom *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`h-9 ${errors.lastName ? 'border-red-500' : ''}`}
                        placeholder="Votre nom"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`h-9 pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="votre@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm">Téléphone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`h-9 pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="+216 XX XXX XXX"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-sm">Adresse complète *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`h-9 pl-10 ${errors.address ? 'border-red-500' : ''}`}
                        placeholder="Rue, numéro, appartement..."
                      />
                    </div>
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="city" className="text-sm">Ville *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`h-9 ${errors.city ? 'border-red-500' : ''}`}
                        placeholder="Votre ville"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postalCode" className="text-sm">Code postal</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="h-9"
                        placeholder="1000"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
                      <CreditCard className="h-4 w-4" />
                      Mode de paiement
                    </h3>
                    <div className="flex items-center gap-2 p-2.5 bg-white border-2 border-green-200 rounded-lg">
                      <div className="w-3 h-3 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">Paiement à la livraison</p>
                        <p className="text-xs text-gray-600">Espèces à la réception</p>
                      </div>
                      <Truck className="h-4 w-4 text-green-600 flex-shrink-0" />
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-11 text-sm font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      'Confirmer la commande'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Success State
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Commande Confirmée!
            </h2>
            <p className="text-gray-600 mb-6">
              Votre commande a été créée avec succès.
              Vous recevrez un email de confirmation sous peu.
            </p>
            <Button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Continuer vos achats
            </Button>
          </div>
        )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
