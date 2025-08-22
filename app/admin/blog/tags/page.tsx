'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, ArrowLeft, Tag, Search, MoreHorizontal, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { FullScreenLoader } from '@/components/ui/loader';
import AdminLayout from '@/components/admin/AdminLayout';

interface BlogTag {
  id: string;
  name: string;
  slug: string;
  _count: {
    posts: number;
  };
}

export default function AdminBlogTagsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchTags();
  }, [session, status, router]);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/blog/tags');
      const data = await response.json();

      if (response.ok) {
        setTags(data);
      } else {
        toast.error('Erreur lors du chargement des tags');
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Erreur lors du chargement des tags');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingTag 
        ? `/api/blog/tags/${editingTag.id}`
        : '/api/blog/tags';
      
      const method = editingTag ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(editingTag ? 'Tag mis à jour' : 'Tag créé');
        setDialogOpen(false);
        setEditingTag(null);
        setFormData({ name: '', slug: '' });
        fetchTags();
      } else {
        toast.error(data.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving tag:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tag: BlogTag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (tag: BlogTag) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le tag "${tag.name}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/tags/${tag.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Tag supprimé');
        fetchTags();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '' });
    setEditingTag(null);
  };

  if (status === 'loading' || loading) {
    return <FullScreenLoader />;
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  // Filter tags based on search
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-full overflow-hidden">
        {/* Professional Page Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-4 sm:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Link href="/admin/blog" className="text-gray-400 hover:text-gray-600">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] rounded-lg flex items-center justify-center shadow-lg">
                    <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Gestion des Tags</h1>
                </div>
                <p className="text-gray-600 text-sm sm:text-lg">Organisez vos articles avec des tags pertinents</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total tags</p>
                  <p className="text-sm font-medium text-gray-900">{tags.length}</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Tags</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{tags.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                  <Tag className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Articles Totaux</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {tags.reduce((sum, tag) => sum + tag._count.posts, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                  <Edit className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#B4E50D] bg-gradient-to-r from-[#B4E50D]/10 to-transparent shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Tags Actifs</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {tags.filter(tag => tag._count.posts > 0).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#B4E50D] to-[#9BC70A] rounded-full flex items-center justify-center shadow-md">
                  <Plus className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
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
                  onClick={() => {
                    setEditingTag(null);
                    setFormData({ name: '', slug: '' });
                    setDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Tag
                </Button>
              </div>
            </div>

            {/* Search Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Recherche</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      placeholder="Rechercher par nom..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags Table */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-gray-900">Liste des Tags</CardTitle>
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
                <span className="ml-2 text-gray-600">Chargement des tags...</span>
              </div>
            ) : filteredTags.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Tag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun tag trouvé</h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm ? 'Aucun tag ne correspond à votre recherche.' : 'Créez votre premier tag pour organiser vos articles.'}
                  </p>
                  <Button
                    onClick={() => {
                      setEditingTag(null);
                      setFormData({ name: '', slug: '' });
                      setDialogOpen(true);
                    }}
                    className="bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-gray-800 hover:to-[#9BC70A] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer le premier tag
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 bg-gray-50/50">
                      <TableHead className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tag
                      </TableHead>
                      <TableHead className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Slug
                      </TableHead>
                      <TableHead className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Articles
                      </TableHead>
                      <TableHead className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTags.map((tag) => (
                      <TableRow
                        key={tag.id}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="py-4 px-6">
                          <div className="text-sm font-semibold text-gray-900">
                            {tag.name}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge variant="secondary" className="text-xs font-mono">
                            /{tag.slug}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#B4E50D]/10 text-[#6B7C00] border border-[#B4E50D]/20">
                            {tag._count.posts} article{tag._count.posts !== 1 ? 's' : ''}
                          </span>
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
                                onClick={() => handleEdit(tag)}
                                className="cursor-pointer"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(tag)}
                                disabled={tag._count.posts > 0}
                                className={`cursor-pointer ${
                                  tag._count.posts > 0
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'text-red-600 hover:bg-red-50'
                                }`}
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


      {/* Drawer for creating/editing tags */}
      <Drawer open={dialogOpen} onOpenChange={setDialogOpen}>
        <DrawerContent className="max-w-2xl mx-auto">
          <DrawerHeader className="border-b border-gray-100 pb-4">
            <DrawerTitle className="text-xl font-semibold text-gray-900">
              {editingTag ? 'Modifier le Tag' : 'Créer un Nouveau Tag'}
            </DrawerTitle>
            <DrawerDescription className="text-gray-600">
              {editingTag
                ? 'Modifiez les informations du tag.'
                : 'Ajoutez un nouveau tag pour organiser vos articles.'
              }
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du Tag</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Technologie, Design..."
                    required
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="Ex: technologie, design..."
                    required
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-gray-800 hover:to-[#9BC70A] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    editingTag ? 'Mettre à jour' : 'Créer'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </AdminLayout>
  );
}
