'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
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
  Eye,
  TrendingUp,
  MessageSquare,
  Mail,
  Building,
  Reply,
  MoreHorizontal,
  Circle,
  CheckCircle,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import ReplyDialog from './ReplyDialog';

// Message interface
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

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());



export default function EnhancedMessagesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);

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

  // Fetch messages with SWR
  const { data, error, isLoading, mutate } = useSWR(
    `/api/admin/messages?${queryParams}`,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  const messages: ContactMessage[] = data?.messages || [];
  const totalPages = data?.pagination?.pages || 1;
  const totalMessages = data?.pagination?.total || 0;
  const counts: MessageCounts = data?.counts || { all: 0, unread: 0, read: 0, replied: 0 };

  // Handle status change
  const handleStatusChange = async (messageId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Statut mis à jour');
        mutate(); // Refresh data
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // Handle delete selected
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
        mutate(); // Refresh data
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Handle reply
  const handleReply = (message: ContactMessage) => {
    setSelectedMessage(message);
    setReplyDialogOpen(true);
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge variant="destructive" className="gap-1"><Circle className="w-3 h-3" />Non lu</Badge>;
      case 'read':
        return <Badge variant="secondary" className="gap-1"><Eye className="w-3 h-3" />Lu</Badge>;
      case 'replied':
        return <Badge variant="default" className="gap-1 bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3" />Répondu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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

  // Handle row selection
  const handleSelectMessage = (messageId: string) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map(message => message.id));
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Gestion des messages de contact</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{counts.all}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-[#B4E50D] mr-1" />
                <p className="text-sm text-[#6B7C00] font-medium">+12% vs mois dernier</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Non lus</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{counts.unread}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                <Circle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-[#B4E50D] rounded-full mr-2"></span>
                <p className="text-sm text-[#6B7C00] font-medium">{counts.unread} nouveaux</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Lus</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{counts.read}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-[#B4E50D] mr-1" />
                <p className="text-sm text-[#6B7C00] font-medium">+5% vs semaine dernière</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Répondus</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{counts.replied}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-[#B4E50D] mr-1" />
                <p className="text-sm text-[#6B7C00] font-medium">+8% vs mois dernier</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Filters and Search */}
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtrer
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                      Tous les statuts
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setStatusFilter('unread')}>
                      Non lus
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('read')}>
                      Lus
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('replied')}>
                      Répondus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <SortAsc className="h-4 w-4 mr-2" />
                      Trier
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem onClick={() => setSortBy('createdAt')}>
                      Date de création
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('name')}>
                      Nom du contact
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('status')}>
                      Statut
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Right side controls */}
              <div className="flex items-center gap-3">
                {selectedMessages.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteSelected}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer ({selectedMessages.length})
                  </Button>
                )}
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
                      placeholder="Rechercher par nom, email, entreprise, sujet..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-56 border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="unread">Non lus</SelectItem>
                    <SelectItem value="read">Lus</SelectItem>
                    <SelectItem value="replied">Répondus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-gray-900">Liste des Messages</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Mise à jour en temps réel</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedMessages.length === messages.length && messages.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead className="w-32">Statut</TableHead>
                  <TableHead className="w-32">Date</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="flex items-center justify-center py-12">
                        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                        <span className="ml-2 text-gray-600">Chargement des messages...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <MessageSquare className="w-16 h-16 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Aucun message trouvé</h3>
                          <p className="text-gray-500">Aucun message ne correspond aux critères de recherche.</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((message) => {
                    const { date, time } = formatDate(message.createdAt);
                    return (
                      <TableRow
                        key={message.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleReply(message)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedMessages.includes(message.id)}
                            onCheckedChange={() => handleSelectMessage(message.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            #{message.id.slice(-6)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {message.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{message.name}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {message.email}
                              </div>
                              {message.company && (
                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                  <Building className="w-3 h-3" />
                                  {message.company}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900 truncate max-w-xs">
                              {message.subject || 'Aucun sujet'}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {message.message}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(message.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900">{date}</div>
                            <div className="text-xs text-gray-500">{time}</div>
                          </div>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReply(message)}
                              className="h-8 w-8 p-0"
                            >
                              <Reply className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStatusChange(message.id, 'read')}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Marquer comme lu
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(message.id, 'replied')}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Marquer comme répondu
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(message.id, 'unread')}>
                                  <Circle className="w-4 h-4 mr-2" />
                                  Marquer comme non lu
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteSelected()}
                                  className="text-red-600"
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
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Affichage de {((currentPage - 1) * limit) + 1} à {Math.min(currentPage * limit, totalMessages)} sur {totalMessages} messages
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
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
                        className="h-8 w-8 p-0"
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
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reply Dialog */}
      <ReplyDialog
        message={selectedMessage}
        open={replyDialogOpen}
        onOpenChange={setReplyDialogOpen}
        onReplySuccess={() => mutate()}
      />
    </div>
  );
}
