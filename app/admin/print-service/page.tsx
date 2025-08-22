'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import Avatar from '@/components/admin/Avatar';
import {
  Edit,
  Download,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Mail,
  Plus,
  User,
  Search,
  MoreHorizontal,
  RefreshCw,
  FileText,
  Calendar,
  Printer
} from 'lucide-react';

interface PrintServiceRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  material: 'KRAFT_VIEW' | 'KRAFT_ALU';
  dimensions: string;
  quantity: number;
  deliveryDate: string;
  designFileUrl?: string;
  designFileName?: string;
  notes?: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = [
  { value: 'PENDING', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'IN_REVIEW', label: 'En révision', color: 'bg-blue-100 text-blue-800' },
  { value: 'APPROVED', label: 'Approuvée', color: 'bg-green-100 text-green-800' },
  { value: 'IN_PRODUCTION', label: 'En production', color: 'bg-purple-100 text-purple-800' },
  { value: 'READY', label: 'Prête', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'DELIVERED', label: 'Livrée', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Annulée', color: 'bg-red-100 text-red-800' }
];

const materialOptions = [
  { value: 'KRAFT_VIEW', label: 'Kraft View' },
  { value: 'KRAFT_ALU', label: 'Kraft Alu' }
];

export default function PrintServiceAdminPage() {
  const [requests, setRequests] = useState<PrintServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<PrintServiceRequest | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editAdminNotes, setEditAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // New print demand state
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    company: '',
    material: 'KRAFT_VIEW' as 'KRAFT_VIEW' | 'KRAFT_ALU',
    dimensions: '',
    quantity: 300,
    deliveryDate: '',
    notes: ''
  });
  const [creating, setCreating] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
      if (materialFilter && materialFilter !== 'all') params.append('material', materialFilter);

      const response = await fetch(`/api/print-service?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      } else {
        toast.error('Erreur lors du chargement des demandes');
      }
    } catch {
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, materialFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);







  const openEditDialog = (request: PrintServiceRequest) => {
    setSelectedRequest(request);
    setEditStatus(request.status);
    setEditAdminNotes(request.adminNotes || '');
    setIsEditDialogOpen(true);
  };

  const updateRequest = async () => {
    if (!selectedRequest) return;

    try {
      setUpdating(true);
      const response = await fetch(`/api/print-service/${selectedRequest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editStatus,
          adminNotes: editAdminNotes
        }),
      });

      if (response.ok) {
        toast.success('Demande mise à jour avec succès');
        setIsEditDialogOpen(false);
        fetchRequests();
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  const downloadDesignFile = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const createNewRequest = async () => {
    try {
      setCreating(true);
      const response = await fetch('/api/print-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newRequest,
          status: 'PENDING'
        }),
      });

      if (response.ok) {
        toast.success('Demande créée avec succès');
        setIsNewDialogOpen(false);
        setNewRequest({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          company: '',
          material: 'KRAFT_VIEW',
          dimensions: '',
          quantity: 300,
          deliveryDate: '',
          notes: ''
        });
        fetchRequests();
      } else {
        toast.error('Erreur lors de la création de la demande');
      }
    } catch {
      toast.error('Erreur lors de la création de la demande');
    } finally {
      setCreating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'IN_REVIEW':
        return <Eye className="w-4 h-4" />;
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'IN_PRODUCTION':
        return <Package className="w-4 h-4" />;
      case 'READY':
        return <CheckCircle className="w-4 h-4" />;
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };



  // Define table columns with enhanced features
  const columns = [
    {
      key: 'id',
      label: 'ID',
      width: '120px',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm font-mono text-gray-900 bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
          #{value.slice(-8)}
        </span>
      )
    },
    {
      key: 'customerName',
      label: 'Client',
      sortable: true,
      render: (value: string, row: PrintServiceRequest) => (
        <div className="flex items-center group">
          <Avatar name={value} size="lg" variant="green" className="mr-4 shadow-lg group-hover:shadow-xl transition-shadow" />
          <div>
            <div className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{value}</div>
            <div className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5" />
              {row.customerEmail}
            </div>
            {row.company && (
              <div className="text-xs text-gray-400 mt-0.5 font-medium">{row.company}</div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'material',
      label: 'Matériau',
      width: '140px',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
          value === 'kraft_view'
            ? 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300'
            : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300'
        }`}>
          {value === 'kraft_view' ? 'Kraft View' : 'Kraft Alu'}
        </span>
      )
    },
    {
      key: 'dimensions',
      label: 'Dimensions',
      width: '120px',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm font-mono font-semibold text-gray-900 bg-gray-50 px-2 py-1 rounded border">{value} cm</span>
      )
    },
    {
      key: 'quantity',
      label: 'Quantité',
      width: '120px',
      sortable: true,
      render: (value: number) => (
        <div className="text-center">
          <span className="text-lg font-bold text-gray-900">{value.toLocaleString()}</span>
          <div className="text-xs text-gray-500 font-medium">unités</div>
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
          icon={getStatusIcon(value)}
          size="lg"
        >
          {statusOptions.find(s => s.value === value)?.label}
        </StatusBadge>
      )
    },
    {
      key: 'createdAt',
      label: 'Date',
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
      width: '140px',
      align: 'right' as const,
      render: (_: string, row: PrintServiceRequest) => (
        <div className="flex items-center justify-end gap-2">

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              openEditDialog(row);
            }}
            className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg shadow-sm border border-transparent hover:border-blue-200 transition-all"
          >
            <Edit className="w-4 h-4" />
          </Button>
          {row.designFileUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                downloadDesignFile(row.designFileUrl!, row.designFileName || 'design');
              }}
              className="h-9 w-9 p-0 hover:bg-purple-50 hover:text-purple-600 rounded-lg shadow-sm border border-transparent hover:border-purple-200 transition-all"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ];

  // Calculate statistics
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'PENDING').length,
    approved: requests.filter(r => r.status === 'APPROVED').length,
    inProduction: requests.filter(r => r.status === 'IN_PRODUCTION').length
  };

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-full overflow-hidden">
        {/* Professional Page Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-4 sm:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] rounded-lg flex items-center justify-center shadow-lg">
                    <Printer className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Service d'Impression</h1>
                </div>
                <p className="text-gray-600 text-sm sm:text-lg">Gestion professionnelle des demandes d'impression personnalisée</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total demandes</p>
                  <p className="text-sm font-medium text-gray-900">{requests.length}</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Aperçu des Demandes</h2>
              <p className="text-sm text-gray-600 mt-1">Statistiques en temps réel de vos demandes d'impression</p>
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
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Demandes</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">En Attente</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Approuvées</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.approved}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">En Production</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.inProduction}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Controls Section */}
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-gray-900">Actions et Filtres</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Temps réel</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-gray-800 hover:to-[#9BC70A] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setIsNewDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Demande
                </Button>
              </div>
            </div>

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
                      placeholder="Rechercher par nom, email, ID, matériau..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-56 border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={materialFilter} onValueChange={setMaterialFilter}>
                  <SelectTrigger className="w-full sm:w-56 border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Filtrer par matériau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les matériaux</SelectItem>
                    {materialOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table Section */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-gray-900">Liste des Demandes d'Impression</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Mise à jour en temps réel</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Chargement des demandes...</span>
              </div>
            ) : requests.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune demande trouvée</h3>
                  <p className="text-gray-500 mb-6">Aucune demande d'impression ne correspond aux critères de recherche actuels.</p>
                  <Button
                    onClick={() => setIsNewDialogOpen(true)}
                    className="bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-gray-800 hover:to-[#9BC70A] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer la première demande
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 bg-gray-50/50">
                      <TableHead className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Client
                      </TableHead>
                      <TableHead className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Matériau
                      </TableHead>
                      <TableHead className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Dimensions
                      </TableHead>
                      <TableHead className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Quantité
                      </TableHead>
                      <TableHead className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Statut
                      </TableHead>
                      <TableHead className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date Livraison
                      </TableHead>
                      <TableHead className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow
                        key={request.id}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="py-4 px-6">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {request.customerName}
                            </div>
                            <div className="text-sm text-gray-500">{request.customerEmail}</div>
                            {request.company && (
                              <div className="text-xs text-gray-400 mt-0.5">{request.company}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge
                            variant={request.material === 'KRAFT_VIEW' ? 'secondary' : 'default'}
                            className="text-xs font-medium"
                          >
                            {request.material === 'KRAFT_VIEW' ? 'Kraft View' : 'Kraft Alu'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-center">
                          <span className="text-sm font-mono font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded border">
                            {request.dimensions} cm
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#B4E50D]/10 text-[#6B7C00] border border-[#B4E50D]/20">
                            {request.quantity.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-center">
                          <Badge
                            variant={
                              request.status === 'PENDING' ? 'secondary' :
                              request.status === 'APPROVED' ? 'default' :
                              request.status === 'IN_PRODUCTION' ? 'secondary' :
                              request.status === 'DELIVERED' ? 'default' :
                              request.status === 'CANCELLED' ? 'destructive' : 'secondary'
                            }
                            className={`text-xs font-medium ${
                              request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                              request.status === 'IN_PRODUCTION' ? 'bg-blue-100 text-blue-800' :
                              request.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                              request.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {statusOptions.find(s => s.value === request.status)?.label || request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(request.deliveryDate).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(request.deliveryDate).toLocaleDateString('fr-FR', { weekday: 'short' })}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setEditStatus(request.status);
                                  setEditAdminNotes(request.adminNotes || '');
                                  setIsEditDialogOpen(true);
                                }}
                                className="cursor-pointer"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              {request.designFileUrl && (
                                <DropdownMenuItem
                                  onClick={() => window.open(request.designFileUrl, '_blank')}
                                  className="cursor-pointer"
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Télécharger fichier
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Drawer */}
      <Drawer open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DrawerContent className="max-w-2xl mx-auto">
          <DrawerHeader className="border-b border-gray-100 pb-4">
            <DrawerTitle className="text-xl font-semibold text-gray-900">
              Modifier la Demande
            </DrawerTitle>
            <DrawerDescription className="text-gray-600">
              Mettre à jour le statut et ajouter des notes
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-status">Statut</Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-admin-notes">Notes Administrateur</Label>
                <Textarea
                  id="edit-admin-notes"
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  placeholder="Ajouter des notes internes..."
                  rows={4}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </Button>
                <Button
                  onClick={updateRequest}
                  disabled={updating}
                  className="bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-gray-800 hover:to-[#9BC70A] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    'Mettre à jour'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* New Print Demand Drawer */}
      <Drawer open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DrawerContent className="max-w-4xl mx-auto">
          <DrawerHeader className="border-b border-gray-100 pb-4">
            <DrawerTitle className="text-xl font-semibold text-gray-900">
              Nouvelle Demande d'Impression
            </DrawerTitle>
            <DrawerDescription className="text-gray-600">
              Créer une nouvelle demande d'impression personnalisée
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations Client
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Nom du client *</Label>
                  <input
                    id="customerName"
                    type="text"
                    value={newRequest.customerName}
                    onChange={(e) => setNewRequest({...newRequest, customerName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Nom complet"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email *</Label>
                  <input
                    id="customerEmail"
                    type="email"
                    value={newRequest.customerEmail}
                    onChange={(e) => setNewRequest({...newRequest, customerEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="email@exemple.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Téléphone</Label>
                  <input
                    id="customerPhone"
                    type="tel"
                    value={newRequest.customerPhone}
                    onChange={(e) => setNewRequest({...newRequest, customerPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="+216 XX XXX XXX"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Entreprise</Label>
                  <input
                    id="company"
                    type="text"
                    value={newRequest.company}
                    onChange={(e) => setNewRequest({...newRequest, company: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Nom de l'entreprise"
                  />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Package className="w-5 h-5" />
                Détails du Produit
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="material">Matériau *</Label>
                  <Select value={newRequest.material} onValueChange={(value: 'KRAFT_VIEW' | 'KRAFT_ALU') => setNewRequest({...newRequest, material: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un matériau" />
                    </SelectTrigger>
                    <SelectContent>
                      {materialOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dimensions">Dimensions (cm) *</Label>
                  <input
                    id="dimensions"
                    type="text"
                    value={newRequest.dimensions}
                    onChange={(e) => setNewRequest({...newRequest, dimensions: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="ex: 10×15, 12×20"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantité (min. 300) *</Label>
                  <input
                    id="quantity"
                    type="number"
                    min="300"
                    value={newRequest.quantity}
                    onChange={(e) => setNewRequest({...newRequest, quantity: parseInt(e.target.value) || 300})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryDate">Date de livraison souhaitée *</Label>
                  <input
                    id="deliveryDate"
                    type="date"
                    value={newRequest.deliveryDate}
                    onChange={(e) => setNewRequest({...newRequest, deliveryDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes additionnelles</Label>
              <Textarea
                id="notes"
                value={newRequest.notes}
                onChange={(e) => setNewRequest({...newRequest, notes: e.target.value})}
                placeholder="Informations supplémentaires, instructions spéciales..."
                rows={3}
                className="w-full"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsNewDialogOpen(false)}
                disabled={creating}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </Button>
              <Button
                onClick={createNewRequest}
                disabled={creating || !newRequest.customerName || !newRequest.customerEmail || !newRequest.dimensions || !newRequest.deliveryDate}
                className="bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-gray-800 hover:to-[#9BC70A] text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {creating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  'Créer la demande'
                )}
              </Button>
            </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </AdminLayout>
  );
}
