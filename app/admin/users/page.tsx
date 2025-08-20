'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Key, 
  Users, 
  UserCheck, 
  UserX,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import CreateUserModal from '@/components/admin/CreateUserModal';
import EditUserModal from '@/components/admin/EditUserModal';
import ResetPasswordModal from '@/components/admin/ResetPasswordModal';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge';
import Avatar from '@/components/admin/Avatar';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  status: string;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  _count: {
    orders: number;
    blogPosts: number;
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users when filters change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        role: roleFilter === 'all' ? '' : roleFilter,
        status: statusFilter === 'all' ? '' : statusFilter,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/admin/users?${params}`);

      if (!response.ok) {
        if (response.status === 403) {
          toast.error('Accès refusé - Droits administrateur requis');
          return;
        }
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type: string, value: string) => {
    if (type === 'role') {
      setRoleFilter(value);
    } else if (type === 'status') {
      setStatusFilter(value);
    }
    setCurrentPage(1);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      toast.success('Utilisateur supprimé avec succès');
      fetchUsers();
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      user: 'bg-blue-100 text-blue-800',
      admin: 'bg-green-100 text-green-800',
      super_admin: 'bg-purple-100 text-purple-800',
    };
    return variants[role as keyof typeof variants] || variants.user;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'suspended':
        return <UserX className="h-4 w-4 text-red-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'user':
        return 'Utilisateur';
      default:
        return role;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'suspended':
        return 'Suspendu';
      default:
        return status;
    }
  };

  // Define table columns
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
      key: 'name',
      label: 'Utilisateur',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center group">
          <Avatar
            name={value || row.email}
            size="lg"
            variant="green"
            className="mr-4 shadow-lg group-hover:shadow-xl transition-shadow"
          />
          <div>
            <div className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
              {value || 'Nom non défini'}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
              <span>{row.email}</span>
            </div>
            {row.phone && (
              <div className="text-xs text-gray-400 mt-0.5 font-medium">{row.phone}</div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Rôle',
      width: '140px',
      sortable: true,
      render: (value: string) => (
        <StatusBadge
          status={value}
          variant={value === 'super_admin' ? 'purple' : value === 'admin' ? 'success' : 'info'}
          size="lg"
        >
          {getRoleLabel(value)}
        </StatusBadge>
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
          {getStatusLabel(value)}
        </StatusBadge>
      )
    },
    {
      key: '_count',
      label: 'Activité',
      width: '120px',
      render: (value: any) => (
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-900">
            {value.orders} commandes
          </div>
          <div className="text-xs text-gray-500">
            {value.blogPosts} articles
          </div>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Date d\'inscription',
      width: '140px',
      sortable: true,
      render: (value: string) => (
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-900">
            {format(new Date(value), 'dd/MM/yyyy', { locale: fr })}
          </div>
          <div className="text-xs text-gray-500">
            {format(new Date(value), 'HH:mm', { locale: fr })}
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
              setSelectedUser(row);
              setShowEditModal(true);
            }}
            className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg shadow-sm border border-transparent hover:border-blue-200 transition-all"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(row);
              setShowResetPasswordModal(true);
            }}
            className="h-9 w-9 p-0 hover:bg-green-50 hover:text-green-600 rounded-lg shadow-sm border border-transparent hover:border-green-200 transition-all"
          >
            <Key className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(row);
              setShowDeleteModal(true);
            }}
            className="h-9 w-9 p-0 hover:bg-red-50 hover:text-red-600 rounded-lg shadow-sm border border-transparent hover:border-red-200 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  // Calculate statistics
  const stats = [
    {
      label: 'Total des utilisateurs',
      value: pagination.totalUsers,
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: '+12% ce mois',
      changeType: 'increase' as const
    },
    {
      label: 'Utilisateurs actifs',
      value: users.filter(u => u.status === 'active').length,
      icon: <UserCheck className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      change: '+5% cette semaine',
      changeType: 'increase' as const
    },
    {
      label: 'Utilisateurs inactifs',
      value: users.filter(u => u.status !== 'active').length,
      icon: <UserX className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      change: '-2% ce mois',
      changeType: 'decrease' as const
    },
    {
      label: 'Administrateurs',
      value: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length,
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      change: '3 actifs',
      changeType: 'neutral' as const
    }
  ];

  return (
    <AdminLayout>
      <DataTable
        title="Gestion des Utilisateurs"
        subtitle="Gérez les comptes utilisateurs et leurs permissions de manière professionnelle"
        columns={columns}
        data={users}
        loading={loading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher par nom, email, téléphone..."
        filters={[
          {
            key: 'role',
            label: 'Rôle',
            options: [
              { value: 'all', label: 'Tous les rôles' },
              { value: 'user', label: 'Utilisateur' },
              { value: 'admin', label: 'Admin' },
              { value: 'super_admin', label: 'Super Admin' }
            ],
            value: roleFilter,
            onChange: setRoleFilter
          },
          {
            key: 'status',
            label: 'Statut',
            options: [
              { value: 'all', label: 'Tous les statuts' },
              { value: 'active', label: 'Actif' },
              { value: 'inactive', label: 'Inactif' },
              { value: 'suspended', label: 'Suspendu' }
            ],
            value: statusFilter,
            onChange: setStatusFilter
          }
        ]}
        actions={
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white h-10 gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nouvel Utilisateur
          </Button>
        }
        emptyState={{
          icon: <Users className="w-16 h-16" />,
          title: 'Aucun utilisateur trouvé',
          description: 'Aucun utilisateur ne correspond aux critères de recherche actuels. Créez un nouvel utilisateur pour commencer.'
        }}
        onRowClick={(user) => {
          setSelectedUser(user);
          setShowEditModal(true);
        }}
        showStats={true}
        stats={stats}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur "{selectedUser?.name || selectedUser?.email}" ?
              Cette action est irréversible et supprimera toutes les données associées.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create User Modal */}
      <CreateUserModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onUserCreated={fetchUsers}
      />

      {/* Edit User Modal */}
      <EditUserModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        user={selectedUser}
        onUserUpdated={fetchUsers}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        open={showResetPasswordModal}
        onOpenChange={setShowResetPasswordModal}
        user={selectedUser}
        onPasswordReset={fetchUsers}
      />
    </AdminLayout>
  );
}
