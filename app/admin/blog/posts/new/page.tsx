'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, Edit } from 'lucide-react';
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

export default function NewBlogPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  
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

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchCategories();
    fetchTags();
  }, [session, status, router]);

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

  const handleSubmit = async (e: React.FormEvent, asDraft = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.title.trim()) {
        toast.error('Le titre est requis');
        setLoading(false);
        return;
      }

      if (!formData.slug.trim()) {
        toast.error('Le slug est requis');
        setLoading(false);
        return;
      }

      if (!formData.content.trim()) {
        toast.error('Le contenu est requis');
        setLoading(false);
        return;
      }

      const submitData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        featuredImage: formData.featuredImage.trim(),
        images: formData.images,
        published: asDraft ? false : formData.published,
        categoryId: formData.categoryId || null,
        tagIds: formData.tagIds.length > 0 ? formData.tagIds : [],
      };

      // Check content size before sending
      const contentSize = new Blob([JSON.stringify(submitData)]).size;
      const maxSize = 8 * 1024 * 1024; // 8MB limit

      console.log('🚀 Sending blog post data:', {
        title: submitData.title,
        slug: submitData.slug,
        published: submitData.published,
        hasContent: !!submitData.content,
        hasImages: submitData.images?.length || 0,
        contentSize: `${(contentSize / 1024 / 1024).toFixed(2)}MB`
      });

      if (contentSize > maxSize) {
        toast.error(`Contenu trop volumineux (${(contentSize / 1024 / 1024).toFixed(2)}MB). Limite: 8MB. Réduisez la taille des images ou du contenu.`);
        return;
      }

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📡 Response status:', response.status, response.statusText);

      if (!response.ok) {
        // Handle specific error codes
        if (response.status === 413) {
          toast.error('Contenu trop volumineux. Réduisez la taille des images ou du texte et réessayez.');
          return;
        }

        // Try to get error details
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error('❌ Server error details:', errorData);
        } catch (parseError) {
          console.error('❌ Could not parse error response:', parseError);
          // For 413 errors, the response might not be JSON
          if (response.status === 413) {
            errorMessage = 'Contenu trop volumineux. Réduisez la taille des images ou du texte.';
          }
        }
        toast.error(errorMessage);
        return;
      }

      const data = await response.json();
      console.log('✅ Blog post created successfully:', data.id);

      toast.success(asDraft ? 'Brouillon sauvegardé avec succès!' : 'Article créé avec succès!');
      router.push('/admin/blog/posts');
    } catch (error) {
      console.error('❌ Network/Connection error:', error);

      // More specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('Erreur de réseau. Vérifiez votre connexion internet et réessayez.');
      } else if (error instanceof Error && error.name === 'AbortError') {
        toast.error('Délai d\'attente dépassé. Réessayez dans quelques instants.');
      } else {
        toast.error('Erreur inattendue. Vérifiez la console pour plus de détails.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
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
                Créer un Nouvel Article
              </h1>
              <p className="text-gray-600 mt-2">
                Rédigez et publiez un nouvel article de blog pour engager vos lecteurs
              </p>
            </div>
            <Link href="/admin/blog/posts">
              <Button variant="outline" size="lg" className="h-12">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour aux Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <form onSubmit={(e) => handleSubmit(e, false)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Edit className="h-5 w-5 text-green-600" />
                    Informations de Base
                  </CardTitle>
                  <CardDescription>
                    Titre, slug et description de l'article
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        URL: /blog/{formData.slug}
                      </p>
                    </div>
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
                </CardContent>
              </Card>

              {/* Content */}
              <Card className="border border-gray-200 shadow-sm">
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
                      rows={20}
                      required
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500">
                        Vous pouvez utiliser du HTML pour formater votre contenu
                      </p>
                      <p className={`text-sm ${
                        formData.content.length > 400000
                          ? 'text-red-500 font-medium'
                          : formData.content.length > 300000
                            ? 'text-orange-500'
                            : 'text-gray-400'
                      }`}>
                        {(formData.content.length / 1000).toFixed(0)}k / 500k caractères
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                  <CardDescription>
                    Image à la une et images supplémentaires
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
            </div>

            {/* Right Sidebar - Settings (1/3 width) */}
            <div className="space-y-6">
              {/* Publishing Options */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Publication</CardTitle>
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
                    <Label htmlFor="published">Publier immédiatement</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Categorization */}
              <Card className="border border-gray-200 shadow-sm">
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
                    <div className="grid grid-cols-1 gap-2 mt-2 max-h-48 overflow-y-auto">
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

              {/* Actions */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Content Size Indicator */}
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Taille estimée du contenu:</div>
                    <div className={`text-sm font-medium ${
                      (() => {
                        const size = new Blob([JSON.stringify({
                          title: formData.title,
                          content: formData.content,
                          images: formData.images,
                          excerpt: formData.excerpt
                        })]).size / 1024 / 1024;
                        return size > 8 ? 'text-red-500' : size > 6 ? 'text-orange-500' : 'text-green-600';
                      })()
                    }`}>
                      {(() => {
                        const size = new Blob([JSON.stringify({
                          title: formData.title,
                          content: formData.content,
                          images: formData.images,
                          excerpt: formData.excerpt
                        })]).size / 1024 / 1024;
                        return `${size.toFixed(2)}MB / 8MB`;
                      })()}
                    </div>
                    {(() => {
                      const size = new Blob([JSON.stringify({
                        title: formData.title,
                        content: formData.content,
                        images: formData.images,
                        excerpt: formData.excerpt
                      })]).size / 1024 / 1024;
                      return size > 8 && (
                        <div className="text-xs text-red-500 mt-1">
                          ⚠️ Contenu trop volumineux. Réduisez les images ou le texte.
                        </div>
                      );
                    })()}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={loading}
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder comme brouillon
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {loading ? 'Création...' : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        {formData.published ? 'Publier' : 'Créer'}
                      </>
                    )}
                  </Button>

                  <Link href="/admin/blog/posts" className="block">
                    <Button variant="outline" className="w-full">
                      Annuler
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
