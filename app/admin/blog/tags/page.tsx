'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, ArrowLeft, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { FullScreenLoader } from '@/components/ui/loader';

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gérer les Tags
              </h1>
              <p className="text-gray-600 mt-2">
                Organisez vos articles avec des tags pertinents
              </p>
            </div>
            <Link href="/admin">
              <Button variant="outline" size="lg" className="h-12">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour à l'Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-green-600" />
                  Tags du Blog
                </CardTitle>
                <CardDescription>
                  Gérez les tags utilisés pour catégoriser vos articles
                </CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => resetForm()}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Tag
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingTag ? 'Modifier le Tag' : 'Créer un Nouveau Tag'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingTag 
                        ? 'Modifiez les informations du tag.' 
                        : 'Ajoutez un nouveau tag pour organiser vos articles.'
                      }
                    </DialogDescription>
                  </DialogHeader>
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
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-6">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setDialogOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {loading ? 'Sauvegarde...' : (editingTag ? 'Mettre à jour' : 'Créer')}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {tags.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun tag</h3>
                <p className="text-gray-600 mb-4">
                  Commencez par créer votre premier tag pour organiser vos articles.
                </p>
                <Button 
                  onClick={() => setDialogOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un Tag
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {tag.name}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(tag)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(tag)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Slug: {tag.slug}
                    </p>
                    <p className="text-sm text-gray-500">
                      {tag._count.posts} article{tag._count.posts !== 1 ? 's' : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
