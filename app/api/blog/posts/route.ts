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
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, slug, excerpt, content, featuredImage, images, published, categoryId, tagIds } = body;

    // Validation
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!slug || !slug.trim()) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: slug.trim() },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: 'Un article avec ce slug existe déjà' },
        { status: 400 }
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

    const post = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt?.trim() || '',
        content: content.trim(),
        featuredImage: featuredImage?.trim() || '',
        images: images || [],
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

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
