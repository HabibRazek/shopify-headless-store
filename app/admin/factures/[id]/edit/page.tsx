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
    <div className="min-h-screen bg-gray-50">
      <AdminLayout
        title={`Modifier la facture ${form.invoiceNumber}`}
        description={`Modification de la facture pour ${form.companyName}`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/factures/${params.id}`)}
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Annuler
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/factures/${params.id}`)}
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
              Voir détails
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Printer className="h-4 w-4" />
              Télécharger PDF
            </Button>
            <Button
              onClick={() => handleSave('draft')}
              disabled={isSaving}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-black hover:to-[#9FD000] text-white px-6"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
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
                <CardHeader className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        Facture: {form.invoiceNumber}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Modifiée le {new Date().toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Packedin.tn</div>
                      <div className="text-sm text-gray-500">Kings Worldwide Distribution</div>
                      <div className="text-sm text-gray-500">Megrine Business Center, Tunisia</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <Label htmlFor="invoiceNumber" className="text-sm font-medium text-gray-700">
                        Numéro de facture
                      </Label>
                      <Input
                        id="invoiceNumber"
                        value={form.invoiceNumber}
                        onChange={(e) => updateForm('invoiceNumber', e.target.value)}
                        className="mt-1 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                    <div>
                      <Label htmlFor="invoiceDate" className="text-sm font-medium text-gray-700">
                        Date de facture
                      </Label>
                      <Input
                        id="invoiceDate"
                        type="date"
                        value={form.invoiceDate}
                        onChange={(e) => updateForm('invoiceDate', e.target.value)}
                        className="mt-1 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
                        Date d'échéance
                      </Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={form.dueDate}
                        onChange={(e) => updateForm('dueDate', e.target.value)}
                        className="mt-1 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                        Statut
                      </Label>
                      <Select value={form.status} onValueChange={(value) => updateForm('status', value)}>
                        <SelectTrigger className="mt-1 border-gray-200 focus:border-gray-900 focus:ring-gray-900">
                          <SelectValue />
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

              {/* Client Details */}
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-600" />
                    Détails du Client
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                        Nom de l'entreprise *
                      </Label>
                      <Input
                        id="companyName"
                        value={form.companyName}
                        onChange={(e) => updateForm('companyName', e.target.value)}
                        placeholder="Nom de l'entreprise"
                        className="mt-1 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
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
                          exit={{ opacity: 0, y: -20 }}
                          className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-50 last:border-b-0"
                        >
                          <div className="col-span-4">
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
                              <SelectTrigger className="border-gray-200 focus:border-gray-900 focus:ring-gray-900">
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
                              <Trash2 className="h-4 w-4" />
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
                <CardHeader className="border-b border-gray-100 pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Détails du Client
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
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
                <CardHeader className="border-b border-gray-100 pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Informations de Base
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
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
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Statut</Label>
                    <div className="text-sm text-gray-900 mt-1 capitalize">
                      {form.status.toLowerCase()}
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
                      onCheckedChange={(checked) => updateDoypacks('includePrinting', Boolean(checked))}
                    />
                    <Label htmlFor="includePrinting" className="text-sm font-medium">
                      Inclure l'impression
                    </Label>
                  </div>

                  {form.doypacks.includePrinting && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Dimensions</Label>
                        <Input
                          value={form.doypacks.dimensions}
                          onChange={(e) => updateDoypacks('dimensions', e.target.value)}
                          className="mt-1 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                          placeholder="ex: 15x20 cm"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Quantité</Label>
                        <Input
                          type="number"
                          min="1"
                          value={form.doypacks.quantity}
                          onChange={(e) => updateDoypacks('quantity', parseInt(e.target.value) || 0)}
                          className="mt-1 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
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
                      disabled={isSaving}
                      className="w-full bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-black hover:to-[#9FD000] text-white"
                    >
                      Envoyer Facture
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/admin/factures/${params.id}`)}
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Aperçu
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleDownloadPDF}
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
