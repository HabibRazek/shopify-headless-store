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
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive' || u.status === 'suspended').length,
    admins: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length
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
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                </div>
                <p className="text-gray-600 text-sm sm:text-lg">Gérez les comptes utilisateurs et leurs permissions</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total utilisateurs</p>
                  <p className="text-sm font-medium text-gray-900">{users.length}</p>
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
              <h2 className="text-xl font-semibold text-gray-900">Aperçu des Utilisateurs</h2>
              <p className="text-sm text-gray-600 mt-1">Statistiques en temps réel de vos utilisateurs</p>
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
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Utilisateurs</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Utilisateurs Actifs</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.active}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Utilisateurs Inactifs</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.inactive}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <UserX className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Administrateurs</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.admins}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                    <Key className="h-6 w-6 text-white" />
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
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Utilisateur
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
                      placeholder="Rechercher par nom, email, téléphone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-56 border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Filtrer par rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="user">Utilisateur</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-56 border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
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
              <CardTitle className="text-lg font-medium text-gray-900">Liste des Utilisateurs</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Mise à jour en temps réel</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                <span className="ml-2 text-gray-600">Chargement des utilisateurs...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
                  <p className="text-gray-500 mb-6">Aucun utilisateur ne correspond aux critères de recherche actuels.</p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-gray-800 hover:to-[#9BC70A] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer le premier utilisateur
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 bg-gray-50/50">
                      <TableHead className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Utilisateur
                      </TableHead>
                      <TableHead className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Rôle
                      </TableHead>
                      <TableHead className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Statut
                      </TableHead>
                      <TableHead className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Commandes
                      </TableHead>
                      <TableHead className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Créé le
                      </TableHead>
                      <TableHead className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                      >
                        <TableCell className="py-4 px-6">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {user.name || 'Nom non défini'}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.phone && (
                              <div className="text-xs text-gray-400 mt-0.5">{user.phone}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge
                            variant={user.role === 'super_admin' ? 'destructive' : user.role === 'admin' ? 'default' : 'secondary'}
                            className="text-xs font-medium"
                          >
                            {user.role === 'super_admin' ? 'Super Admin' :
                             user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-center">
                          <StatusBadge
                            status={user.status}
                            variant={getStatusVariant(user.status)}
                          >
                            {getStatusLabel(user.status)}
                          </StatusBadge>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#B4E50D]/10 text-[#6B7C00] border border-[#B4E50D]/20">
                            {user._count.orders}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="text-sm font-medium text-gray-900">
                            {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: fr })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(user.createdAt), 'HH:mm')}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUser(user);
                                  setShowEditModal(true);
                                }}
                                className="cursor-pointer"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUser(user);
                                  setShowResetPasswordModal(true);
                                }}
                                className="cursor-pointer"
                              >
                                <Key className="mr-2 h-4 w-4" />
                                Réinitialiser mot de passe
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUser(user);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600 cursor-pointer"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
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
