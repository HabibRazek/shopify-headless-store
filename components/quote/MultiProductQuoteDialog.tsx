'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Calculator,
  Package,
  Plus,
  Minus,
  ShoppingCart,
  Percent,
  Check,
  X,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  title: string;
  handle: string;
  price: number;
  currency: string;
  image?: string;
  description?: string;
}

interface SelectedProduct extends Product {
  quantity: number;
}

interface MultiProductQuoteDialogProps {
  trigger?: React.ReactNode;
}

// Updated discount tiers as requested
const DISCOUNT_TIERS = [
  { min: 11, max: 20, discount: 5, label: '5% de réduction' },
  { min: 21, max: 99, discount: 10, label: '10% de réduction' },
  { min: 100, max: Infinity, discount: 15, label: '15% de réduction' },
];

export function MultiProductQuoteDialog({ trigger }: MultiProductQuoteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Fetch all products when dialog opens
  useEffect(() => {
    if (isOpen && products.length === 0) {
      fetchProducts();
    }
  }, [isOpen, products.length]);

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchQuery]);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.products?.edges) {
        const formattedProducts: Product[] = data.products.edges.map((edge: any) => ({
          id: edge.node.id,
          title: edge.node.title,
          handle: edge.node.handle,
          price: parseFloat(edge.node.priceRange.minVariantPrice.amount),
          currency: edge.node.priceRange.minVariantPrice.currencyCode,
          image: edge.node.images?.edges?.[0]?.node?.url,
          description: edge.node.description,
        }));
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const addProduct = (product: Product) => {
    const existingIndex = selectedProducts.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
      updateQuantity(product.id, selectedProducts[existingIndex].quantity + 1);
    } else {
      setSelectedProducts(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }
    setSelectedProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, quantity } : p)
    );
  };

  const calculateTotals = () => {
    const totalQuantity = selectedProducts.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let discount = 0;
    let discountLabel = '';
    
    for (const tier of DISCOUNT_TIERS) {
      if (totalQuantity >= tier.min && totalQuantity <= tier.max) {
        discount = tier.discount;
        discountLabel = tier.label;
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
      discountLabel,
      total,
    };
  };

  const handleSubmitQuote = async () => {
    setIsLoading(true);
    try {
      const totals = calculateTotals();

      const quoteData = {
        products: selectedProducts.map(p => ({
          id: p.id,
          title: p.title,
          price: p.price,
          quantity: p.quantity,
          currency: p.currency,
        })),
        totalQuantity: totals.totalQuantity,
        subtotal: totals.subtotal,
        discount: totals.discount,
        discountAmount: totals.discountAmount,
        total: totals.total,
      };

      const response = await fetch('/api/quotes/multi-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Demande de devis envoyée!', {
          description: `Référence: ${result.quoteId}. Nous vous contacterons sous 24h avec votre devis personnalisé.`,
          duration: 5000,
        });

        // Reset form
        setSelectedProducts([]);
        setCurrentStep(1);
        setIsOpen(false);
      } else {
        throw new Error(result.error || 'Erreur lors de l\'envoi du devis');
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      toast.error('Erreur lors de l\'envoi du devis', {
        description: error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Calculator className="h-4 w-4" />
            Demander devis
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-4xl h-[95vh] max-h-[95vh] p-0 flex flex-col">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-3 sm:p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculateur de devis personnalisé
            </DialogTitle>
            <DialogDescription>
              Sélectionnez vos produits et quantités pour obtenir un devis avec remises automatiques
            </DialogDescription>

            {/* Discount tiers info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <h4 className="font-medium text-blue-900 mb-2">Remises automatiques:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-blue-700">
                <div className="flex items-center gap-1">
                  <Percent className="h-3 w-3" />
                  <span>11-20 articles: 5%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Percent className="h-3 w-3" />
                  <span>21-99 articles: 10%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Percent className="h-3 w-3" />
                  <span>100+ articles: 15%</span>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6">
          {/* Step indicator - Mobile optimized */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6 sticky top-0 bg-white py-2 z-10">
            <div className={`flex items-center gap-1 sm:gap-2 ${currentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">Sélection</span>
              <span className="text-xs font-medium sm:hidden">Produits</span>
            </div>
            <div className="w-4 sm:w-8 h-px bg-gray-200" />
            <div className={`flex items-center gap-1 sm:gap-2 ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-xs sm:text-sm font-medium">Récapitulatif</span>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-6 pb-6">
              {/* Mobile Summary - Always visible at top */}
              {selectedProducts.length > 0 && (
                <div className="lg:hidden bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3 sticky top-0 z-20 shadow-sm">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700">Total:</span>
                    <span className="font-bold text-green-600">
                      {totals.totalQuantity} articles - {formatPrice(totals.total.toString(), selectedProducts[0]?.currency || 'TND')}
                    </span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="text-xs text-green-600 text-center mt-1">
                      🎉 {totals.discount}% de réduction appliquée!
                    </div>
                  )}
                </div>
              )}

              {/* Desktop: Two column layout, Mobile: Single column */}
              <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-6 space-y-6 lg:space-y-0">
                {/* Left column: Products list (2/3 width on desktop) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Nos produits</h3>
                      <Badge variant="secondary" className="text-xs">
                        {products.length} produit{products.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>

                    {/* Search input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher par nom ou description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white"
                      />
                    </div>

                    {/* Results count */}
                    {searchQuery && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
                        </span>
                        {filteredProducts.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearchQuery('')}
                            className="h-6 px-2 text-xs"
                          >
                            Effacer
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Products Grid */}
                  <div className="max-h-[400px] lg:max-h-[500px] overflow-y-auto">
                    {isLoadingProducts ? (
                      <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-20 bg-gray-200 rounded-lg"></div>
                          </div>
                        ))}
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Aucun produit trouvé</p>
                        {searchQuery && (
                          <p className="text-sm mt-1">Essayez avec d'autres mots-clés</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredProducts.map((product) => (
                          <div key={product.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start gap-3">
                              {/* Product Image */}
                              <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-gray-100 rounded-md border flex items-center justify-center overflow-hidden">
                                  {product.image ? (
                                    <Image
                                      src={product.image}
                                      alt={product.title}
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover"
                                      onError={() => {
                                        // Handle error by showing fallback
                                      }}
                                    />
                                  ) : (
                                    <Package className="h-6 w-6 text-gray-400" />
                                  )}
                                </div>
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm line-clamp-2 mb-1">{product.title}</h4>
                                <p className="text-green-600 font-semibold text-sm">
                                  {formatPrice(product.price.toString(), product.currency)}
                                </p>
                                {product.description && (
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {product.description.substring(0, 100)}...
                                  </p>
                                )}
                              </div>

                              {/* Add Button */}
                              <div className="flex-shrink-0">
                                <Button
                                  size="sm"
                                  onClick={() => addProduct(product)}
                                  className="h-8 w-8 p-0"
                                  title="Ajouter au devis"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right column: Summary sidebar (1/3 width on desktop, hidden on mobile) */}
                <div className="hidden lg:block lg:col-span-1">
                  <div className="sticky top-4 space-y-4">
                    {/* Selected products */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Panier</h3>
                        <Badge variant="secondary">
                          {selectedProducts.length} produit{selectedProducts.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>

                      <div className="max-h-[300px] overflow-y-auto">
                        {selectedProducts.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Aucun produit sélectionné</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {selectedProducts.map((product) => (
                              <div key={product.id} className="border rounded-lg p-3 bg-green-50/50">
                                <div className="flex items-start gap-2">
                                  {/* Product Image */}
                                  <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gray-100 rounded-md border flex items-center justify-center overflow-hidden">
                                      {product.image ? (
                                        <Image
                                          src={product.image}
                                          alt={product.title}
                                          width={40}
                                          height={40}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <Package className="h-3 w-3 text-gray-400" />
                                      )}
                                    </div>
                                  </div>

                                  {/* Product Info & Controls */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-1">
                                      <h4 className="font-medium text-xs line-clamp-2 pr-1">{product.title}</h4>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removeProduct(product.id)}
                                        className="h-4 w-4 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        title="Supprimer"
                                      >
                                        <X className="h-2 w-2" />
                                      </Button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <span className="text-green-600 font-semibold text-xs">
                                        {formatPrice(product.price.toString(), product.currency)}
                                      </span>
                                      <div className="flex items-center gap-1">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => updateQuantity(product.id, product.quantity - 1)}
                                          className="h-5 w-5 p-0"
                                        >
                                          <Minus className="h-2 w-2" />
                                        </Button>
                                        <span className="w-6 text-center text-xs font-medium">{product.quantity}</span>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                          className="h-5 w-5 p-0"
                                        >
                                          <Plus className="h-2 w-2" />
                                        </Button>
                                      </div>
                                    </div>

                                    {/* Subtotal for this product */}
                                    <div className="mt-1 text-right">
                                      <span className="text-xs font-medium text-gray-700">
                                        {formatPrice((product.price * product.quantity).toString(), product.currency)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Desktop Summary */}
                    {selectedProducts.length > 0 && (
                      <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 space-y-3 shadow-sm">
                        <h4 className="font-semibold text-sm text-gray-900">Récapitulatif</h4>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">Quantité totale:</span>
                          <span className="font-semibold text-gray-900">{totals.totalQuantity} articles</span>
                        </div>

                        {totals.discount > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-green-700">Remise:</span>
                            <span className="font-semibold text-green-600">{totals.discount}% de réduction</span>
                          </div>
                        )}

                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-semibold text-gray-900">Total estimé:</span>
                            <span className="text-lg font-bold text-green-600">
                              {formatPrice(totals.total.toString(), selectedProducts[0]?.currency || 'TND')}
                            </span>
                          </div>
                        </div>

                        {/* Progress indicator for next discount tier */}
                        {totals.totalQuantity < 11 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mt-3">
                            <p className="text-xs text-blue-700">
                              💡 +{11 - totals.totalQuantity} article{11 - totals.totalQuantity > 1 ? 's' : ''} → 5% de réduction
                            </p>
                          </div>
                        )}

                        {totals.totalQuantity >= 11 && totals.totalQuantity < 21 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mt-3">
                            <p className="text-xs text-blue-700">
                              💡 +{21 - totals.totalQuantity} article{21 - totals.totalQuantity > 1 ? 's' : ''} → 10% de réduction
                            </p>
                          </div>
                        )}

                        {totals.totalQuantity >= 21 && totals.totalQuantity < 100 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mt-3">
                            <p className="text-xs text-blue-700">
                              💡 +{100 - totals.totalQuantity} article{100 - totals.totalQuantity > 1 ? 's' : ''} → 15% de réduction
                            </p>
                          </div>
                        )}

                        {/* Continue Button */}
                        <Button
                          onClick={() => setCurrentStep(2)}
                          disabled={selectedProducts.length === 0}
                          className="gap-2 w-full text-white  bg-green-600 text-sm hover:bg-green-700 mt-4"
                          size="lg"
                        >
                          Continuer vers le récapitulatif
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Selected Products (shown below products list) */}
                <div className="lg:hidden space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Produits sélectionnés</h3>
                    <Badge variant="secondary">
                      {selectedProducts.length} produit{selectedProducts.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>

                  {selectedProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Aucun produit sélectionné</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {selectedProducts.map((product) => (
                        <div key={product.id} className="border rounded-lg p-3 bg-green-50/50">
                          <div className="flex items-start gap-3">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gray-100 rounded-md border flex items-center justify-center overflow-hidden">
                                {product.image ? (
                                  <Image
                                    src={product.image}
                                    alt={product.title}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package className="h-4 w-4 text-gray-400" />
                                )}
                              </div>
                            </div>

                            {/* Product Info & Controls */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-sm line-clamp-2 pr-2">{product.title}</h4>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeProduct(product.id)}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  title="Supprimer"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-green-600 font-semibold text-sm">
                                  {formatPrice(product.price.toString(), product.currency)}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateQuantity(product.id, product.quantity - 1)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center text-sm font-medium">{product.quantity}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              {/* Subtotal for this product */}
                              <div className="mt-2 text-right">
                                <span className="text-xs text-gray-500">Sous-total: </span>
                                <span className="text-sm font-medium text-gray-700">
                                  {formatPrice((product.price * product.quantity).toString(), product.currency)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Mobile Continue Button */}
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={selectedProducts.length === 0}
                    className="gap-2 w-full text-white bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    Continuer vers le récapitulatif
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 pb-6">
              <div className="mb-4 sm:mb-6">
                <h3 className="font-semibold text-lg sm:text-xl">Récapitulatif de votre devis</h3>
              </div>

              <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
                {/* Products summary */}
                <div className="space-y-4">
                  <h4 className="font-medium text-base sm:text-lg">Produits sélectionnés</h4>
                  <div className="space-y-3">
                    {selectedProducts.map((product) => (
                      <div key={product.id} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm sm:text-base line-clamp-2">{product.title}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                              {formatPrice(product.price.toString(), product.currency)} × {product.quantity}
                            </p>
                          </div>
                          <div className="flex justify-between sm:justify-end items-center">
                            <span className="text-xs text-gray-500 sm:hidden">Sous-total:</span>
                            <span className="font-medium text-sm sm:text-base">
                              {formatPrice((product.price * product.quantity).toString(), product.currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing breakdown */}
                <div className="space-y-4">
                  <h4 className="font-medium text-base sm:text-lg">Détail des prix</h4>
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 sm:p-6 space-y-3 border border-green-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base">Sous-total:</span>
                      <span className="text-sm sm:text-base font-medium">{formatPrice(totals.subtotal.toString(), selectedProducts[0]?.currency || 'TND')}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base">Quantité totale:</span>
                      <span className="text-sm sm:text-base font-medium">{totals.totalQuantity} articles</span>
                    </div>

                    {totals.discount > 0 && (
                      <>
                        <Separator className="bg-green-200" />
                        <div className="flex justify-between items-center text-green-600 bg-green-100/50 rounded-md p-2">
                          <span className="flex items-center gap-1 text-sm sm:text-base">
                            <Percent className="h-4 w-4" />
                            Remise ({totals.discount}%):
                          </span>
                          <span className="font-semibold text-sm sm:text-base">-{formatPrice(totals.discountAmount.toString(), selectedProducts[0]?.currency || 'TND')}</span>
                        </div>
                      </>
                    )}

                    <Separator className="bg-gray-300" />
                    <div className="flex justify-between items-center font-bold text-lg sm:text-xl bg-white rounded-md p-3 shadow-sm">
                      <span>Total:</span>
                      <span className="text-green-600">
                        {formatPrice(totals.total.toString(), selectedProducts[0]?.currency || 'TND')}
                      </span>
                    </div>
                  </div>

                  {totals.discount > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-green-700">
                        <div className="bg-green-100 rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-sm sm:text-base">🎉 Félicitations!</span>
                      </div>
                      <p className="text-sm sm:text-base text-green-600 mt-2 font-medium">
                        Vous bénéficiez de {totals.discountLabel} sur votre commande
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom buttons */}
              <div className="mt-6">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="w-full sm:w-auto"
                    size="lg"
                  >
                    ← Retour
                  </Button>
                  <Button
                    onClick={handleSubmitQuote}
                    disabled={isLoading}
                    className="gap-2 w-full sm:w-auto bg-green-600 text-white text-sm hover:bg-green-700"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        📧 Envoyer la demande
                        <Calculator className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
