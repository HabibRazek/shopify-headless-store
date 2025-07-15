import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// Simple production-safe image upload using external image hosting
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier téléchargé' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier invalide. Seuls JPEG, PNG, WebP et GIF sont autorisés.' },
        { status: 400 }
      );
    }

    // Validate file size (max 4MB)
    const maxSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Taille maximale : 4MB.' },
        { status: 400 }
      );
    }

    try {
      // Try to upload to imgbb.com (free image hosting service)
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');

      const formData = new FormData();
      formData.append('image', base64);
      formData.append('key', '2d1f7b0e8c6d4a9f3b5e8c7a1d4f6b9e'); // Free API key for imgbb

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log(`✅ Image uploaded to imgbb: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);

          return NextResponse.json({
            success: true,
            url: result.data.url,
            filename: file.name,
            size: file.size,
            type: file.type,
            message: 'Image téléchargée avec succès sur le cloud'
          });
        }
      }
    } catch (cloudError) {
      console.warn('Cloud upload failed, using base64 fallback:', cloudError);
    }

    // Fallback to base64 if cloud upload fails
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    console.log(`✅ Image processed with base64 fallback: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);

    return NextResponse.json({
      success: true,
      url: dataUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      message: 'Image téléchargée avec succès (mode local)'
    });

  } catch (error) {
    console.error('❌ Error uploading image:', error);
    return NextResponse.json(
      { error: 'Échec du téléchargement de l\'image' },
      { status: 500 }
    );
  }
}
