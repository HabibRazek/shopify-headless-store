'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Folder,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FullScreenLoader } from '@/components/ui/loader';
import AdminLayout from '@/components/admin/AdminLayout';

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count: {
    posts: number;
  };
}

export default function AdminBlogCategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchCategories();
  }, [session, status, router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      const data = await response.json();

      if (response.ok) {
        setCategories(data);
      } else {
        toast.error('Erreur lors du chargement des catégories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
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
      const url = editingCategory
        ? `/api/blog/categories/${editingCategory.id}`
        : '/api/blog/categories';

      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          editingCategory
            ? 'Catégorie mise à jour avec succès'
            : 'Catégorie créée avec succès'
        );
        setDialogOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', slug: '', description: '' });
        fetchCategories();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (category: BlogCategory) => {
    if (category._count.posts > 0) {
      toast.error('Impossible de supprimer une catégorie qui contient des articles');
      return;
    }

    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/categories/${category.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Catégorie supprimée avec succès');
        fetchCategories();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (status === 'loading' || loading) {
    return <FullScreenLoader />;
  }

  return (
    <AdminLayout
      title="Gestion des Catégories"
      description="Organisez vos articles par catégories thématiques"
      actions={
        <Button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', description: '' });
            setDialogOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Catégorie
          </Button>
      }
    >
      <div className="space-y-8">
        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle>Catégories ({categories.length})</CardTitle>
            <CardDescription>
              Liste de toutes les catégories de blog
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center py-12">
                <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">Aucune catégorie trouvée</p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer votre première catégorie
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">/{category.slug}</p>
                        {category.description && (
                          <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FileText className="h-4 w-4" />
                          <span>{category._count.posts} article{category._count.posts !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(category)}
                          disabled={category._count.posts > 0}
                          className={category._count.posts > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50 hover:text-red-600 hover:border-red-200'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? 'Modifiez les informations de la catégorie.'
                  : 'Créez une nouvelle catégorie pour organiser vos articles.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom de la catégorie</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Actualités, Conseils..."
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="Ex: actualites, conseils..."
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (optionnelle)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez brièvement cette catégorie..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Sauvegarde...' : (editingCategory ? 'Modifier' : 'Créer')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
