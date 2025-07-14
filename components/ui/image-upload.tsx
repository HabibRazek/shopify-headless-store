'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Image as ImageIcon } from 'lucide-react';
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
            <div className="p-3 bg-gray-100 rounded-full">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">Upload an image</p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WebP or GIF (max 4MB)
              </p>
            </div>

            <UploadButton<OurFileRouter, "imageUploader">
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  onChange(res[0].url);
                  toast.success('Image téléchargée avec succès!');
                }
              }}
              onUploadError={(error: Error) => {
                console.error('Upload error:', error);
                toast.error(error.message || 'Échec du téléchargement de l\'image');
              }}
              onUploadBegin={() => {
                // Upload started
              }}
              onUploadProgress={() => {
                // Optional: handle progress
              }}
              appearance={{
                button: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                allowedContent: "text-xs text-gray-500 mt-2"
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
