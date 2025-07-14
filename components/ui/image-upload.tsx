'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

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
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Type de fichier invalide. Seuls JPEG, PNG, WebP et GIF sont autorisés.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Fichier trop volumineux. Taille maximale : 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
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
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Échec du téléchargement de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
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
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex flex-col items-center space-y-3">
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
                  <p className="text-sm font-medium text-gray-900">Uploading image...</p>
                  <p className="text-xs text-gray-500">Please wait</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-900">Upload an image</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Drag and drop or click to browse
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, WebP or GIF (max 5MB)
                  </p>
                </div>
              )}
            </div>

            {!isUploading && (
              <Button type="button" variant="outline" size="sm" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
