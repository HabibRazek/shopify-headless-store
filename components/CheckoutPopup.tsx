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
  User,
  Upload,
  X,
  FileImage
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
    paymentMethod: 'cashOnDelivery',
  });

  const [bankReceipt, setBankReceipt] = useState<File | null>(null);
  const [bankReceiptPreview, setBankReceiptPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Delivery fee
  const deliveryFee = 8;
  const totalWithDelivery = cartTotal + deliveryFee;

  // Check authentication when trying to checkout
  useEffect(() => {
    if (isOpen && !session) {
      // User is not authenticated, show message and redirect to signin
      toast.error('Connexion requise', {
        description: 'Vous devez créer un compte pour passer une commande.',
        action: {
          label: 'Se connecter',
          onClick: () => {
            onClose();
            window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname);
          }
        },
        duration: 5000,
      });
      onClose();
      return;
    }
  }, [isOpen, session, onClose]);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Format non supporté', {
          description: 'Veuillez sélectionner une image (JPG, PNG, WEBP)',
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Fichier trop volumineux', {
          description: 'La taille maximale autorisée est de 5MB',
        });
        return;
      }

      setBankReceipt(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setBankReceiptPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      toast.success('Reçu ajouté', {
        description: 'Votre justificatif de virement a été ajouté avec succès',
      });
    }
  };

  const removeBankReceipt = () => {
    setBankReceipt(null);
    setBankReceiptPreview(null);
    // Reset file input
    const fileInput = document.getElementById('bankReceipt') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
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
        paymentMethod: formData.paymentMethod,
        cart: cartItems.map(item => ({
          variantId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.imageUrl
        }))
      };

      let response;

      // If bank transfer with file, use FormData
      if (formData.paymentMethod === 'bankTransfer' && bankReceipt) {
        const formDataToSend = new FormData();
        formDataToSend.append('orderData', JSON.stringify(orderData));
        formDataToSend.append('bankReceipt', bankReceipt);

        response = await fetch('/api/order', {
          method: 'POST',
          body: formDataToSend,
        });
      } else {
        // Regular JSON request
        response = await fetch('/api/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
      }

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
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm">
                      <CreditCard className="h-4 w-4" />
                      Mode de paiement
                    </h3>
                    <div className="space-y-3">
                      <div
                        className={`flex items-center gap-2 p-2.5 bg-white border-2 rounded-lg cursor-pointer transition-colors ${
                          formData.paymentMethod === 'cashOnDelivery' ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cashOnDelivery' }))}
                      >
                        <div className={`w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0 ${
                          formData.paymentMethod === 'cashOnDelivery' ? 'bg-green-600' : 'bg-gray-300'
                        }`}>
                          {formData.paymentMethod === 'cashOnDelivery' && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">Paiement à la livraison</p>
                          <p className="text-xs text-gray-600">Espèces à la réception</p>
                        </div>
                        <Truck className="h-4 w-4 text-green-600 flex-shrink-0" />
                      </div>

                      <div
                        className={`flex items-center gap-2 p-2.5 bg-white border-2 rounded-lg cursor-pointer transition-colors ${
                          formData.paymentMethod === 'bankTransfer' ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'bankTransfer' }))}
                      >
                        <div className={`w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0 ${
                          formData.paymentMethod === 'bankTransfer' ? 'bg-green-600' : 'bg-gray-300'
                        }`}>
                          {formData.paymentMethod === 'bankTransfer' && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">Virement bancaire</p>
                          <p className="text-xs text-gray-600">Paiement par virement</p>
                        </div>
                        <CreditCard className="h-4 w-4 text-green-600 flex-shrink-0" />
                      </div>

                      {/* Bank Transfer Details */}
                      {formData.paymentMethod === 'bankTransfer' && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2 text-sm">Informations bancaires</h4>
                          <div className="grid grid-cols-1 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-700">Banque:</span>
                              <span className="text-gray-600">BIAT</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-700">Bénéficiaire:</span>
                              <span className="text-gray-600">ZIPBAGS SARL</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-700">RIB:</span>
                              <span className="text-gray-600 font-mono">08 006 0123456789 12</span>
                            </div>
                          </div>
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-xs text-yellow-800">
                              <strong>Important:</strong> Mentionnez votre nom dans le motif du virement.
                            </p>
                          </div>

                          {/* File Upload Section */}
                          <div className="mt-3 space-y-2">
                            <h5 className="font-medium text-green-800 text-sm">Justificatif de virement</h5>

                            {!bankReceiptPreview ? (
                              <div className="border-2 border-dashed border-green-300 rounded-lg p-3 text-center">
                                <input
                                  type="file"
                                  id="bankReceipt"
                                  accept="image/*"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                />
                                <label
                                  htmlFor="bankReceipt"
                                  className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                  <Upload className="h-6 w-6 text-green-600" />
                                  <div className="text-xs">
                                    <p className="font-medium text-green-800">Cliquez pour ajouter</p>
                                    <p className="text-green-600">JPG, PNG, WEBP (max 5MB)</p>
                                  </div>
                                </label>
                              </div>
                            ) : (
                              <div className="relative border border-green-200 rounded-lg p-2 bg-white">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                      src={bankReceiptPreview}
                                      alt="Justificatif de virement"
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-xs text-green-800">
                                      {bankReceipt?.name}
                                    </p>
                                    <p className="text-xs text-green-600">
                                      {bankReceipt && (bankReceipt.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={removeBankReceipt}
                                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )}

                            <p className="text-xs text-green-700">
                              <FileImage className="h-3 w-3 inline mr-1" />
                              Ajoutez une photo de votre reçu de virement (optionnel)
                            </p>
                          </div>
                        </div>
                      )}
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
