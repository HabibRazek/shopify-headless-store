'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Printer,
  Download,
  Trash2,
  Building,
  Hash,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Package,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/components/admin/AdminLayout';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';


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
    productId?: string;
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

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!params.id) {
        console.log('No invoice ID provided');
        return;
      }
      
      console.log('Fetching invoice with ID:', params.id);
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/invoices/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Facture non trouvée');
          }
          throw new Error('Erreur lors du chargement de la facture');
        }
        
        const data = await response.json();
        if (data.invoice) {
          setInvoice(data.invoice);
        } else {
          throw new Error('Données de facture invalides');
        }
        
      } catch (error) {
        console.error('Error fetching invoice:', error);
        setInvoice(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [params.id, router]);

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'SENT':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'OVERDUE':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      case 'DRAFT':
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'SENT':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'OVERDUE':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'CANCELLED':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'DRAFT':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'Payée';
      case 'SENT':
        return 'Envoyée';
      case 'OVERDUE':
        return 'En retard';
      case 'CANCELLED':
        return 'Annulée';
      case 'DRAFT':
      default:
        return 'Brouillon';
    }
  };

  // Action handlers
  const handleEdit = () => {
    router.push(`/admin/factures/${invoice?.id}/edit`);
  };

  const handleDownload = async () => {
    if (!invoice) {
      toast.error('Aucune facture à télécharger');
      return;
    }

    try {
      toast.info('Génération du PDF en cours...', {
        description: 'Veuillez patienter pendant la création du document'
      });

      // Call the server-side PDF generation API
      const response = await fetch(`/api/admin/invoices/${invoice.id}/pdf`);

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Facture_${invoice.invoiceNumber}_${invoice.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('PDF téléchargé avec succès!', {
        description: `Facture ${invoice.invoiceNumber} téléchargée`
      });

    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Erreur lors du téléchargement du PDF', {
        description: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  };

  const handlePrint = async () => {
    if (!invoice) {
      toast.error('Aucune facture à imprimer');
      return;
    }

    try {
      toast.info('Ouverture pour impression...', {
        description: 'La facture va s\'ouvrir dans une nouvelle fenêtre'
      });

      // Open the print-specific URL in a new window
      const printUrl = `/api/admin/invoices/${invoice.id}/print`;
      const newWindow = window.open(printUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');

      if (!newWindow) {
        throw new Error('Impossible d\'ouvrir la fenêtre. Vérifiez que les popups ne sont pas bloqués.');
      }

      toast.success('Facture ouverte pour impression!', {
        description: `Utilisez Ctrl+P pour imprimer`
      });

    } catch (error) {
      console.error('Error opening print view:', error);
      toast.error('Erreur lors de l\'ouverture pour impression', {
        description: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  };

  const handleDelete = async () => {
    if (!invoice || !confirm(`Êtes-vous sûr de vouloir supprimer la facture ${invoice.invoiceNumber} ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Facture supprimée avec succès!');
        router.push('/admin/factures');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Chargement..." description="Chargement des détails de la facture">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Chargement de la facture...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!invoice) {
    return (
      <AdminLayout title="Facture non trouvée" description="La facture demandée n'existe pas">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Facture non trouvée</h3>
          <p className="text-gray-500 mb-6">La facture demandée n'existe pas ou a été supprimée.</p>
          <Button onClick={() => router.push('/admin/factures')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux factures
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const actionButtons = (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        onClick={() => router.push('/admin/factures')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>
      <Button
        variant="outline"
        onClick={handleEdit}
        className="flex items-center gap-2"
      >
        <Edit className="h-4 w-4" />
        Modifier
      </Button>
      <Button
        variant="outline"
        onClick={handlePrint}
        className="flex items-center gap-2"
      >
        <Printer className="h-4 w-4" />
        Imprimer
      </Button>
      <Button
        variant="outline"
        onClick={handleDownload}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Télécharger PDF
      </Button>
      <Button
        variant="outline"
        onClick={handleDelete}
        className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        Supprimer
      </Button>
    </div>
  );

  return (
    <AdminLayout
      title={`Facture ${invoice.invoiceNumber}`}
      description={`Détails de la facture pour ${invoice.companyName}`}
      actions={actionButtons}
    >
      <div className="space-y-6">
        {/* Invoice Header */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {invoice.invoiceNumber}
                </CardTitle>
                <p className="text-gray-500 mt-1">
                  Créée le {new Date(invoice.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <Badge className={`${getStatusColor(invoice.status)} border flex items-center gap-2 px-4 py-2`}>
                {getStatusIcon(invoice.status)}
                {getStatusText(invoice.status)}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Company Information */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Building className="h-5 w-5 text-green-600" />
              Informations Client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Entreprise</label>
              <p className="text-lg font-semibold text-gray-900">{invoice.companyName}</p>
            </div>

            {invoice.matriculeFiscale && (
              <div>
                <label className="text-sm font-medium text-gray-500">Matricule Fiscale</label>
                <p className="text-gray-900">{invoice.matriculeFiscale}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-500">Contact</label>
              <p className="text-gray-900">{invoice.contactPerson}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{invoice.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Téléphone</label>
              <p className="text-gray-900">{invoice.phone}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Adresse</label>
              <p className="text-gray-900">{invoice.address}</p>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Invoice Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-green-600" />
                Détails de la Facture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-sm font-medium text-gray-500 block mb-1">Date de facture</label>
                  <p className="font-semibold text-gray-900">
                    {new Date(invoice.invoiceDate).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-sm font-medium text-gray-500 block mb-1">Date d'échéance</label>
                  <p className="font-semibold text-gray-900">
                    {new Date(invoice.dueDate).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-sm font-medium text-gray-500 block mb-1">Devise</label>
                  <p className="font-semibold text-gray-900">{invoice.currency}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-sm font-medium text-gray-500 block mb-1">Dernière modification</label>
                  <p className="font-semibold text-gray-900">
                    {new Date(invoice.updatedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-green-600" />
                Statistiques Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <label className="text-sm font-medium text-blue-600 block mb-1">Nombre d'articles</label>
                  <p className="text-2xl font-bold text-blue-700">
                    {invoice.items?.length || 0}
                  </p>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <label className="text-sm font-medium text-green-600 block mb-1">Quantité totale</label>
                  <p className="text-2xl font-bold text-green-700">
                    {invoice.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <label className="text-sm font-medium text-purple-600 block mb-1">Prix moyen/article</label>
                  <p className="text-lg font-bold text-purple-700">
                    {invoice.items && invoice.items.length > 0
                      ? formatPrice(
                          invoice.items.reduce((sum, item) => sum + item.unitPrice, 0) / invoice.items.length,
                          invoice.currency
                        )
                      : formatPrice(0, invoice.currency)
                    }
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <label className="text-sm font-medium text-amber-600 block mb-1">Remise totale</label>
                  <p className="text-lg font-bold text-amber-700">
                    {invoice.totalDiscount > 0
                      ? `-${formatPrice(invoice.totalDiscount, invoice.currency)}`
                      : 'Aucune'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Items */}
        {invoice.items && invoice.items.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Package className="h-5 w-5 text-green-600" />
                Articles ({invoice.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Article</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Quantité</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Prix unitaire</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Remise</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <ShoppingCart className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.productName}</p>
                              {item.productId && (
                                <p className="text-sm text-gray-500">ID: {item.productId}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right text-gray-900 font-medium">
                          {formatPrice(item.unitPrice, invoice.currency)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {item.discount > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              -{item.discount}%
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="font-semibold text-gray-900">
                            {formatPrice(item.total, invoice.currency)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200 bg-gray-50">
                      <td colSpan={4} className="py-3 px-4 text-right font-medium text-gray-700">
                        Sous-total des articles:
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-gray-900">
                        {formatPrice(
                          invoice.items.reduce((sum, item) => sum + item.total, 0),
                          invoice.currency
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Printing Details */}
        {invoice.printing?.includePrinting && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Printer className="h-5 w-5 text-green-600" />
                Impression Personnalisée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-500 block mb-1">Dimensions</label>
                  <p className="text-lg font-semibold text-gray-900">{invoice.printing.dimensions}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-500 block mb-1">Quantité</label>
                  <p className="text-lg font-semibold text-gray-900">{invoice.printing.quantity}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-500 block mb-1">Prix par unité</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPrice(invoice.printing.printingPricePerUnit, invoice.currency)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <label className="text-sm font-medium text-green-600 block mb-1">Total impression</label>
                  <p className="text-xl font-bold text-green-700">
                    {formatPrice(invoice.printing.total, invoice.currency)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Invoice Totals */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Hash className="h-5 w-5 text-green-600" />
              Récapitulatif Financier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Items Summary */}
              {invoice.items && invoice.items.length > 0 && (
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-green-600" />
                    Articles ({invoice.items.length})
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sous-total articles:</span>
                      <span className="font-semibold">
                        {formatPrice(
                          invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
                          invoice.currency
                        )}
                      </span>
                    </div>
                    {invoice.totalDiscount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Remises appliquées:</span>
                        <span className="font-semibold text-red-600">
                          -{formatPrice(invoice.totalDiscount, invoice.currency)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="font-medium text-gray-700">Total articles:</span>
                      <span className="font-bold text-gray-900">
                        {formatPrice(invoice.subtotal, invoice.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Printing Summary */}
              {invoice.printing?.includePrinting && invoice.printingCosts > 0 && (
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Printer className="h-4 w-4 text-blue-600" />
                    Impression Personnalisée
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Coût impression:</span>
                      <span className="font-bold text-blue-600">
                        {formatPrice(invoice.printingCosts, invoice.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              {/* Grand Total */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-lg text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-green-100 text-sm">Total TTC</span>
                    <p className="text-2xl font-bold">
                      {formatPrice(invoice.total, invoice.currency)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-green-100 text-sm">Statut</span>
                    <p className="text-lg font-semibold">
                      {getStatusText(invoice.status)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
