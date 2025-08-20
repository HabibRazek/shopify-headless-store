'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Mail,
  MoreHorizontal,
  Calendar,
  Euro,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge';
import Avatar from '@/components/admin/Avatar';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Invoice {
  id: string;
  invoiceNumber: string;
  companyName: string;
  matriculeFiscale: string;
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
}

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch invoices from API
  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          ...(searchTerm && { search: searchTerm }),
          ...(statusFilter !== 'all' && { status: statusFilter }),
        });

        console.log('Fetching invoices with params:', params.toString());
        const response = await fetch(`/api/admin/invoices?${params}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received invoice data:', data);

        if (data.error) {
          throw new Error(data.error);
        }

        setInvoices(data.invoices || []);

      } catch (error) {
        console.error('Error fetching invoices:', error);
        // Show user-friendly error message
        alert(`Erreur lors du chargement des factures: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        setInvoices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [currentPage, searchTerm, statusFilter]);



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

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'SENT':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'OVERDUE':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'DRAFT':
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  // Define table columns
  const columns = [
    {
      key: 'invoiceNumber',
      label: 'N° Facture',
      width: '140px',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm font-mono text-gray-900 bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
          {value}
        </span>
      )
    },
    {
      key: 'companyName',
      label: 'Client',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center group">
          <Avatar name={value} size="lg" variant="green" className="mr-4 shadow-lg group-hover:shadow-xl transition-shadow" />
          <div>
            <div className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{value}</div>
            <div className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
              <span>{row.contactPerson}</span>
            </div>
            {row.email && (
              <div className="text-xs text-gray-400 mt-0.5 font-medium">{row.email}</div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'total',
      label: 'Montant',
      width: '120px',
      sortable: true,
      align: 'right' as const,
      render: (value: number) => (
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(value)}
          </div>
          <div className="text-xs text-gray-500">TTC</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      width: '140px',
      sortable: true,
      render: (value: string) => (
        <StatusBadge
          status={value}
          variant={getStatusVariant(value)}
          icon={getStatusIcon(value)}
          size="lg"
        >
          {getStatusText(value)}
        </StatusBadge>
      )
    },
    {
      key: 'dueDate',
      label: 'Échéance',
      width: '140px',
      sortable: true,
      render: (value: string) => (
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-900">
            {new Date(value).toLocaleDateString('fr-FR')}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(value) < new Date() ? 'En retard' : 'À venir'}
          </div>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Date de création',
      width: '140px',
      sortable: true,
      render: (value: string) => (
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-900">
            {new Date(value).toLocaleDateString('fr-FR')}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(value).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '160px',
      align: 'right' as const,
      render: (_: any, row: any) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(row);
            }}
            className="h-9 w-9 p-0 hover:bg-green-50 hover:text-green-600 rounded-lg shadow-sm border border-transparent hover:border-green-200 transition-all"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadPDF(row);
            }}
            className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg shadow-sm border border-transparent hover:border-blue-200 transition-all"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleSendEmail(row);
            }}
            className="h-9 w-9 p-0 hover:bg-purple-50 hover:text-purple-600 rounded-lg shadow-sm border border-transparent hover:border-purple-200 transition-all"
          >
            <Mail className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  // Calculate statistics
  const stats = [
    {
      label: 'Total des factures',
      value: invoices.length,
      icon: <FileText className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: '+12% ce mois',
      changeType: 'increase' as const
    },
    {
      label: 'Factures payées',
      value: invoices.filter(i => i.status === 'PAID').length,
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      change: '+8% ce mois',
      changeType: 'increase' as const
    },
    {
      label: 'En attente',
      value: invoices.filter(i => i.status === 'SENT').length,
      icon: <Clock className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      change: '5 nouvelles',
      changeType: 'neutral' as const
    },
    {
      label: 'En retard',
      value: invoices.filter(i => i.status === 'OVERDUE').length,
      icon: <AlertCircle className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      change: '-2% ce mois',
      changeType: 'decrease' as const
    }
  ];

  // Filter invoices based on search and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  // Action handlers
  const handleViewDetails = (invoice: Invoice) => {
    router.push(`/admin/factures/${invoice.id}`);
  };

  const handleEdit = (invoice: Invoice) => {
    router.push(`/admin/factures/${invoice.id}/edit`);
  };

  const handleSendEmail = async (invoice: Invoice) => {
    try {
      toast.info('Envoi de l\'email en cours...', {
        description: `Facture ${invoice.invoiceNumber}`,
      });

      const response = await fetch(`/api/admin/invoices/${invoice.id}/send-email`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'email');
      }

      toast.success('Email envoyé avec succès!', {
        description: `Facture ${invoice.invoiceNumber} envoyée à ${invoice.email}`,
      });

    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Erreur lors de l\'envoi de l\'email', {
        description: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  };



  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      toast.info('Génération du PDF en cours...', {
        description: `Facture ${invoice.invoiceNumber}`,
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
        description: `Facture ${invoice.invoiceNumber} téléchargée`,
      });

    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Erreur lors du téléchargement du PDF', {
        description: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  };

  const handleDelete = async (invoice: Invoice) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la facture ${invoice.invoiceNumber} ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Facture supprimée avec succès!', {
          description: `Facture ${invoice.invoiceNumber} supprimée`,
        });

        // Refresh the invoice list
        setInvoices(prev => prev.filter(inv => inv.id !== invoice.id));
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Erreur lors de la suppression', {
        description: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  };

  return (
    <AdminLayout>
      <DataTable
        title="Gestion des Factures"
        subtitle="Créez, gérez et suivez vos factures clients de manière professionnelle"
        columns={columns}
        data={invoices}
        loading={isLoading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher par numéro, client, contact..."
        filters={[
          {
            key: 'status',
            label: 'Statut',
            options: [
              { value: 'all', label: 'Tous les statuts' },
              { value: 'DRAFT', label: 'Brouillon' },
              { value: 'SENT', label: 'Envoyée' },
              { value: 'PAID', label: 'Payée' },
              { value: 'OVERDUE', label: 'En retard' },
              { value: 'CANCELLED', label: 'Annulée' }
            ],
            value: statusFilter,
            onChange: setStatusFilter
          }
        ]}
        actions={
          <Link href="/admin/factures/create">
            <Button className="bg-green-600 hover:bg-green-700 text-white h-10 gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              Créer Facture
            </Button>
          </Link>
        }
        emptyState={{
          icon: <FileText className="w-16 h-16" />,
          title: 'Aucune facture trouvée',
          description: 'Aucune facture ne correspond aux critères de recherche actuels. Créez votre première facture pour commencer.'
        }}
        onRowClick={(invoice) => handleViewDetails(invoice)}
        showStats={true}
        stats={stats}
      />
    </AdminLayout>
  );
}
