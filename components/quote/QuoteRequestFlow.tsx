'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Calculator,
  Package,
  Percent,
  CreditCard,
  Upload,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Building2,
  Phone,
  Mail
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  title: string;
  price: number;
  image?: string;
}

interface QuoteRequestFlowProps {
  product: Product;
  trigger?: React.ReactNode;
}

interface QuoteData {
  quantity: number;
  basePrice: number;
  discount: number;
  finalPrice: number;
  paymentMethod: 'card' | 'bank_transfer';
  bankReceipt?: File;
}

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

export function QuoteRequestFlow({ product, trigger }: QuoteRequestFlowProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [quoteData, setQuoteData] = useState<QuoteData>({
    quantity: 1,
    basePrice: 0,
    discount: 0,
    finalPrice: 0,
    paymentMethod: 'card',
  });

  const calculatePricing = (quantity: number) => {
    const basePrice = product.price * quantity;
    let discount = 0;
    let discountLabel = '';

    for (const tier of DISCOUNT_TIERS) {
      if (quantity >= tier.min && quantity <= tier.max) {
        discount = tier.discount;
        discountLabel = tier.label;
        break;
      }
    }

    const discountAmount = (basePrice * discount) / 100;
    const finalPrice = basePrice - discountAmount;

    return {
      basePrice,
      discount,
      discountAmount,
      finalPrice,
      discountLabel,
    };
  };

  const handleQuantityChange = (quantity: number) => {
    const pricing = calculatePricing(quantity);
    setQuoteData(prev => ({
      ...prev,
      quantity,
      basePrice: pricing.basePrice,
      discount: pricing.discount,
      finalPrice: pricing.finalPrice,
    }));
  };

  const handleFileUpload = (file: File) => {
    setQuoteData(prev => ({
      ...prev,
      bankReceipt: file,
    }));
  };

  const handleSubmitQuote = async () => {
    if (!session) {
      toast.error('Connexion requise', {
        description: 'Vous devez être connecté pour demander un devis.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('productId', product.id);
      formData.append('quantity', quoteData.quantity.toString());
      formData.append('basePrice', quoteData.basePrice.toString());
      formData.append('discount', quoteData.discount.toString());
      formData.append('finalPrice', quoteData.finalPrice.toString());
      formData.append('paymentMethod', quoteData.paymentMethod);

      if (quoteData.bankReceipt) {
        formData.append('bankReceipt', quoteData.bankReceipt);
      }

      const response = await fetch('/api/quotes', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la soumission du devis');
      }

      toast.success('Devis soumis avec succès!', {
        description: 'Nous vous contacterons sous 24h avec votre devis personnalisé.',
      });

      setIsOpen(false);
      setCurrentStep(1);
      setQuoteData({
        quantity: 1,
        basePrice: 0,
        discount: 0,
        finalPrice: 0,
        paymentMethod: 'card',
      });
    } catch (error) {
      toast.error('Erreur', {
        description: 'Une erreur est survenue lors de la soumission du devis.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pricing = calculatePricing(quoteData.quantity);

  const steps = [
    { number: 1, title: 'Quantité', icon: Package },
    { number: 2, title: 'Tarification', icon: Calculator },
    { number: 3, title: 'Paiement', icon: CreditCard },
    { number: 4, title: 'Confirmation', icon: Check },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-green-600 hover:bg-green-700">
            <Calculator className="h-4 w-4 mr-2" />
            Demander un devis
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-green-600" />
            Demander un devis - {product.title}
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
          {/* Step 1: Quantity Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    Sélectionnez la quantité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{product.title}</h3>
                      <p className="text-green-600 font-medium">
                        {formatPrice(product.price, 'TND')} / unité
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantité souhaitée</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quoteData.quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-32"
                    />
                  </div>

                  {/* Discount Tiers Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Remises par volume</h4>
                    <div className="space-y-1 text-sm text-blue-700">
                      <p>• 11-20 unités: 5% de réduction</p>
                      <p>• 21+ unités: 10% de réduction</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Continuer
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Pricing Display */}
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
                    <Calculator className="h-5 w-5 text-green-600" />
                    Calcul du prix
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span>Prix unitaire:</span>
                      <span>{formatPrice(product.price, 'TND')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantité:</span>
                      <span>{quoteData.quantity} unités</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <span>{formatPrice(pricing.basePrice, 'TND')}</span>
                    </div>
                    {pricing.discount > 0 && (
                      <>
                        <div className="flex justify-between text-green-600">
                          <span className="flex items-center gap-2">
                            <Percent className="h-4 w-4" />
                            Remise ({pricing.discount}%):
                          </span>
                          <span>-{formatPrice(pricing.discountAmount, 'TND')}</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {pricing.discountLabel}
                        </Badge>
                      </>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-green-600">
                        {formatPrice(pricing.finalPrice, 'TND')}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Continuer
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Payment Method */}
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
                    <CreditCard className="h-5 w-5 text-green-600" />
                    Mode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={quoteData.paymentMethod}
                    onValueChange={(value: 'card' | 'bank_transfer') =>
                      setQuoteData(prev => ({ ...prev, paymentMethod: value }))
                    }
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-blue-600" />
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
                          <Building2 className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Virement bancaire</p>
                            <p className="text-sm text-gray-600">Paiement par virement</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Bank Transfer Details */}
                  {quoteData.paymentMethod === 'bank_transfer' && (
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
                              if (file) handleFileUpload(file);
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
                          {quoteData.bankReceipt && (
                            <p className="text-sm text-green-600 mt-2">
                              ✓ {quoteData.bankReceipt.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(4)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Continuer
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
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
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium">Résumé de votre demande</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Produit:</span>
                        <span>{product.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantité:</span>
                        <span>{quoteData.quantity} unités</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mode de paiement:</span>
                        <span>
                          {quoteData.paymentMethod === 'card' ? 'Carte bancaire' : 'Virement bancaire'}
                        </span>
                      </div>
                      {pricing.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Remise:</span>
                          <span>{pricing.discount}%</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total estimé:</span>
                        <span className="text-green-600">
                          {formatPrice(pricing.finalPrice, 'TND')}
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
                      onClick={() => setCurrentStep(3)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
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
