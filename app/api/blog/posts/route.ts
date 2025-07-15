import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET /api/blog/posts - Get all published blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const viewFilter = searchParams.get('viewFilter') || 'all';

    const skip = (page - 1) * limit;

    const where: any = {
      published: true,
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (tag) {
      where.tags = {
        some: {
          slug: tag,
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Add view-based filtering
    if (viewFilter !== 'all') {
      switch (viewFilter) {
        case 'high':
          where.views = { gte: 500 };
          break;
        case 'medium':
          where.views = { gte: 100, lt: 500 };
          break;
        case 'low':
          where.views = { gte: 10, lt: 100 };
          break;
        case 'new':
          where.views = { lt: 10 };
          break;
      }
    }

    // Determine sorting order
    let orderBy: any = { createdAt: 'desc' }; // default
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'most-viewed':
        orderBy = { views: 'desc' };
        break;
      case 'least-viewed':
        orderBy = { views: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: true,
          tags: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST /api/blog/posts - Create a new blog post (admin only)
export async function POST(request: NextRequest) {
  console.log('🚀 Blog post creation API called');

  try {
    // Check authentication
    console.log('🔐 Checking authentication...');
    const session = await auth();

    if (!session?.user) {
      console.log('❌ No user session found');
      return NextResponse.json(
        { error: 'Non authentifié - Connexion requise' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      console.log('❌ User is not admin:', session.user.role);
      return NextResponse.json(
        { error: 'Accès non autorisé - Droits administrateur requis' },
        { status: 403 }
      );
    }

    console.log('✅ Authentication successful for user:', session.user.name);

    // Parse request body with size checking
    console.log('📝 Parsing request body...');

    // Check content-length header if available
    const contentLength = request.headers.get('content-length');
    if (contentLength) {
      const sizeInMB = parseInt(contentLength) / 1024 / 1024;
      console.log('📏 Request size:', `${sizeInMB.toFixed(2)}MB`);

      if (sizeInMB > 10) {
        console.log('❌ Request too large:', `${sizeInMB.toFixed(2)}MB`);
        return NextResponse.json(
          { error: `Contenu trop volumineux (${sizeInMB.toFixed(2)}MB). Limite: 10MB. Réduisez la taille des images ou du contenu.` },
          { status: 413 }
        );
      }
    }

    const body = await request.json();
    const { title, slug, excerpt, content, featuredImage, images, published, categoryId, tagIds } = body;

    // Optimize content size
    const optimizedContent = content ? content.trim() : '';
    const optimizedImages = images ? images.slice(0, 20) : []; // Limit to 20 images max

    console.log('📊 Received data:', {
      title: title?.substring(0, 50) + '...',
      slug,
      published,
      hasContent: !!optimizedContent,
      contentLength: optimizedContent?.length || 0,
      originalImageCount: images?.length || 0,
      optimizedImageCount: optimizedImages.length,
      categoryId,
      tagCount: tagIds?.length || 0
    });

    // Additional content size validation
    if (optimizedContent && optimizedContent.length > 500000) { // 500KB text limit
      console.log('❌ Content too large:', `${optimizedContent.length} characters`);
      return NextResponse.json(
        { error: 'Contenu textuel trop volumineux. Limite: 500,000 caractères. Réduisez la longueur du texte.' },
        { status: 413 }
      );
    }

    // Validation
    if (!title || !title.trim()) {
      console.log('❌ Validation failed: Title is required');
      return NextResponse.json(
        { error: 'Le titre est requis' },
        { status: 400 }
      );
    }

    if (!slug || !slug.trim()) {
      console.log('❌ Validation failed: Slug is required');
      return NextResponse.json(
        { error: 'Le slug est requis' },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
      console.log('❌ Validation failed: Content is required');
      return NextResponse.json(
        { error: 'Le contenu est requis' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    console.log('🔍 Checking if slug already exists...');
    try {
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug: slug.trim() },
      });

      if (existingPost) {
        console.log('❌ Slug already exists:', slug);
        return NextResponse.json(
          { error: 'Un article avec ce slug existe déjà' },
          { status: 400 }
        );
      }
      console.log('✅ Slug is available');
    } catch (dbError) {
      console.error('❌ Database error checking slug:', dbError);
      return NextResponse.json(
        { error: 'Erreur de base de données lors de la vérification du slug' },
        { status: 500 }
      );
    }

    // Validate category if provided
    if (categoryId) {
      const categoryExists = await prisma.blogCategory.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 400 }
        );
      }
    }

    // Validate tags if provided
    if (tagIds && tagIds.length > 0) {
      const existingTags = await prisma.blogTag.findMany({
        where: { id: { in: tagIds } },
      });

      if (existingTags.length !== tagIds.length) {
        return NextResponse.json(
          { error: 'One or more tags not found' },
          { status: 400 }
        );
      }
    }

    // Create the blog post
    console.log('💾 Creating blog post in database...');
    try {
      const post = await prisma.blogPost.create({
        data: {
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt?.trim() || '',
          content: optimizedContent,
          featuredImage: featuredImage?.trim() || '',
          images: optimizedImages,
          published: published || false,
          authorId: session.user.id,
          categoryId: categoryId || null,
          tags: tagIds && tagIds.length > 0 ? {
            connect: tagIds.map((id: string) => ({ id })),
          } : undefined,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: true,
          tags: true,
        },
      });

      console.log('✅ Blog post created successfully:', post.id);
      return NextResponse.json(post, { status: 201 });
    } catch (dbError) {
      console.error('❌ Database error creating post:', dbError);
      return NextResponse.json(
        { error: 'Erreur de base de données lors de la création de l\'article: ' + (dbError instanceof Error ? dbError.message : 'Erreur inconnue') },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Unexpected error creating blog post:', error);

    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('connect ECONNREFUSED')) {
        return NextResponse.json(
          { error: 'Erreur de connexion à la base de données. Veuillez réessayer.' },
          { status: 503 }
        );
      } else if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Délai d\'attente dépassé. Veuillez réessayer.' },
          { status: 504 }
        );
      } else if (error.message.includes('authentication')) {
        return NextResponse.json(
          { error: 'Erreur d\'authentification. Veuillez vous reconnecter.' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erreur inattendue lors de la création de l\'article: ' + (error instanceof Error ? error.message : 'Erreur inconnue') },
      { status: 500 }
    );
  }
}
