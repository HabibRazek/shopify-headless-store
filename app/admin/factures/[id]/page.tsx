'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
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
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Invoice Header */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="border-b border-gray-100 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Facture: {invoice.invoiceNumber}
                    </CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                      Créée le {new Date(invoice.createdAt).toLocaleDateString('fr-FR')}
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
                <div className="flex items-center justify-between">
                  <Badge className={`${getStatusColor(invoice.status)} border flex items-center gap-2 px-3 py-1`}>
                    {getStatusIcon(invoice.status)}
                    {getStatusText(invoice.status)}
                  </Badge>
                  <div className="text-sm text-gray-600">
                    Dernière modification: {new Date(invoice.updatedAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Information */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="border-b border-gray-100 pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-600" />
                  Détails du Client
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700">Nom de l'entreprise</label>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{invoice.companyName}</p>
                  </div>

                  {invoice.matriculeFiscale && (
                    <div>
                      <label className="text-xs font-medium text-gray-700">Matricule Fiscale</label>
                      <p className="text-sm text-gray-900 mt-1">{invoice.matriculeFiscale}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-medium text-gray-700">Personne de contact</label>
                    <p className="text-sm text-gray-900 mt-1">{invoice.contactPerson}</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900 mt-1">{invoice.email}</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700">Téléphone</label>
                    <p className="text-sm text-gray-900 mt-1">{invoice.phone}</p>
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-xs font-medium text-gray-700">Adresse</label>
                    <p className="text-sm text-gray-900 mt-1">{invoice.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>





            {/* Invoice Items */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="border-b border-gray-100 pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-600" />
                  Détails des Articles ({invoice.items?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {invoice.items && invoice.items.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                          <th className="text-center py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Qté</th>
                          <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Prix Unit.</th>
                          <th className="text-center py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Remise</th>
                          <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                              {item.productId && (
                                <p className="text-xs text-gray-500">ID: {item.productId}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-sm font-medium text-gray-900">
                          {formatPrice(item.unitPrice, invoice.currency)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {item.discount > 0 ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              -{item.discount}%
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right text-sm font-bold text-gray-900">
                          {formatPrice(item.total, invoice.currency)}
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
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 mb-4">Aucun article dans cette facture</p>
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
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Building className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{invoice.companyName}</div>
                      <div className="text-sm text-gray-500">{invoice.contactPerson}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{invoice.email}</div>
                  <div className="text-sm text-gray-600">{invoice.phone}</div>
                  <div className="text-sm text-gray-600">{invoice.address}</div>
                </div>
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
                  <label className="text-xs font-medium text-gray-700">Date de Facture</label>
                  <div className="text-sm text-gray-900 mt-1">
                    {new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">Date d'Échéance</label>
                  <div className="text-sm text-gray-900 mt-1">
                    {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">Statut</label>
                  <div className="text-sm text-gray-900 mt-1 capitalize">
                    {getStatusText(invoice.status)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Printing Options */}
            {invoice.printing?.includePrinting && (
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <CardTitle className="text-base font-semibold text-gray-900">
                    Options d'Impression
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Dimensions</label>
                      <div className="text-sm text-gray-900 mt-1">{invoice.printing.dimensions}</div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Quantité</label>
                      <div className="text-sm text-gray-900 mt-1">{invoice.printing.quantity}</div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Prix par unité</label>
                      <div className="text-sm text-gray-900 mt-1">
                        {formatPrice(invoice.printing.printingPricePerUnit, invoice.currency)}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-700">Total impression:</span>
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(invoice.printingCosts, invoice.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Summary */}
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="text-gray-900">{formatPrice(invoice.subtotal, invoice.currency)}</span>
                  </div>

                  {invoice.totalDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remise</span>
                      <span className="text-red-600">-{formatPrice(invoice.totalDiscount, invoice.currency)}</span>
                    </div>
                  )}

                  {invoice.printingCosts > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Impression</span>
                      <span className="text-gray-900">{formatPrice(invoice.printingCosts, invoice.currency)}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-xl text-gray-900">
                        {formatPrice(invoice.total, invoice.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    onClick={handleEdit}
                    className="w-full bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-black hover:to-[#9FD000] text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier Facture
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleDownload}
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDelete}
                      className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
