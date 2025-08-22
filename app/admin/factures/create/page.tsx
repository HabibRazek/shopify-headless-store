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
    <div className="min-h-screen bg-gray-50">
      <AdminLayout
        title="Nouvelle Facture"
        description="Créez une nouvelle facture pour vos clients"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <Button
              onClick={() => handleSave('draft')}
              disabled={isLoading}
              className="bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-black hover:to-[#9FD000] text-white flex items-center gap-2 px-6"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Création...' : 'Créer la Facture'}
            </Button>
          </div>
        }
      >
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-4">
              {/* Invoice Header */}
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Nouvelle Facture: {form.invoiceNumber}
                      </CardTitle>
                      <p className="text-xs text-gray-500 mt-1">
                        Créée le {new Date().toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Packedin.tn</div>
                      <div className="text-xs text-gray-500">Kings Worldwide Distribution</div>
                      <div className="text-xs text-gray-500">Megrine Business Center, Tunisia</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="invoiceNumber" className="text-xs font-medium text-gray-700">
                        Numéro de facture
                      </Label>
                      <Input
                        id="invoiceNumber"
                        value={form.invoiceNumber}
                        onChange={(e) => updateForm('invoiceNumber', e.target.value)}
                        className="mt-1 h-8 text-sm border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                    <div>
                      <Label htmlFor="invoiceDate" className="text-xs font-medium text-gray-700">
                        Date de facture
                      </Label>
                      <Input
                        id="invoiceDate"
                        type="date"
                        value={form.invoiceDate}
                        onChange={(e) => updateForm('invoiceDate', e.target.value)}
                        className="mt-1 h-8 text-sm border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate" className="text-xs font-medium text-gray-700">
                        Date d'échéance
                      </Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={form.dueDate}
                        onChange={(e) => updateForm('dueDate', e.target.value)}
                        className="mt-1 h-8 text-sm border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client Details */}
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600" />
                    Détails du Client
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="companyName" className="text-xs font-medium text-gray-700">
                        Nom de l'entreprise *
                      </Label>
                      <Input
                        id="companyName"
                        value={form.companyName}
                        onChange={(e) => updateForm('companyName', e.target.value)}
                        placeholder="Nom de l'entreprise"
                        className="mt-1 h-8 text-sm border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="matriculeFiscale" className="text-sm font-medium text-gray-700">
                        Matricule Fiscale
                      </Label>
                      <Input
                        id="matriculeFiscale"
                        value={form.matriculeFiscale}
                        onChange={(e) => updateForm('matriculeFiscale', e.target.value)}
                        placeholder="Matricule Fiscale (optionnel)"
                        className="mt-1 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson" className="text-sm font-medium text-gray-700">
                        Personne de contact *
                      </Label>
                      <Input
                        id="contactPerson"
                        value={form.contactPerson}
                        onChange={(e) => updateForm('contactPerson', e.target.value)}
                        placeholder="Nom du contact"
                        className="mt-1 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => updateForm('email', e.target.value)}
                        placeholder="email@entreprise.com"
                        className="mt-1 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Téléphone *
                      </Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) => updateForm('phone', e.target.value)}
                        placeholder="+216 XX XXX XXX"
                        className="mt-1 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                        Adresse *
                      </Label>
                      <Textarea
                        id="address"
                        value={form.address}
                        onChange={(e) => updateForm('address', e.target.value)}
                        placeholder="Adresse complète"
                        className="mt-1 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Item Details */}
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Package className="h-5 w-5 text-gray-600" />
                      Détails des Articles
                    </CardTitle>
                    <Button
                      onClick={addItem}
                      className="bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-black hover:to-[#9FD000] text-white text-sm px-4 py-2"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter Article
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {form.items.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                      <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-4">Aucun article ajouté</p>
                      <Button
                        onClick={addItem}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter votre premier article
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Table Header */}
                      <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 border-b border-gray-100 pb-3">
                        <div className="col-span-4">ARTICLE</div>
                        <div className="col-span-2 text-center">ORDRE/TYPE</div>
                        <div className="col-span-2 text-center">TAUX</div>
                        <div className="col-span-2 text-center">MONTANT</div>
                        <div className="col-span-2 text-right">ACTIONS</div>
                      </div>

                      {/* Items */}
                      {form.items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-50 last:border-b-0"
                        >
                          <div className="col-span-4">
                            <Select
                              value={item.productId}
                              onValueChange={(value) => updateItem(item.id, 'productId', value)}
                              disabled={isLoadingProducts}
                            >
                              <SelectTrigger className="border-gray-200 focus:border-gray-900 focus:ring-gray-900">
                                <SelectValue placeholder={
                                  isLoadingProducts
                                    ? "Chargement..."
                                    : productError
                                      ? "Erreur"
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
                                      {product.title}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-2 text-center">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                              className="text-center border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                              placeholder="01"
                            />
                          </div>

                          <div className="col-span-2 text-center">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="text-center border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                              placeholder="0.00"
                            />
                          </div>

                          <div className="col-span-2 text-center">
                            <div className="text-lg font-semibold text-gray-900">
                              {formatPrice(item.total, 'TND')}
                            </div>
                          </div>

                          <div className="col-span-2 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}

                      {/* Add Item Button */}
                      <div className="pt-4">
                        <Button
                          onClick={addItem}
                          variant="ghost"
                          className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 w-full border-2 border-dashed border-gray-200 hover:border-gray-300"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter Article
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1 space-y-4">
              {/* Client Details Summary */}
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <CardTitle className="text-base font-semibold text-gray-900">
                    Détails du Client
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {form.companyName ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{form.companyName}</div>
                          <div className="text-sm text-gray-500">{form.contactPerson}</div>
                        </div>
                      </div>
                      {form.email && (
                        <div className="text-sm text-gray-600">{form.email}</div>
                      )}
                      {form.phone && (
                        <div className="text-sm text-gray-600">{form.phone}</div>
                      )}
                      {form.address && (
                        <div className="text-sm text-gray-600">{form.address}</div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Ajouter Client
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 text-sm">Aucun client sélectionné</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Basic Info */}
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <CardTitle className="text-base font-semibold text-gray-900">
                    Informations de Base
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Date de Facture</Label>
                    <div className="text-sm text-gray-900 mt-1">
                      {form.invoiceDate ? new Date(form.invoiceDate).toLocaleDateString('fr-FR') : 'Non définie'}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Date d'Échéance</Label>
                    <div className="text-sm text-gray-900 mt-1">
                      {form.dueDate ? new Date(form.dueDate).toLocaleDateString('fr-FR') : 'Non définie'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Printing Options */}
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Options d'Impression
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 mb-4">
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
                      className="space-y-4"
                    >
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Dimensions</Label>
                        <Select
                          value={form.doypacks.dimensions}
                          onValueChange={(value) => updateDoypacks('dimensions', value)}
                        >
                          <SelectTrigger className="mt-1 border-gray-200 focus:border-gray-900 focus:ring-gray-900">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="16x26+4">16 x 26 + 4 cm</SelectItem>
                            <SelectItem value="10x15+3">10 x 15 + 3 cm</SelectItem>
                            <SelectItem value="20x30+5">20 x 30 + 5 cm</SelectItem>
                            <SelectItem value="12x18+4">12 x 18 + 4 cm</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Quantité</Label>
                        <Input
                          type="number"
                          min="1"
                          value={form.doypacks.quantity}
                          onChange={(e) => updateDoypacks('quantity', parseInt(e.target.value) || 0)}
                          className="mt-1 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                          placeholder="500"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Prix par unité (TND)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.doypacks.printingPricePerUnit}
                          onChange={(e) => updateDoypacks('printingPricePerUnit', parseFloat(e.target.value) || 0)}
                          className="mt-1 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                          placeholder="0.35"
                        />
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Total impression:</span>
                          <span className="font-bold text-gray-900">
                            {formatPrice(form.doypacks.total, 'TND')}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Summary */}
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="text-gray-900">{formatPrice(form.subtotal, 'TND')}</span>
                    </div>

                    {form.totalDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Remise</span>
                        <span className="text-red-600">-{formatPrice(form.totalDiscount, 'TND')}</span>
                      </div>
                    )}

                    {form.printingCosts > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Impression</span>
                        <span className="text-gray-900">{formatPrice(form.printingCosts, 'TND')}</span>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-bold text-xl text-gray-900">
                          {formatPrice(form.total, 'TND')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button
                      onClick={() => handleSave('sent')}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-black hover:to-[#9FD000] text-white"
                    >
                      Envoyer Facture
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Aperçu
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
}
