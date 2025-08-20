'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
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
  const stats = [
    {
      label: 'Total des demandes',
      value: requests.length,
      icon: <Package className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: '+12% ce mois',
      changeType: 'increase' as const
    },
    {
      label: 'En attente',
      value: requests.filter(r => r.status === 'PENDING').length,
      icon: <Clock className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      change: '+5% cette semaine',
      changeType: 'increase' as const
    },
    {
      label: 'Approuvées',
      value: requests.filter(r => r.status === 'APPROVED').length,
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      change: '+8% ce mois',
      changeType: 'increase' as const
    },
    {
      label: 'En production',
      value: requests.filter(r => r.status === 'IN_PRODUCTION').length,
      icon: <Package className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      change: '3 en cours',
      changeType: 'neutral' as const
    }
  ];

  return (
    <AdminLayout>
      <DataTable
        title="Service d'Impression"
        subtitle="Gestion professionnelle des demandes d'impression personnalisée"
        columns={columns}
        data={requests}
        loading={loading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher par nom, email, ID, matériau..."
        filters={[
          {
            key: 'status',
            label: 'Statut',
            options: [
              { value: 'all', label: 'Tous les statuts' },
              ...statusOptions
            ],
            value: statusFilter,
            onChange: setStatusFilter
          },
          {
            key: 'material',
            label: 'Matériau',
            options: [
              { value: 'all', label: 'Tous les matériaux' },
              ...materialOptions
            ],
            value: materialFilter,
            onChange: setMaterialFilter
          }
        ]}
        actions={
          <Button
            onClick={() => setIsNewDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white h-10 gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nouveau
          </Button>
        }
        emptyState={{
          icon: <Package className="w-16 h-16" />,
          title: 'Aucune demande trouvée',
          description: 'Aucune demande d\'impression ne correspond aux critères de recherche actuels.'
        }}

        showStats={true}
        stats={stats}
        pagination={{
          currentPage,
          pageSize,
          totalItems: requests.length,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize
        }}
      />



      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la Demande</DialogTitle>
            <DialogDescription>
              Mettre à jour le statut et ajouter des notes
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-status">Statut</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger>
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
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={updateRequest}
                disabled={updating}
              >
                {updating ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Print Demand Dialog */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle Demande d'Impression</DialogTitle>
            <DialogDescription>
              Créer une nouvelle demande d'impression personnalisée
            </DialogDescription>
          </DialogHeader>

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
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsNewDialogOpen(false)}
                disabled={creating}
              >
                Annuler
              </Button>
              <Button
                onClick={createNewRequest}
                disabled={creating || !newRequest.customerName || !newRequest.customerEmail || !newRequest.dimensions || !newRequest.deliveryDate}
                className="bg-green-600 hover:bg-green-700"
              >
                {creating ? 'Création...' : 'Créer la demande'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
