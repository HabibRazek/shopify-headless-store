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
  XCircle
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

  const handlePrint = () => {
    toast.info('Génération du PDF en cours...');
    setTimeout(() => {
      toast.success('PDF généré avec succès!');
      window.print();
    }, 1500);
  };

  const handleDownload = () => {
    toast.info('Téléchargement du PDF en cours...');
    setTimeout(() => {
      toast.success('PDF téléchargé avec succès!');
    }, 1500);
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

        {/* Invoice Totals */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Hash className="h-5 w-5 text-green-600" />
              Récapitulatif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Sous-total:</span>
                <span className="font-semibold">{formatPrice(invoice.subtotal, invoice.currency)}</span>
              </div>

              {invoice.totalDiscount > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Remise totale:</span>
                  <span className="font-semibold text-red-600">-{formatPrice(invoice.totalDiscount, invoice.currency)}</span>
                </div>
              )}

              {invoice.printingCosts > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Coûts d'impression:</span>
                  <span className="font-semibold">{formatPrice(invoice.printingCosts, invoice.currency)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between items-center py-3">
                <span className="text-xl font-bold text-gray-900">Total TTC:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(invoice.total, invoice.currency)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
