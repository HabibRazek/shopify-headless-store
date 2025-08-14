'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Package,
  Calendar,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Hash,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
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
  const [statusFilter, setStatusFilter] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<PrintServiceRequest | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editAdminNotes, setEditAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, materialFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (materialFilter) params.append('material', materialFilter);

      const response = await fetch(`/api/print-service?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      } else {
        toast.error('Erreur lors du chargement des demandes');
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request =>
    request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return (
      <Badge className={statusOption?.color || 'bg-gray-100 text-gray-800'}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  const getMaterialBadge = (material: string) => {
    const materialOption = materialOptions.find(option => option.value === material);
    return (
      <Badge variant="outline">
        {materialOption?.label || material}
      </Badge>
    );
  };

  const openDetailDialog = (request: PrintServiceRequest) => {
    setSelectedRequest(request);
    setIsDetailDialogOpen(true);
  };

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
    } catch (error) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Service d'Impression</h1>
        <p className="text-gray-600">Gestion des demandes d'impression personnalisée</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nom, email, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="material-filter">Matériau</Label>
              <Select value={materialFilter} onValueChange={setMaterialFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les matériaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les matériaux</SelectItem>
                  {materialOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={fetchRequests} variant="outline" className="w-full">
                Actualiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusOptions.slice(0, 4).map((status) => {
          const count = requests.filter(r => r.status === status.value).length;
          return (
            <Card key={status.value}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{status.label}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <div className={`p-2 rounded-full ${status.color}`}>
                    {getStatusIcon(status.value)}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes d'Impression ({filteredRequests.length})</CardTitle>
          <CardDescription>
            Liste de toutes les demandes d'impression personnalisée
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune demande trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-medium text-gray-900">{request.customerName}</h3>
                        {getStatusBadge(request.status)}
                        {getMaterialBadge(request.material)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {request.customerEmail}
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          {request.dimensions} cm - {request.quantity} unités
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(request.deliveryDate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailDialog(request)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(request)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {request.designFileUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadDesignFile(request.designFileUrl!, request.designFileName || 'design')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la Demande</DialogTitle>
            <DialogDescription>
              Informations complètes de la demande d'impression
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Informations Client
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Nom:</span>
                      <span>{selectedRequest.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Email:</span>
                      <span>{selectedRequest.customerEmail}</span>
                    </div>
                    {selectedRequest.customerPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Téléphone:</span>
                        <span>{selectedRequest.customerPhone}</span>
                      </div>
                    )}
                    {selectedRequest.company && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Entreprise:</span>
                        <span>{selectedRequest.company}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Détails Produit
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Matériau:</span>
                      {getMaterialBadge(selectedRequest.material)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Dimensions:</span>
                      <span>{selectedRequest.dimensions} cm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Quantité:</span>
                      <span>{selectedRequest.quantity} unités</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Date souhaitée:</span>
                      <span>{new Date(selectedRequest.deliveryDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Statut et Suivi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Statut actuel:</span>
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Créée le:</span>
                      <span>{new Date(selectedRequest.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Dernière MAJ:</span>
                      <span>{new Date(selectedRequest.updatedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">ID:</span>
                      <span className="font-mono text-sm">{selectedRequest.id}</span>
                    </div>
                  </CardContent>
                </Card>

                {selectedRequest.designFileUrl && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Fichier Design
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Nom du fichier:</span>
                        <span>{selectedRequest.designFileName || 'Non spécifié'}</span>
                      </div>
                      <Button
                        onClick={() => downloadDesignFile(selectedRequest.designFileUrl!, selectedRequest.designFileName || 'design')}
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger le Design
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Notes */}
              {(selectedRequest.notes || selectedRequest.adminNotes) && (
                <div className="space-y-4">
                  {selectedRequest.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Notes du Client</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{selectedRequest.notes}</p>
                      </CardContent>
                    </Card>
                  )}

                  {selectedRequest.adminNotes && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Notes Administrateur</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{selectedRequest.adminNotes}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

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
    </div>
  );
}
