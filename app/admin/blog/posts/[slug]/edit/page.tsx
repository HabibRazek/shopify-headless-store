'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ui/image-upload';
import { MultipleImageUpload } from '@/components/ui/multiple-image-upload';

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  published: boolean;
  categoryId: string | null;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export default function EditBlogPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [post, setPost] = useState<BlogPost | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    images: [] as string[],
    published: false,
    categoryId: '',
    tagIds: [] as string[],
  });

  const fetchPost = useCallback(async (slug: string) => {
    try {
      // Add admin=true parameter to allow fetching draft posts
      const response = await fetch(`/api/blog/posts/${slug}?admin=true`);
      const data = await response.json();

      if (response.ok) {
        setPost(data);
        setFormData({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || '',
          content: data.content,
          featuredImage: data.featuredImage || '',
          images: data.images || [],
          published: data.published,
          categoryId: data.categoryId || '',
          tagIds: data.tags.map((tag: any) => tag.id),
        });
      } else {
        toast.error('Article non trouvé');
        router.push('/admin/blog/posts');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setInitialLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    if (params.slug) {
      fetchPost(params.slug as string);
      fetchCategories();
      fetchTags();
    }
  }, [session, status, router, params.slug, fetchPost]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      const data = await response.json();
      if (response.ok) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/blog/tags');
      const data = await response.json();
      if (response.ok) {
        setTags(data);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        categoryId: formData.categoryId || null,
        tagIds: formData.tagIds.length > 0 ? formData.tagIds : null,
      };

      const response = await fetch(`/api/blog/posts/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Article mis à jour avec succès');
        router.push('/admin/blog/posts');
      } else {
        toast.error(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin' || !post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/blog/posts">
              <Button variant="outline" size="lg" className="h-12">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour aux Articles
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Modifier l'Article
              </h1>
              <p className="text-gray-600 mt-2">
                {post.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
              <CardDescription>
                Titre, slug et description de l'article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Titre de l'article"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="slug-de-larticle"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL de l'article: /blog/{formData.slug}
                </p>
              </div>

              <div>
                <Label htmlFor="excerpt">Extrait</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Résumé de l'article (optionnel)"
                  rows={3}
                />
              </div>

              <div>
                <ImageUpload
                  value={formData.featuredImage}
                  onChange={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                  onRemove={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                  label="Image à la une"
                />
              </div>

              <div>
                <MultipleImageUpload
                  images={formData.images}
                  onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                  maxImages={8}
                  label="Images supplémentaires"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Ajoutez jusqu'à 8 images supplémentaires pour illustrer votre article
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Contenu</CardTitle>
              <CardDescription>
                Le contenu principal de l'article
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="content">Contenu *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Contenu de l'article (HTML supporté)"
                  rows={15}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Vous pouvez utiliser du HTML pour formater votre contenu
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Categorization */}
          <Card>
            <CardHeader>
              <CardTitle>Catégorisation</CardTitle>
              <CardDescription>
                Catégorie et tags de l'article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {tags.map((tag) => (
                    <label key={tag.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.tagIds.includes(tag.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              tagIds: [...prev.tagIds, tag.id]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              tagIds: prev.tagIds.filter(id => id !== tag.id)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle>Options de publication</CardTitle>
              <CardDescription>
                Contrôlez la visibilité de l'article
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
                <Label htmlFor="published">Publié</Label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Link href="/admin/blog/posts">
              <Button variant="outline">
                Annuler
              </Button>
            </Link>
            
            <div className="flex gap-2">
              {post.published && (
                <Link href={`/blog/${post.slug}`} target="_blank">
                  <Button type="button" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir l'article
                  </Button>
                </Link>
              )}
              
              <Button type="submit" disabled={loading}>
                {loading ? 'Mise à jour...' : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Mettre à jour
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
