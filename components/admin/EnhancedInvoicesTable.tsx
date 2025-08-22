'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Filter,
  SortAsc,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  BarChart3,
  Eye,
  TrendingUp,
  TrendingDown,
  FileText,
  Mail,
  Building,
  Download,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Plus,
  Euro,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

// Invoice interface
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

interface InvoiceCounts {
  all: number;
  draft: number;
  sent: number;
  paid: number;
  overdue: number;
  cancelled: number;
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EnhancedInvoicesTable() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showStatistics, setShowStatistics] = useState(true);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const limit = 10;

  // Build query parameters
  const queryParams = new URLSearchParams({
    page: currentPage.toString(),
    limit: limit.toString(),
    search: searchQuery,
    status: statusFilter,
    sortBy,
    sortOrder,
  });

  // Fetch invoices with SWR
  const { data, error, isLoading, mutate } = useSWR(
    `/api/admin/invoices?${queryParams}`,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  const invoices: Invoice[] = data?.invoices || [];
  const totalPages = data?.pagination?.pages || 1;
  const totalInvoices = data?.pagination?.total || 0;
  const counts: InvoiceCounts = data?.counts || { all: 0, draft: 0, sent: 0, paid: 0, overdue: 0, cancelled: 0 };

  // Calculate statistics from real data
  const totalRevenue = invoices.reduce((sum: number, invoice: Invoice) => sum + invoice.total, 0);
  const avgInvoiceValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;
  const paidInvoices = invoices.filter((invoice: Invoice) => invoice.status === 'PAID').length;

  // Generate chart data for statistics
  const generateChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayInvoices = invoices.filter((invoice: Invoice) =>
        invoice.createdAt.split('T')[0] === date
      );
      return {
        date: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' }),
        invoices: dayInvoices.length,
        revenue: dayInvoices.reduce((sum: number, invoice: Invoice) => sum + invoice.total, 0)
      };
    });
  };

  const chartData = generateChartData();

  // Status distribution for pie chart
  const statusData = [
    { name: 'Brouillon', value: counts.draft, color: '#f59e0b' },
    { name: 'Envoyée', value: counts.sent, color: '#3b82f6' },
    { name: 'Payée', value: counts.paid, color: '#22c55e' },
    { name: 'En retard', value: counts.overdue, color: '#ef4444' },
    { name: 'Annulée', value: counts.cancelled, color: '#6b7280' }
  ].filter(item => item.value > 0);

  // Handle filter and sort
  const handleFilter = (status: string) => {
    setStatusFilter(status);
    setFilterDropdownOpen(false);
  };

  const handleSort = (field: string) => {
    setSortBy(field);
    setSortDropdownOpen(false);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle row selection
  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    } else {
      setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInvoices(invoices.map((invoice: Invoice) => invoice.id));
    } else {
      setSelectedInvoices([]);
    }
  };

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

      const response = await fetch(`/api/admin/invoices/${invoice.id}/pdf`);

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Facture_${invoice.invoiceNumber}_${invoice.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

      document.body.appendChild(link);
      link.click();
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
        mutate(); // Refresh data
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

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return <Badge className="gap-1 bg-gray-900 text-white hover:bg-black border-gray-900 shadow-sm"><CheckCircle className="w-3 h-3" />Payée</Badge>;
      case 'SENT':
        return <Badge className="gap-1 bg-gray-900 text-white hover:bg-black border-gray-900 shadow-sm"><Mail className="w-3 h-3" />Envoyée</Badge>;
      case 'OVERDUE':
        return <Badge className="gap-1 bg-gray-900 text-white hover:bg-black border-gray-900 shadow-sm"><AlertCircle className="w-3 h-3" />En retard</Badge>;
      case 'CANCELLED':
        return <Badge className="gap-1 bg-gray-900 text-white hover:bg-black border-gray-900 shadow-sm"><XCircle className="w-3 h-3" />Annulée</Badge>;
      case 'DRAFT':
      default:
        return <Badge className="gap-1 bg-gray-900 text-white hover:bg-black border-gray-900 shadow-sm"><Clock className="w-3 h-3" />Brouillon</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR'),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* Professional Page Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] rounded-lg flex items-center justify-center shadow-lg">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Gestion des Factures</h1>
              </div>
              <p className="text-gray-600 text-sm sm:text-lg">Créez, gérez et suivez vos factures clients de manière professionnelle</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Dernière mise à jour</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Statistics Section */}
      {showStatistics && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Aperçu des Performances</h2>
              <p className="text-sm text-gray-600 mt-1">Statistiques en temps réel de vos factures</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Données en direct</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Factures</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{counts.all}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-[#B4E50D] mr-1" />
                    <p className="text-sm text-[#6B7C00] font-medium">+12% vs mois dernier</p>
                  </div>
                  <div className="h-8 w-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <Area type="monotone" dataKey="invoices" stroke="#B4E50D" fill="#B4E50D" fillOpacity={0.3} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Chiffre d'Affaires</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{formatPrice(totalRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <Euro className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-[#B4E50D] mr-1" />
                    <p className="text-sm text-[#6B7C00] font-medium">+8% vs mois dernier</p>
                  </div>
                  <div className="h-8 w-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <Line type="monotone" dataKey="revenue" stroke="#B4E50D" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Factures Payées</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{counts.paid}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-[#B4E50D] mr-1" />
                    <p className="text-sm text-[#6B7C00] font-medium">+5% vs mois dernier</p>
                  </div>
                  <div className="h-8 w-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <Bar dataKey="invoices" fill="#B4E50D" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">En Retard</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{counts.overdue}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[#B4E50D] rounded-full mr-2"></span>
                    <p className="text-sm text-[#6B7C00] font-medium">À traiter rapidement</p>
                  </div>
                  <div className="h-8 w-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={10}
                          outerRadius={16}
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="#B4E50D" />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Separator className="my-4" />

      {/* Table Management Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Gestion des Factures</h2>
            <p className="text-sm text-gray-600 mt-1">Filtrez, triez et gérez vos factures efficacement</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Total: {totalInvoices} factures</span>
          </div>
        </div>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-gray-900">Outils de Gestion</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Primary Controls Row */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                {/* Left side controls */}
                <div className="flex items-center gap-4">
                  <DropdownMenu open={filterDropdownOpen} onOpenChange={setFilterDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtrer
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuItem onClick={() => handleFilter('all')}>
                        Tous les statuts
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleFilter('DRAFT')}>
                        Brouillon
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFilter('SENT')}>
                        Envoyée
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFilter('PAID')}>
                        Payée
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFilter('OVERDUE')}>
                        En retard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFilter('CANCELLED')}>
                        Annulée
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu open={sortDropdownOpen} onOpenChange={setSortDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <SortAsc className="h-4 w-4 mr-2" />
                        Trier
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuItem onClick={() => handleSort('createdAt')}>
                        Date de création
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('invoiceNumber')}>
                        Numéro de facture
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('total')}>
                        Montant total
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('status')}>
                        Statut
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('dueDate')}>
                        Date d'échéance
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={sortOrder === 'asc'}
                        onCheckedChange={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      >
                        Ordre croissant
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-white to-gray-50/50 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">Statistiques</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={showStatistics}
                        onChange={(e) => setShowStatistics(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gradient-to-r from-gray-200 to-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#B4E50D]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300 after:shadow-md peer-checked:bg-gradient-to-r peer-checked:from-[#B4E50D] peer-checked:to-[#9BC70A] group-hover:after:shadow-lg"></div>
                    </label>
                  </div>
                </div>

                {/* Right side controls */}
                <div className="flex items-center gap-3">
                  <Link href="/admin/factures/create">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-gray-800 hover:to-[#9BC70A] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Créer Facture
                    </Button>
                  </Link>
                </div>
              </div>

              <Separator />

              {/* Search and Filter Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Recherche et Filtres</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        placeholder="Rechercher par numéro, client, contact..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <Select value={statusFilter} onValueChange={handleFilter}>
                    <SelectTrigger className="w-full sm:w-56 border-gray-300 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="DRAFT">Brouillon</SelectItem>
                      <SelectItem value="SENT">Envoyée</SelectItem>
                      <SelectItem value="PAID">Payée</SelectItem>
                      <SelectItem value="OVERDUE">En retard</SelectItem>
                      <SelectItem value="CANCELLED">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table Section */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-gray-900">Liste des Factures</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Mise à jour en temps réel</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Chargement des factures...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-red-600 mb-2">Erreur lors du chargement des factures</p>
                  <Button variant="outline" onClick={() => mutate()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </Button>
                </div>
              </div>
            ) : invoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune facture trouvée</h3>
                <p className="text-gray-500 text-center mb-6 max-w-md">
                  Aucune facture ne correspond aux critères de recherche actuels. Créez votre première facture pour commencer.
                </p>
                <Link href="/admin/factures/create">
                  <Button className="bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] hover:from-[#9BC70A] hover:to-[#8AB309] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer ma première facture
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 border-b border-gray-100">
                      <TableHead className="w-12 pl-6 text-center">
                        <Checkbox
                          checked={selectedInvoices.length === invoices.length && invoices.length > 0}
                          onCheckedChange={handleSelectAll}
                          className="border-gray-300"
                        />
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">N° Facture</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Client</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center w-24">Montant</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Statut</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Échéance</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Date création</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => {
                      const { date: createdDate, time: createdTime } = formatDate(invoice.createdAt);
                      const { date: dueDate } = formatDate(invoice.dueDate);
                      const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status !== 'PAID';

                      return (
                        <TableRow
                          key={invoice.id}
                          className="hover:bg-gray-50/50 transition-colors cursor-pointer border-b border-gray-50"
                          onClick={() => handleViewDetails(invoice)}
                        >
                          <TableCell className="pl-6 text-center" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedInvoices.includes(invoice.id)}
                              onCheckedChange={(checked) => handleSelectInvoice(invoice.id, checked as boolean)}
                              className="border-gray-300"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-sm font-mono font-semibold text-gray-900 bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                              {invoice.invoiceNumber}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <div>
                              <div className="font-semibold text-gray-900">
                                {invoice.companyName}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {invoice.contactPerson}
                              </div>
                              {invoice.email && (
                                <div className="text-xs text-gray-400 mt-0.5">
                                  {invoice.email}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="text-center">
                              <div className="text-sm font-bold text-gray-900">
                                {formatPrice(invoice.total)}
                              </div>
                              <div className="text-xs text-gray-500">TTC</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(invoice.status)}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="text-center">
                              <div className={`text-sm font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                                {dueDate}
                              </div>
                              <div className={`text-xs ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                                {isOverdue ? 'En retard' : 'À venir'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="text-center">
                              <div className="text-sm font-semibold text-gray-900">
                                {createdDate}
                              </div>
                              <div className="text-xs text-gray-500">
                                {createdTime}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="pr-6 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600 rounded-lg shadow-sm border border-transparent hover:border-gray-200 transition-all"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem onClick={() => handleViewDetails(invoice)}>
                                    <Eye className="w-4 h-4 mr-2 text-green-600" />
                                    Voir les détails
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDownloadPDF(invoice)}>
                                    <Download className="w-4 h-4 mr-2 text-blue-600" />
                                    Télécharger PDF
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleSendEmail(invoice)}>
                                    <Mail className="w-4 h-4 mr-2 text-purple-600" />
                                    Envoyer par email
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleEdit(invoice)}>
                                    <Edit className="w-4 h-4 mr-2 text-gray-600" />
                                    Modifier
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(invoice)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Affichage de {((currentPage - 1) * limit) + 1} à {Math.min(currentPage * limit, totalInvoices)} sur {totalInvoices} factures
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0 border-gray-300 hover:bg-[#B4E50D]/10 hover:border-[#B4E50D] hover:text-[#6B7C00]"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0 border-gray-300 hover:bg-[#B4E50D]/10 hover:border-[#B4E50D] hover:text-[#6B7C00]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 p-0 ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] text-white border-[#B4E50D] hover:from-[#9BC70A] hover:to-[#8AB309]'
                              : 'border-gray-300 hover:bg-[#B4E50D]/10 hover:border-[#B4E50D] hover:text-[#6B7C00]'
                          }`}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0 border-gray-300 hover:bg-[#B4E50D]/10 hover:border-[#B4E50D] hover:text-[#6B7C00]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0 border-gray-300 hover:bg-[#B4E50D]/10 hover:border-[#B4E50D] hover:text-[#6B7C00]"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
