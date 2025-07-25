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

  return (
    <AdminLayout
      title="Gestion des Utilisateurs"
      description="Gérez les comptes utilisateurs et leurs permissions"
      actions={
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Utilisateur
        </Button>
      }
    >
      {loading && users.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold">{pagination.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Actifs</p>
                <p className="text-xl font-bold">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserX className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Inactifs</p>
                <p className="text-xl font-bold">
                  {users.filter(u => u.status !== 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-xl font-bold">
                  {users.filter(u => u.role === 'admin' || u.role === 'super_admin').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={(value) => handleFilterChange('role', value === 'all' ? '' : value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="user">Utilisateur</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Commandes</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-medium text-sm">
                            {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name || 'Sans nom'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          {user.phone && (
                            <p className="text-xs text-gray-400">{user.phone}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadge(user.role)}>
                        {user.role === 'super_admin' ? 'Super Admin' :
                         user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(user.status)}>
                        {user.status === 'active' ? 'Actif' :
                         user.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{user._count.orders} commandes</p>
                        <p className="text-gray-500">{user._count.blogPosts} articles</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{format(new Date(user.createdAt), 'dd MMM yyyy', { locale: fr })}</p>
                        <p className="text-gray-500">
                          {format(new Date(user.createdAt), 'HH:mm')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditModal(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setShowResetPasswordModal(true);
                            }}
                          >
                            <Key className="h-4 w-4 mr-2" />
                            Réinitialiser mot de passe
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
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
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {pagination.currentPage} sur {pagination.totalPages}
            ({pagination.totalUsers} utilisateurs au total)
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.hasNextPage}
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

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
        </div>
      )}
    </AdminLayout>
  );
}
