'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/lib/uploadthing';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  label?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  label = "Upload Image",
  className = ""
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [useUploadThing, setUseUploadThing] = useState(false); // Start with fallback method
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fallback upload function
  const handleFallbackUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Type de fichier invalide. Seuls JPEG, PNG, WebP et GIF sont autorisés.');
      return;
    }

    // Validate file size (max 4MB)
    const maxSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSize) {
      toast.error('Fichier trop volumineux. Taille maximale : 4MB.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      onChange(result.url);
      toast.success(`Image téléchargée avec succès! (${(file.size / 1024).toFixed(1)} KB)`);
    } catch (error) {
      console.error('Fallback upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Échec du téléchargement de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFallbackUpload(file);
    }
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };



  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      {value ? (
        <div className="relative group">
          <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-50">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Click X to remove
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors border-gray-300 hover:border-gray-400">
          <div className="flex flex-col items-center space-y-4">
            {isUploading ? (
              <Loader2 className="h-12 w-12 animate-spin text-green-500" />
            ) : (
              <div className="p-3 bg-gray-100 rounded-full">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}

            <div className="text-center">
              {isUploading ? (
                <div>
                  <p className="text-sm font-medium text-gray-900">Téléchargement en cours...</p>
                  <p className="text-xs text-gray-500">Veuillez patienter</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-900">Télécharger une image</p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WebP ou GIF (max 4MB)
                  </p>
                </div>
              )}
            </div>

            {!isUploading && (
              <div className="flex flex-col space-y-2">
                {!useUploadThing && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Télécharger une image
                    </Button>
                  </>
                )}

                {useUploadThing && (
                  <UploadButton<OurFileRouter, "imageUploader">
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        onChange(res[0].url);
                        toast.success('Image téléchargée avec succès via UploadThing!');
                      }
                    }}
                    onUploadError={(error: Error) => {
                      console.error('UploadThing error:', error);
                      toast.error('Erreur UploadThing. Utilisation de la méthode alternative...');
                      setUseUploadThing(false);
                    }}
                    appearance={{
                      button: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      allowedContent: "text-xs text-gray-500 mt-2"
                    }}
                  />
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUseUploadThing(!useUploadThing)}
                  className="text-xs"
                >
                  {useUploadThing ? 'Utiliser méthode standard' : 'Essayer UploadThing'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
