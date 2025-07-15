'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Image as ImageIcon, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface MultipleImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  className?: string;
}

export function MultipleImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
  label = "Images",
  className = ""
}: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      toast.error(`Vous ne pouvez ajouter que ${maxImages} images maximum`);
      return;
    }

    setUploading(true);
    setUploadProgress(`Téléchargement de ${files.length} image(s)...`);

    try {
      const uploadPromises = files.map(async (file, index) => {
        setUploadProgress(`Téléchargement ${index + 1}/${files.length}: ${file.name}`);
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`Type de fichier invalide pour ${file.name}. Seuls JPEG, PNG, WebP et GIF sont autorisés.`);
        }

        // Validate file size (max 4MB)
        const maxSize = 4 * 1024 * 1024; // 4MB
        if (file.size > maxSize) {
          throw new Error(`Fichier ${file.name} trop volumineux. Taille maximale : 4MB.`);
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Échec du téléchargement de ${file.name}`);
        }

        const data = await response.json();

        if (!data.success || !data.url) {
          throw new Error(`Réponse invalide pour ${file.name}`);
        }

        console.log(`✅ Image supplémentaire téléchargée: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) supplémentaire(s) ajoutée(s) avec succès`);
    } catch (error) {
      console.error('❌ Error uploading supplementary images:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du téléchargement des images supplémentaires';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    toast.success('Image supprimée');
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className={className}>
      <Label className="text-base font-medium">{label}</Label>
      
      {/* Image Grid */}
      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
              <Image
                src={imageUrl}
                alt={`Image ${index + 1}`}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {/* Add More Button */}
        {canAddMore && (
          <div className="aspect-square">
            <Button
              type="button"
              variant="outline"
              className="w-full h-full border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors flex flex-col items-center justify-center gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent" />
                  <span className="text-xs text-gray-500 text-center">Upload...</span>
                </div>
              ) : (
                <>
                  <Plus className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-500">Ajouter</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* File Input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Button */}
      <div className="mt-4 flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || !canAddMore}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Téléchargement...' : 'Choisir des images'}
        </Button>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">
            {images.length}/{maxImages} images • Formats: JPG, PNG, WebP (max 4MB)
          </p>
          {uploadProgress && (
            <p className="text-xs text-green-600 font-medium">
              {uploadProgress}
            </p>
          )}
        </div>
      </div>

      {images.length === 0 && (
        <div className="mt-4 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Aucune image sélectionnée</p>
          <p className="text-sm text-gray-400 mt-1">
            Cliquez sur "Choisir des images" pour ajouter des images
          </p>
        </div>
      )}
    </div>
  );
}
