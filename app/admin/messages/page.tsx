'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Filter,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building,
  Calendar,
  CheckCircle,
  Circle,
  Reply,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge';
import Avatar from '@/components/admin/Avatar';
import ReplyDialog from '@/components/admin/ReplyDialog';
import { toast } from 'sonner';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

interface MessageCounts {
  all: number;
  unread: number;
  read: number;
  replied: number;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState<MessageCounts>({
    all: 0,
    unread: 0,
    read: 0,
    replied: 0,
  });
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: statusFilter,
        search: searchQuery,
      });

      const response = await fetch(`/api/admin/messages?${params}`);
      const data = await response.json();

      if (response.ok) {
        setMessages(data.messages);
        setTotalPages(data.pagination.pages);
        setCounts(data.counts);
      } else {
        toast.error('Erreur lors du chargement des messages');
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currentPage, statusFilter, searchQuery]);

  const handleStatusChange = async (messageId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Statut mis à jour');
        fetchMessages();
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedMessages.length === 0) return;

    try {
      const response = await fetch('/api/admin/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedMessages }),
      });

      if (response.ok) {
        toast.success(`${selectedMessages.length} message(s) supprimé(s)`);
        setSelectedMessages([]);
        fetchMessages();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleReply = (message: ContactMessage) => {
    setSelectedMessage(message);
    setReplyDialogOpen(true);
  };

  const handleReplySuccess = () => {
    fetchMessages(); // Refresh the messages list
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread':
        return <Circle className="h-4 w-4 text-red-500" />;
      case 'read':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'replied':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'unread':
        return 'Non lu';
      case 'read':
        return 'Lu';
      case 'replied':
        return 'Répondu';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
      label: 'Contact',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center group">
          <Avatar name={value} size="lg" variant="blue" className="mr-4 shadow-lg group-hover:shadow-xl transition-shadow" />
          <div>
            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{value}</div>
            <div className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5" />
              {row.email}
            </div>
            {row.company && (
              <div className="text-xs text-gray-400 mt-0.5 font-medium flex items-center gap-1">
                <Building className="w-3 h-3" />
                {row.company}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'subject',
      label: 'Sujet',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="max-w-xs">
          <div className="text-sm font-medium text-gray-900 truncate">
            {value || 'Aucun sujet'}
          </div>
          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
            {row.message}
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Téléphone',
      width: '140px',
      render: (value: string) => (
        value ? (
          <div className="flex items-center gap-1.5 text-sm text-gray-900">
            <Phone className="w-3.5 h-3.5 text-gray-400" />
            {value}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        )
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
      width: '160px',
      align: 'right' as const,
      render: (_: any, row: any) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleReply(row);
            }}
            className="h-9 w-9 p-0 hover:bg-green-50 hover:text-green-600 rounded-lg shadow-sm border border-transparent hover:border-green-200 transition-all"
          >
            <Reply className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg shadow-sm border border-transparent hover:border-blue-200 transition-all"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleStatusChange(row.id, 'read')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Marquer comme lu
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange(row.id, 'replied')}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Marquer comme répondu
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange(row.id, 'unread')}
              >
                <Circle className="h-4 w-4 mr-2" />
                Marquer comme non lu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ];

  // Calculate statistics
  const stats = [
    {
      label: 'Total des messages',
      value: counts.all,
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: '+12% ce mois',
      changeType: 'increase' as const
    },
    {
      label: 'Non lus',
      value: counts.unread,
      icon: <Circle className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      change: `${counts.unread} nouveaux`,
      changeType: 'neutral' as const
    },
    {
      label: 'Lus',
      value: counts.read,
      icon: <Eye className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      change: '+5% cette semaine',
      changeType: 'increase' as const
    },
    {
      label: 'Répondus',
      value: counts.replied,
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      change: '+8% ce mois',
      changeType: 'increase' as const
    }
  ];

  return (
    <AdminLayout>
      <DataTable
        title="Messages de Contact"
        subtitle="Gestion professionnelle des messages reçus via le formulaire de contact"
        columns={columns}
        data={messages}
        loading={loading}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher par nom, email, entreprise, sujet..."
        filters={[
          {
            key: 'status',
            label: 'Statut',
            options: [
              { value: 'all', label: 'Tous les statuts' },
              { value: 'unread', label: 'Non lus' },
              { value: 'read', label: 'Lus' },
              { value: 'replied', label: 'Répondus' }
            ],
            value: statusFilter,
            onChange: setStatusFilter
          }
        ]}
        actions={
          <div className="flex gap-2">
            <Button onClick={fetchMessages} variant="outline" size="sm" className="h-10 gap-2 shadow-sm">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            {selectedMessages.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                className="h-10 gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer ({selectedMessages.length})
              </Button>
            )}
          </div>
        }
        emptyState={{
          icon: <MessageSquare className="w-16 h-16" />,
          title: 'Aucun message trouvé',
          description: 'Aucun message ne correspond aux critères de recherche actuels. Les nouveaux messages apparaîtront ici automatiquement.'
        }}
        onRowClick={(message) => handleReply(message)}
        showStats={true}
        stats={stats}
      />

      {/* Reply Dialog */}
      <ReplyDialog
        message={selectedMessage}
        open={replyDialogOpen}
        onOpenChange={setReplyDialogOpen}
        onReplySuccess={handleReplySuccess}
      />
    </AdminLayout>
  );
}
