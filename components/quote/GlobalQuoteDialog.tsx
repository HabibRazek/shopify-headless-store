'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Calculator,
  Package,
  Search,
  Plus,
  Minus,
  X,
  Check,
  Building2,
  Phone,
  Mail,
  FileText,
  Upload,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatPrice } from '@/lib/utils';

interface QuoteItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface GlobalQuoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_PRODUCTS = [
  {
    id: 'kraft-zip-10x15',
    title: 'KraftView™ - Pochette Zip Kraft Brun avec Fenêtre 10×15+3',
    price: 25.00,
    image: '/placeholder.png'
  },
  {
    id: 'kraft-zip-14x22',
    title: 'KraftView™ - Pochette Zip Kraft Brun avec Fenêtre 14×22+4',
    price: 40.00,
    image: '/placeholder.png'
  },
  {
    id: 'kraft-zip-20x30',
    title: 'KraftView™ - Pochette Zip Kraft Brun avec Fenêtre 20×30+5',
    price: 60.00,
    image: '/placeholder.png'
  },
  {
    id: 'kraft-zip-18x30',
    title: 'KraftView™ - Pochette Zip Kraft Brun avec Fenêtre 18×30+5',
    price: 55.00,
    image: '/placeholder.png'
  },
  {
    id: 'kraft-zip-16x26',
    title: 'KraftView™ - Pochette Zip Kraft Brun avec Fenêtre 16×26+4',
    price: 45.00,
    image: '/placeholder.png'
  }
];

const DISCOUNT_TIERS = [
  { min: 11, max: 20, discount: 5, label: '5% de réduction' },
  { min: 21, max: Infinity, discount: 10, label: '10% de réduction' },
];

const BANK_RIB = {
  bankName: 'Banque Internationale Arabe de Tunisie',
  accountName: 'ZIPBAGS SARL',
  rib: '08 006 0123456789 12',
  swift: 'BIATTNTT',
};

export function GlobalQuoteDialog({ isOpen, onClose }: GlobalQuoteDialogProps) {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<QuoteItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer'>('card');
  const [bankReceipt, setBankReceipt] = useState<File | null>(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setSelectedItems([]);
      setSearchTerm('');
      setPaymentMethod('card');
      setBankReceipt(null);
    }
  }, [isOpen]);

  const filteredProducts = SAMPLE_PRODUCTS.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProduct = (product: typeof SAMPLE_PRODUCTS[0]) => {
    const existingItem = selectedItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      setSelectedItems(items =>
        items.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedItems(items => [
        ...items,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
          image: product.image,
        }
      ]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems(items => items.filter(item => item.productId !== productId));
    } else {
      setSelectedItems(items =>
        items.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedItems(items => items.filter(item => item.productId !== productId));
  };

  const calculateTotals = () => {
    const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let discount = 0;
    for (const tier of DISCOUNT_TIERS) {
      if (totalQuantity >= tier.min && totalQuantity <= tier.max) {
        discount = tier.discount;
        break;
      }
    }

    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;

    return {
      totalQuantity,
      subtotal,
      discount,
      discountAmount,
      total,
    };
  };

  const handleSubmitQuote = async () => {
    if (!session) {
      toast.error('Connexion requise', {
        description: 'Vous devez être connecté pour demander un devis.',
        action: {
          label: 'Se connecter',
          onClick: () => {
            onClose();
            window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname);
          }
        },
      });
      return;
    }

    if (selectedItems.length === 0) {
      toast.error('Aucun produit sélectionné', {
        description: 'Veuillez sélectionner au moins un produit pour votre devis.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const totals = calculateTotals();
      const formData = new FormData();
      
      formData.append('items', JSON.stringify(selectedItems));
      formData.append('totalQuantity', totals.totalQuantity.toString());
      formData.append('subtotal', totals.subtotal.toString());
      formData.append('discount', totals.discount.toString());
      formData.append('total', totals.total.toString());
      formData.append('paymentMethod', paymentMethod);

      if (bankReceipt) {
        formData.append('bankReceipt', bankReceipt);
      }

      const response = await fetch('/api/quotes/bulk', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la soumission du devis');
      }

      toast.success('Devis soumis avec succès!', {
        description: 'Nous vous contacterons sous 24h avec votre devis personnalisé.',
        duration: 5000,
      });

      onClose();
    } catch (error) {
      toast.error('Erreur', {
        description: 'Une erreur est survenue lors de la soumission du devis.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totals = calculateTotals();

  const steps = [
    { number: 1, title: 'Produits', icon: Package },
    { number: 2, title: 'Paiement', icon: Building2 },
    { number: 3, title: 'Confirmation', icon: Check },
  ];

  if (!session) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-green-600" />
              Connexion requise
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Créez un compte pour demander un devis
            </h3>
            <p className="text-gray-600 mb-6">
              Connectez-vous pour accéder à notre système de devis personnalisé avec remises par volume.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  onClose();
                  window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname);
                }}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Se connecter
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  window.location.href = '/auth/signup?callbackUrl=' + encodeURIComponent(window.location.pathname);
                }}
                className="w-full"
              >
                Créer un compte
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-green-600" />
            Demander un devis personnalisé
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= step.number
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  currentStep > step.number ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Product Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Search and Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-green-600" />
                      Sélectionner des produits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{product.title}</p>
                              <p className="text-green-600 font-semibold">
                                {formatPrice(product.price, 'TND')}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addProduct(product)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Selected Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-green-600" />
                      Produits sélectionnés ({selectedItems.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedItems.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>Aucun produit sélectionné</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {selectedItems.map((item) => (
                            <div
                              key={item.productId}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Package className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{item.title}</p>
                                  <p className="text-green-600 font-semibold">
                                    {formatPrice(item.price, 'TND')}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeProduct(item.productId)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Pricing Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Quantité totale:</span>
                            <span>{totals.totalQuantity} unités</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Sous-total:</span>
                            <span>{formatPrice(totals.subtotal, 'TND')}</span>
                          </div>
                          {totals.discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Remise ({totals.discount}%):</span>
                              <span>-{formatPrice(totals.discountAmount, 'TND')}</span>
                            </div>
                          )}
                          <Separator />
                          <div className="flex justify-between font-semibold">
                            <span>Total estimé:</span>
                            <span className="text-green-600">
                              {formatPrice(totals.total, 'TND')}
                            </span>
                          </div>
                        </div>

                        {/* Discount Info */}
                        {totals.totalQuantity < 11 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-700">
                              💡 Commandez {11 - totals.totalQuantity} unités de plus pour bénéficier de 5% de réduction !
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex justify-end">
                      <Button
                        onClick={() => setCurrentStep(2)}
                        disabled={selectedItems.length === 0}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Continuer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Step 2: Payment Method */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-green-600" />
                    Mode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value: 'card' | 'bank_transfer') => setPaymentMethod(value)}
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Carte bancaire</p>
                            <p className="text-sm text-gray-600">Paiement sécurisé par carte</p>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Virement bancaire</p>
                            <p className="text-sm text-gray-600">Paiement par virement avec RIB</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Bank Transfer Details */}
                  {paymentMethod === 'bank_transfer' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4"
                    >
                      <h4 className="font-medium text-green-800 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Informations bancaires
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Banque:</p>
                          <p className="text-gray-600">{BANK_RIB.bankName}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Bénéficiaire:</p>
                          <p className="text-gray-600">{BANK_RIB.accountName}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">RIB:</p>
                          <p className="text-gray-600 font-mono">{BANK_RIB.rib}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Code SWIFT:</p>
                          <p className="text-gray-600 font-mono">{BANK_RIB.swift}</p>
                        </div>
                      </div>

                      {/* File Upload for Bank Receipt */}
                      <div className="space-y-2">
                        <Label htmlFor="bankReceipt">Reçu de virement (optionnel)</Label>
                        <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            Glissez votre reçu ici ou cliquez pour sélectionner
                          </p>
                          <input
                            id="bankReceipt"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setBankReceipt(file);
                            }}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('bankReceipt')?.click()}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Sélectionner un fichier
                          </Button>
                          {bankReceipt && (
                            <p className="text-sm text-green-600 mt-2">
                              ✓ {bankReceipt.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                    >
                      Retour
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Continuer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    Confirmation du devis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <h4 className="font-medium">Résumé de votre demande</h4>

                    {/* Selected Products */}
                    <div className="space-y-2">
                      {selectedItems.map((item) => (
                        <div key={item.productId} className="flex justify-between text-sm">
                          <span>{item.title} × {item.quantity}</span>
                          <span>{formatPrice(item.price * item.quantity, 'TND')}</span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Quantité totale:</span>
                        <span>{totals.totalQuantity} unités</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sous-total:</span>
                        <span>{formatPrice(totals.subtotal, 'TND')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mode de paiement:</span>
                        <span>
                          {paymentMethod === 'card' ? 'Carte bancaire' : 'Virement bancaire'}
                        </span>
                      </div>
                      {totals.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Remise ({totals.discount}%):</span>
                          <span>-{formatPrice(totals.discountAmount, 'TND')}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total estimé:</span>
                        <span className="text-green-600">
                          {formatPrice(totals.total, 'TND')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Prochaines étapes</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Nous vous contacterons sous 24h
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Devis personnalisé par email
                      </p>
                      <p className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Facture proforma incluse
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                    >
                      Retour
                    </Button>
                    <Button
                      onClick={handleSubmitQuote}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      {isLoading ? 'Envoi...' : 'Envoyer la demande'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
