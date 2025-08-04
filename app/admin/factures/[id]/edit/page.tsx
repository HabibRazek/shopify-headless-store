'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Eye,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Hash,
  Package,
  Plus,
  Trash2,
  Calculator,
  FileText,
  CheckSquare,
  Printer,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AdminLayout from '@/components/admin/AdminLayout';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';


interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  price?: string | number; // Direct price property
  variants?: {
    edges?: Array<{
      node: {
        id: string;
        title: string;
        price: string;
        compareAtPrice?: string;
      };
    }>;
  } | Array<{
    id: string;
    title: string;
    price: string;
    compareAtPrice?: string;
  }>;
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
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
  status: string;

  // Items and Pricing
  items: InvoiceItem[];
  doypacks: DoypackCustomization;

  // Totals
  subtotal: number;
  totalDiscount: number;
  printingCosts: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  companyName: string;
  matriculeFiscale?: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  invoiceDate: string;
  dueDate: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  subtotal: number;
  totalDiscount: number;
  printingCosts: number;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
  }>;
  printing?: {
    id: string;
    includePrinting: boolean;
    dimensions: string;
    printingPricePerUnit: number;
    quantity: number;
    total: number;
  };
}

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [form, setForm] = useState<InvoiceForm>({
    companyName: '',
    matriculeFiscale: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    status: 'DRAFT',
    items: [],
    doypacks: {
      includePrinting: false,
      dimensions: '',
      printingPricePerUnit: 0,
      quantity: 0,
      total: 0,
    },
    subtotal: 0,
    totalDiscount: 0,
    printingCosts: 0,
    total: 0,
  });

  // Helper function to safely extract price from product
  const getProductPrice = (product: ShopifyProduct): string => {
    try {
      // Try variants.edges structure (GraphQL format)
      if (product.variants && 'edges' in product.variants && product.variants.edges && Array.isArray(product.variants.edges) && product.variants.edges.length > 0) {
        const firstVariant = product.variants.edges[0]?.node;
        if (firstVariant?.price) {
          return String(firstVariant.price);
        }
      }

      // Try direct variants array (REST API format)
      if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
        const firstVariant = product.variants[0];
        if (firstVariant?.price) {
          return String(firstVariant.price);
        }
      }

      // Try priceRange (Storefront API format)
      if (product.priceRange?.minVariantPrice?.amount) {
        return String(product.priceRange.minVariantPrice.amount);
      }

      // Try any price property directly on the product
      if (product.price) {
        return String(product.price);
      }

      return '0';
    } catch (error) {
      console.error('Error extracting price from product:', error);
      return '0';
    }
  };

  // Helper function to match products by ID or name
  const findMatchingProduct = (item: InvoiceItem) => {
    // First try exact ID match
    let matchingProduct = products.find(p => p.id === item.productId);

    if (!matchingProduct) {
      // Try to match by name (case insensitive)
      matchingProduct = products.find(p =>
        p.title.toLowerCase() === item.productName.toLowerCase()
      );
    }

    if (!matchingProduct) {
      // Try to match by partial name
      matchingProduct = products.find(p =>
        p.title.toLowerCase().includes(item.productName.toLowerCase()) ||
        item.productName.toLowerCase().includes(p.title.toLowerCase())
      );
    }

    return matchingProduct;
  };

  // Fetch existing invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!params.id) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/invoices/${params.id}`);

        if (!response.ok) {
          throw new Error('Facture non trouvée');
        }

        const data = await response.json();
        const invoiceData = data.invoice;
        setInvoice(invoiceData);

        // Pre-fill form with existing data
        setForm({
          companyName: invoiceData.companyName || '',
          matriculeFiscale: invoiceData.matriculeFiscale || '',
          contactPerson: invoiceData.contactPerson || '',
          email: invoiceData.email || '',
          phone: invoiceData.phone || '',
          address: invoiceData.address || '',
          invoiceNumber: invoiceData.invoiceNumber || '',
          invoiceDate: invoiceData.invoiceDate ? invoiceData.invoiceDate.split('T')[0] : '',
          dueDate: invoiceData.dueDate ? invoiceData.dueDate.split('T')[0] : '',
          status: invoiceData.status || 'DRAFT',
          items: invoiceData.items || [],
          doypacks: {
            includePrinting: invoiceData.printing?.includePrinting || false,
            dimensions: invoiceData.printing?.dimensions || '',
            printingPricePerUnit: invoiceData.printing?.printingPricePerUnit || 0,
            quantity: invoiceData.printing?.quantity || 0,
            total: invoiceData.printing?.total || 0,
          },
          subtotal: invoiceData.subtotal || 0,
          totalDiscount: invoiceData.totalDiscount || 0,
          printingCosts: invoiceData.printingCosts || 0,
          total: invoiceData.total || 0,
        });

      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast.error('Erreur lors du chargement de la facture');
        router.push('/admin/factures');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [params.id, router]);

  // Fetch Shopify products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        const shopifyProducts = data.products?.edges?.map((edge: { node: ShopifyProduct }) => edge.node) || [];
        setProducts(shopifyProducts);

      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Erreur lors du chargement des produits');
      }
    };

    // Only fetch products after invoice data is loaded
    if (invoice && !isLoading) {
      fetchProducts();
    }
  }, [invoice, isLoading, form.items]);

  const updateForm = <K extends keyof InvoiceForm>(field: K, value: InvoiceForm[K]) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      return calculateTotals(updated);
    });
  };

  const calculateTotals = (formData: InvoiceForm) => {
    // Calculate items subtotal
    const itemsSubtotal = formData.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      const discountAmount = (itemTotal * item.discount) / 100;
      return sum + (itemTotal - discountAmount);
    }, 0);

    // Calculate total discount
    const totalDiscount = formData.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      const discountAmount = (itemTotal * item.discount) / 100;
      return sum + discountAmount;
    }, 0);

    // Calculate printing costs
    const printingCosts = formData.doypacks.includePrinting ? formData.doypacks.total : 0;

    // Calculate final total
    const total = itemsSubtotal + printingCosts;

    return {
      ...formData,
      subtotal: itemsSubtotal,
      totalDiscount,
      printingCosts,
      total,
    };
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0,
    };
    updateForm('items', [...form.items, newItem]);
  };

  const removeItem = (itemId: string) => {
    updateForm('items', form.items.filter(item => item.id !== itemId));
  };

  const updateItem = <K extends keyof InvoiceItem>(itemId: string, field: K, value: InvoiceItem[K]) => {
    try {
      const updatedItems = form.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };

          // Auto-calculate total for this item
          if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
            const quantity = Number(updatedItem.quantity) || 0;
            const unitPrice = Number(updatedItem.unitPrice) || 0;
            const discount = Number(updatedItem.discount) || 0;

            const itemSubtotal = quantity * unitPrice;
            const discountAmount = (itemSubtotal * discount) / 100;
            updatedItem.total = Math.max(0, itemSubtotal - discountAmount);
          }

          return updatedItem;
        }
        return item;
      });

      updateForm('items', updatedItems);
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Erreur lors de la mise à jour de l\'article');
    }
  };

  const updateDoypacks = <K extends keyof DoypackCustomization>(field: K, value: DoypackCustomization[K]) => {
    const updatedDoypacks = { ...form.doypacks, [field]: value };

    // Calculate doypack total
    if (field === 'quantity' || field === 'printingPricePerUnit') {
      updatedDoypacks.total = updatedDoypacks.quantity * updatedDoypacks.printingPricePerUnit;
    }

    updateForm('doypacks', updatedDoypacks);
  };

  const handleDownloadPDF = async () => {
    try {
      toast.info('Génération du PDF en cours...', {
        description: 'Création du PDF avec les données actuelles'
      });

      // Validate required fields
      if (!form.companyName || !form.contactPerson || !form.email) {
        toast.error('Informations manquantes', {
          description: 'Veuillez remplir au minimum le nom de l\'entreprise, le contact et l\'email'
        });
        return;
      }



      // If we have an existing invoice, use the API endpoint
      if (params.id && params.id !== 'create') {
        // Call the server-side PDF generation API
        const response = await fetch(`/api/admin/invoices/${params.id}/pdf`);

        if (!response.ok) {
          throw new Error('Erreur lors de la génération du PDF');
        }

        // Get the PDF blob
        const blob = await response.blob();

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Facture_${form.invoiceNumber}_${form.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success('PDF téléchargé avec succès!', {
          description: `Facture ${form.invoiceNumber} téléchargée`
        });
      } else {
        // For new invoices, show a message that they need to save first
        toast.error('Veuillez d\'abord sauvegarder la facture', {
          description: 'Le PDF ne peut être généré que pour les factures sauvegardées'
        });
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Erreur lors du téléchargement du PDF', {
        description: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  };

  const handleSave = async (status: 'draft' | 'sent' = 'draft') => {
    try {
      setIsSaving(true);

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

      // Prepare data for API
      const invoiceData = {
        ...form,
        status: status === 'sent' ? 'SENT' : form.status,
      };

      // Make API call to update invoice
      const response = await fetch(`/api/admin/invoices/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la mise à jour de la facture');
      }

      // Show success message with toast
      if (status === 'draft') {
        toast.success('Facture mise à jour avec succès!', {
          description: `Facture ${form.invoiceNumber} sauvegardée`,
          duration: 4000,
        });
      } else {
        toast.success('Facture mise à jour et envoyée!', {
          description: `Facture ${form.invoiceNumber} pour ${form.companyName}`,
          duration: 4000,
        });
      }

      // Redirect to invoice detail page
      router.push(`/admin/factures/${params.id}`);

    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Erreur lors de la mise à jour de la facture', {
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Chargement..." description="Chargement de la facture à modifier">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Chargement de la facture...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!invoice) {
    return (
      <AdminLayout title="Facture non trouvée" description="La facture à modifier n'existe pas">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Facture non trouvée</h3>
          <p className="text-gray-500 mb-6">La facture à modifier n'existe pas ou a été supprimée.</p>
          <Button onClick={() => router.push('/admin/factures')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux factures
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Modifier la facture ${form.invoiceNumber}`}
      description={`Modification de la facture pour ${form.companyName}`}
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/factures/${params.id}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Annuler
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/factures/${params.id}`)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Voir détails
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Télécharger PDF
          </Button>
          <Button
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 text-white hover:to-green-400"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Company Information */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Building className="h-5 w-5 text-green-600" />
              Informations de l'Entreprise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="companyName" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Nom de l'entreprise *
                </Label>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onChange={(e) => updateForm('companyName', e.target.value)}
                  placeholder="Nom de l'entreprise"
                  required
                />
              </div>

              <div>
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

              <div>
                <Label htmlFor="contactPerson" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personne de contact *
                </Label>
                <Input
                  id="contactPerson"
                  value={form.contactPerson}
                  onChange={(e) => updateForm('contactPerson', e.target.value)}
                  placeholder="Nom du contact"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  placeholder="email@entreprise.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Téléphone *
                </Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  placeholder="+216 XX XXX XXX"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Adresse *
                </Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => updateForm('address', e.target.value)}
                  placeholder="Adresse complète"
                  required
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Details */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-green-600" />
              Détails de la Facture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="invoiceNumber" className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Numéro de facture *
                </Label>
                <Input
                  id="invoiceNumber"
                  value={form.invoiceNumber}
                  onChange={(e) => updateForm('invoiceNumber', e.target.value)}
                  placeholder="INV-2024-001"
                  required
                />
              </div>

              <div>
                <Label htmlFor="invoiceDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date de facture *
                </Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={form.invoiceDate}
                  onChange={(e) => updateForm('invoiceDate', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="dueDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date d'échéance *
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => updateForm('dueDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="status" className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Statut
                </Label>
                <Select value={form.status} onValueChange={(value) => updateForm('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Brouillon</SelectItem>
                    <SelectItem value="SENT">Envoyée</SelectItem>
                    <SelectItem value="PAID">Payée</SelectItem>
                    <SelectItem value="OVERDUE">En retard</SelectItem>
                    <SelectItem value="CANCELLED">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Package className="h-5 w-5 text-green-600" />
              Articles de la Facture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.items.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Aucun article ajouté</p>
                <Button onClick={addItem} className="bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd]">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un article
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {form.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-gray-700">Produit</Label>
                        <div className="space-y-2">
                          <Select
                            value={(() => {
                              // First check if we have a direct product ID match
                              if (item.productId && products.find(p => p.id === item.productId)) {
                                return item.productId;
                              }

                              // Then try to find matching product by name
                              const matchingProduct = findMatchingProduct(item);
                              return matchingProduct ? matchingProduct.id : '';
                            })()}
                            onValueChange={(value) => {
                              try {
                                const selectedProduct = products.find(p => p.id === value);

                                if (selectedProduct) {
                                  // Create updated item with all changes at once
                                  const updatedItems = form.items.map(currentItem => {
                                    if (currentItem.id === item.id) {
                                      const price = getProductPrice(selectedProduct);
                                      const unitPrice = parseFloat(price) || 0;

                                      // Calculate new total
                                      const quantity = Number(currentItem.quantity) || 0;
                                      const discount = Number(currentItem.discount) || 0;
                                      const itemSubtotal = quantity * unitPrice;
                                      const discountAmount = (itemSubtotal * discount) / 100;
                                      const total = Math.max(0, itemSubtotal - discountAmount);

                                      return {
                                        ...currentItem,
                                        productId: value,
                                        productName: selectedProduct.title,
                                        unitPrice: unitPrice,
                                        total: total
                                      };
                                    }
                                    return currentItem;
                                  });

                                  // Update all items at once to ensure consistency
                                  updateForm('items', updatedItems);

                                  toast.success(`Produit mis à jour: ${selectedProduct.title}`, {
                                    duration: 2000,
                                  });
                                } else {
                                  toast.error('Produit non trouvé');
                                }
                              } catch (error) {
                                console.error('Error in product selection:', error);
                                toast.error('Erreur lors de la sélection du produit');
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder="Sélectionner un produit"
                                className={(() => {
                                  const matchingProduct = findMatchingProduct(item);
                                  return matchingProduct ? '' : 'text-gray-500';
                                })()}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {/* Show current product if not found in Shopify */}
                              {item.productName && !findMatchingProduct(item) && (
                                <SelectItem value={item.productId || 'current'} disabled>
                                  {item.productName} (Produit actuel - non disponible)
                                </SelectItem>
                              )}

                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Clear product button */}
                          {(item.productId || item.productName) && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                updateItem(item.id, 'productId', '');
                                updateItem(item.id, 'productName', '');
                                updateItem(item.id, 'unitPrice', 0);
                                toast.info('Produit effacé');
                              }}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              Effacer
                            </Button>
                          )}

                          {/* Show current product name if no matching product found in Shopify */}
                          {item.productName && !findMatchingProduct(item) && products.length > 0 && (
                            <div className="p-2 bg-amber-50 border border-amber-200 rounded-md">
                              <p className="text-sm text-amber-700">
                                <strong>Produit actuel:</strong> {item.productName}
                              </p>
                              <p className="text-xs text-amber-600 mt-1">
                                Ce produit n'est plus disponible dans Shopify. Vous pouvez sélectionner un nouveau produit ou modifier manuellement le nom.
                              </p>
                            </div>
                          )}

                          {/* Show matching info for debugging */}
                          {item.productName && findMatchingProduct(item) && (
                            <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                              <p className="text-xs text-green-600">
                                ✅ Produit trouvé: {findMatchingProduct(item)?.title}
                              </p>
                            </div>
                          )}



                          {/* Manual product name input with auto-search */}
                          <div className="relative">
                            <Input
                              key={`${item.id}-${item.productName}-${item.productId}`}
                              placeholder="Ou saisir le nom du produit manuellement"
                              value={item.productName || ''}
                              onChange={(e) => {
                                const newProductName = e.target.value;

                                // Update the product name immediately
                                updateItem(item.id, 'productName', newProductName);

                                // Try to find a matching product in Shopify
                                if (newProductName.trim().length > 2) {
                                  // Find best matching product
                                  const exactMatch = products.find(p =>
                                    p.title.toLowerCase() === newProductName.toLowerCase()
                                  );

                                  const partialMatch = products.find(p =>
                                    p.title.toLowerCase().includes(newProductName.toLowerCase()) ||
                                    newProductName.toLowerCase().includes(p.title.toLowerCase())
                                  );

                                  const matchingProduct = exactMatch || partialMatch;

                                  if (matchingProduct) {
                                    // Only auto-update if it's an exact match or very close match
                                    if (exactMatch || matchingProduct.title.toLowerCase().includes(newProductName.toLowerCase())) {
                                      updateItem(item.id, 'productId', matchingProduct.id);

                                      // Only update name if it's an exact match
                                      if (exactMatch) {
                                        updateItem(item.id, 'productName', matchingProduct.title);
                                      }

                                      const price = getProductPrice(matchingProduct);
                                      updateItem(item.id, 'unitPrice', parseFloat(price) || 0);

                                      if (exactMatch) {
                                        toast.success(`Produit trouvé: ${matchingProduct.title}`, {
                                          duration: 2000,
                                        });
                                      }
                                    }
                                  } else {
                                    // Clear product ID if no match found
                                    updateItem(item.id, 'productId', '');
                                  }
                                } else if (newProductName.trim().length === 0) {
                                  // Clear everything if input is empty
                                  updateItem(item.id, 'productId', '');
                                  updateItem(item.id, 'unitPrice', 0);
                                }
                              }}
                              className="text-sm"
                            />

                            {/* Show matching suggestions */}
                            {item.productName && item.productName.length > 2 && (
                              <div className="absolute top-full left-0 right-0 z-10 mt-1">
                                {(() => {
                                  const suggestions = products.filter(p =>
                                    p.title.toLowerCase().includes(item.productName.toLowerCase()) &&
                                    p.id !== item.productId
                                  ).slice(0, 3);

                                  if (suggestions.length > 0) {
                                    return (
                                      <div className="bg-white border border-gray-200 rounded-md shadow-lg">
                                        {suggestions.map((product) => (
                                          <button
                                            key={product.id}
                                            type="button"
                                            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                                            onClick={() => {
                                              updateItem(item.id, 'productId', product.id);
                                              updateItem(item.id, 'productName', product.title);

                                              const price = getProductPrice(product);
                                              updateItem(item.id, 'unitPrice', parseFloat(price) || 0);

                                              toast.success(`Produit sélectionné: ${product.title}`, {
                                                duration: 2000,
                                              });
                                            }}
                                          >
                                            <div className="font-medium text-gray-900">{product.title}</div>
                                            <div className="text-xs text-gray-500">
                                              Prix: {getProductPrice(product)} TND
                                            </div>
                                          </button>
                                        ))}
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Quantité</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="text-center"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Prix unitaire (TND)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Remise (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discount}
                          onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                          className="text-center"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Total</Label>
                          <p className="text-lg font-bold text-green-600">{formatPrice(item.total, 'TND')}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <Button
                  onClick={addItem}
                  variant="outline"
                  className="w-full border-dashed border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un autre article
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Printing Customization */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Printer className="h-5 w-5 text-green-600" />
              Impression Personnalisée
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includePrinting"
                checked={form.doypacks.includePrinting}
                onCheckedChange={(checked) => updateDoypacks('includePrinting', Boolean(checked))}
              />
              <Label htmlFor="includePrinting" className="text-sm font-medium">
                Inclure l'impression personnalisée
              </Label>
            </div>

            {form.doypacks.includePrinting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200"
              >
                <div>
                  <Label htmlFor="dimensions" className="text-sm font-medium text-gray-700">
                    Dimensions
                  </Label>
                  <Input
                    id="dimensions"
                    value={form.doypacks.dimensions}
                    onChange={(e) => updateDoypacks('dimensions', e.target.value)}
                    placeholder="ex: 15x20 cm"
                  />
                </div>

                <div>
                  <Label htmlFor="printingQuantity" className="text-sm font-medium text-gray-700">
                    Quantité
                  </Label>
                  <Input
                    id="printingQuantity"
                    type="number"
                    min="1"
                    value={form.doypacks.quantity}
                    onChange={(e) => updateDoypacks('quantity', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="printingPrice" className="text-sm font-medium text-gray-700">
                    Prix par unité (TND)
                  </Label>
                  <Input
                    id="printingPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.doypacks.printingPricePerUnit}
                    onChange={(e) => updateDoypacks('printingPricePerUnit', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="md:col-span-3 text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 mb-1">Total impression</p>
                  <p className="text-2xl font-bold text-blue-700">{formatPrice(form.doypacks.total, 'TND')}</p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Calculator className="h-5 w-5 text-green-600" />
              Récapitulatif Financier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-500">Sous-total</p>
                <p className="text-xl font-bold text-gray-900">{formatPrice(form.subtotal, 'TND')}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-500">Remise</p>
                <p className="text-xl font-bold text-red-600">-{formatPrice(form.totalDiscount, 'TND')}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-500">Impression</p>
                <p className="text-xl font-bold text-blue-600">{formatPrice(form.printingCosts, 'TND')}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg">
                <p className="text-sm text-green-100">Total TTC</p>
                <p className="text-2xl font-bold">{formatPrice(form.total, 'TND')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
