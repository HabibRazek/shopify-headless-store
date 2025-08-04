'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Plus,
  Minus,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Hash,
  Package,
  Calculator,
  FileText,
  CheckSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AdminLayout from '@/components/admin/AdminLayout';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
      };
    }>;
  };
}

interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

interface DoypackCustomization {
  includePrinting: boolean;
  dimensions: string;
  printingPricePerUnit: number;
  quantity: number;
  total: number;
}

interface InvoiceForm {
  // Company Information
  companyName: string;
  matriculeFiscale: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  
  // Invoice Details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  
  // Items and Customization
  items: InvoiceItem[];
  doypacks: DoypackCustomization;
  
  // Totals
  subtotal: number;
  totalDiscount: number;
  printingCosts: number;
  total: number;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [productError, setProductError] = useState<string | null>(null);
  
  // Initialize form with default values
  const [form, setForm] = useState<InvoiceForm>({
    companyName: '',
    matriculeFiscale: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    invoiceNumber: generateInvoiceNumber(),
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    items: [],
    doypacks: {
      includePrinting: false,
      dimensions: '',
      printingPricePerUnit: 0,
      quantity: 0,
      total: 0
    },
    subtotal: 0,
    totalDiscount: 0,
    printingCosts: 0,
    total: 0
  });

  // Fetch Shopify products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      setProductError(null);

      try {
        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Extract products from Shopify response
        const shopifyProducts = data.products?.edges?.map((edge: any) => edge.node) || [];
        setProducts(shopifyProducts);

      } catch (error) {
        console.error('Error fetching products:', error);
        setProductError(error instanceof Error ? error.message : 'Failed to load products');

        // Fallback to empty array
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  function generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}-${month}-${random}`;
  }

  const updateForm = (field: keyof InvoiceForm, value: any) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      return calculateTotals(updated);
    });
  };

  const calculateTotals = (formData: InvoiceForm): InvoiceForm => {
    // Calculate items subtotal and discount
    const itemsSubtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const itemsDiscount = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.discount / 100), 0);
    
    // Calculate printing costs (no discount applied)
    const printingCosts = formData.doypacks.includePrinting ? formData.doypacks.total : 0;
    
    // Calculate totals
    const subtotal = itemsSubtotal;
    const totalDiscount = itemsDiscount;
    const total = subtotal - totalDiscount + printingCosts;

    return {
      ...formData,
      subtotal,
      totalDiscount,
      printingCosts,
      total
    };
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0
    };
    
    updateForm('items', [...form.items, newItem]);
  };

  const removeItem = (itemId: string) => {
    updateForm('items', form.items.filter(item => item.id !== itemId));
  };

  const updateItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = form.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        
        // If product is selected, update name and price
        if (field === 'productId' && value) {
          const product = products.find(p => p.id === value);
          if (product) {
            updatedItem.productName = product.title;
            updatedItem.unitPrice = parseFloat(product.priceRange.minVariantPrice.amount);
          }
        }
        
        // Calculate item total
        updatedItem.total = updatedItem.quantity * updatedItem.unitPrice * (1 - updatedItem.discount / 100);
        
        return updatedItem;
      }
      return item;
    });
    
    updateForm('items', updatedItems);
  };

  const updateDoypacks = (field: keyof DoypackCustomization, value: any) => {
    const updatedDoypacks = { ...form.doypacks, [field]: value };
    
    // Calculate doypack total
    if (field === 'quantity' || field === 'printingPricePerUnit') {
      updatedDoypacks.total = updatedDoypacks.quantity * updatedDoypacks.printingPricePerUnit;
    }
    
    updateForm('doypacks', updatedDoypacks);
  };

  const handleSave = async (status: 'draft' | 'sent') => {
    setIsLoading(true);

    try {
      // Validate required fields
      if (!form.companyName || !form.contactPerson || !form.email || !form.phone || !form.address) {
        toast.error('Veuillez remplir tous les champs obligatoires de l\'entreprise.');
        return;
      }

      if (!form.invoiceNumber || !form.invoiceDate || !form.dueDate) {
        toast.error('Veuillez remplir tous les détails de la facture.');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        toast.error('Veuillez entrer une adresse email valide.');
        return;
      }

      // MF is optional and accepts any format

      // Prepare the invoice data
      const invoiceData = {
        ...form,
        status: status.toUpperCase(),
        doypacks: form.doypacks,
      };

      console.log('Sending invoice data:', invoiceData);

      // Make API call to create invoice
      const response = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('API Error:', result);
        const errorMessage = result.details ? `${result.error}: ${result.details}` : result.error || 'Failed to create invoice';
        throw new Error(errorMessage);
      }

      // Show success message with toast
      if (status === 'draft') {
        toast.success('Facture sauvegardée comme brouillon!', {
          description: `Facture ${form.invoiceNumber} créée avec succès`,
          duration: 4000,
        });
      } else {
        toast.success('Facture créée et envoyée avec succès!', {
          description: `Facture ${form.invoiceNumber} pour ${form.companyName}`,
          duration: 4000,
        });
      }

      // Redirect to invoices list
      router.push('/admin/factures');

    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('Erreur lors de la création de la facture', {
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    // Generate PDF and print
    console.log('Printing invoice:', form);
  };



  return (
    <AdminLayout
      title="Créer une Facture"
      description="Créez une nouvelle facture pour vos clients"
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <Button
            onClick={() => handleSave('draft')}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 hover:to-[#77db19] text-white flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Création...' : 'Créer la Facture'}
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Company Information Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Building className="h-5 w-5 text-green-600" />
              Informations de l'Entreprise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Nom de l'entreprise *
                </Label>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onChange={(e) => updateForm('companyName', e.target.value)}
                  placeholder="Ex: Ste Packedin Solutions"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matriculeFiscale" className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  MF (Matricule Fiscale)
                </Label>
                <Input
                  id="matriculeFiscale"
                  value={form.matriculeFiscale}
                  onChange={(e) => updateForm('matriculeFiscale', e.target.value)}
                  placeholder="Matricule Fiscale (optionnel)"
                  title="Matricule Fiscale (optionnel - tout format accepté)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPerson" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personne de contact *
                </Label>
                <Input
                  id="contactPerson"
                  value={form.contactPerson}
                  onChange={(e) => updateForm('contactPerson', e.target.value)}
                  placeholder="Ex: M. Ahmed Packedin"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Adresse email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  placeholder="Ex: contact@packedin.tn"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Numéro de téléphone *
                </Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  placeholder="Ex: 29 362 224"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adresse complète *
              </Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) => updateForm('address', e.target.value)}
                placeholder="Ex: Zone Industrielle Packedin, Ariana 2080"
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice Details Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-green-600" />
              Détails de la Facture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber" className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Numéro de facture
                </Label>
                <Input
                  id="invoiceNumber"
                  value={form.invoiceNumber}
                  onChange={(e) => updateForm('invoiceNumber', e.target.value)}
                  placeholder="INV-2024-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date de facture
                </Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={form.invoiceDate}
                  onChange={(e) => updateForm('invoiceDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date d'échéance
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => updateForm('dueDate', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Selection Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-3">
                <Package className="h-5 w-5 text-green-600" />
                Sélection des Produits
              </span>
              <Button
                onClick={addItem}
                className="bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 hover:to-[#77db19] text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {form.items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun produit ajouté. Cliquez sur "Ajouter un produit" pour commencer.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {form.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium">Produit</Label>
                        <Select
                          value={item.productId}
                          onValueChange={(value) => updateItem(item.id, 'productId', value)}
                          disabled={isLoadingProducts}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={
                              isLoadingProducts
                                ? "Chargement des produits..."
                                : productError
                                  ? "Erreur de chargement"
                                  : "Sélectionner un produit"
                            } />
                          </SelectTrigger>
                          <SelectContent>
                            {productError ? (
                              <SelectItem value="error" disabled>
                                Erreur: {productError}
                              </SelectItem>
                            ) : products.length === 0 ? (
                              <SelectItem value="empty" disabled>
                                Aucun produit disponible
                              </SelectItem>
                            ) : (
                              products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.title} - {formatPrice(parseFloat(product.priceRange.minVariantPrice.amount), product.priceRange.minVariantPrice.currencyCode)}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {productError && (
                          <p className="text-sm text-red-600 mt-1">
                            Impossible de charger les produits. Veuillez rafraîchir la page.
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Quantité</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Prix unitaire (TND)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Remise (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discount}
                          onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Total</Label>
                          <div className="text-lg font-bold text-green-600">
                            {formatPrice(item.total, 'TND')}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Doypack Customization Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CheckSquare className="h-5 w-5 text-green-600" />
              Personnalisation Doypacks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includePrinting"
                checked={form.doypacks.includePrinting}
                onCheckedChange={(checked) => updateDoypacks('includePrinting', checked)}
              />
              <Label htmlFor="includePrinting" className="text-sm font-medium">
                Inclure l'impression
              </Label>
            </div>

            {form.doypacks.includePrinting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions des doypacks</Label>
                    <Select
                      value={form.doypacks.dimensions}
                      onValueChange={(value) => updateDoypacks('dimensions', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner les dimensions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16x26+4">16 x 26 + 4 cm</SelectItem>
                        <SelectItem value="10x15+3">10 x 15 + 3 cm</SelectItem>
                        <SelectItem value="20x30+5">20 x 30 + 5 cm</SelectItem>
                        <SelectItem value="12x18+4">12 x 18 + 4 cm</SelectItem>
                        <SelectItem value="custom">Dimensions personnalisées</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="printingQuantity">Quantité</Label>
                    <Input
                      id="printingQuantity"
                      type="number"
                      min="1"
                      value={form.doypacks.quantity}
                      onChange={(e) => updateDoypacks('quantity', parseInt(e.target.value) || 0)}
                      placeholder="Ex: 500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="printingPrice">Prix par unité (TND)</Label>
                    <Input
                      id="printingPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.doypacks.printingPricePerUnit}
                      onChange={(e) => updateDoypacks('printingPricePerUnit', parseFloat(e.target.value) || 0)}
                      placeholder="Ex: 0.35"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <span className="font-medium">Total impression:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatPrice(form.doypacks.total, 'TND')}
                  </span>
                </div>

                <div className="text-sm text-green-700 bg-green-100 p-3 rounded">
                  <strong>Note:</strong> Les remises ne s'appliquent pas aux coûts d'impression.
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Totals Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Calculator className="h-5 w-5 text-green-600" />
              Récapitulatif des Totaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-green-200">
                <span className="text-gray-700">Sous-total (produits):</span>
                <span className="font-semibold">{formatPrice(form.subtotal, 'TND')}</span>
              </div>

              {form.totalDiscount > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-green-200">
                  <span className="text-gray-700">Remise totale:</span>
                  <span className="font-semibold text-red-600">-{formatPrice(form.totalDiscount, 'TND')}</span>
                </div>
              )}

              {form.printingCosts > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-green-200">
                  <span className="text-gray-700">Coûts d'impression:</span>
                  <span className="font-semibold">{formatPrice(form.printingCosts, 'TND')}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between items-center py-3">
                <span className="text-xl font-bold text-gray-900">Total TTC:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(form.total, 'TND')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>
    </AdminLayout>
  );
}
