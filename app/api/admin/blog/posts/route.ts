import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/blog/posts - Get all blog posts for admin (including unpublished)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status'); // 'published', 'draft', 'all'
    const search = searchParams.get('search');
    const viewFilter = searchParams.get('viewFilter'); // 'all', 'high', 'medium', 'low', 'no-views'
    const sortBy = searchParams.get('sortBy'); // 'newest', 'oldest', 'most-viewed', 'least-viewed', 'recently-viewed'

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status === 'published') {
      where.published = true;
    } else if (status === 'draft') {
      where.published = false;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    // View filters
    if (viewFilter === 'high') {
      where.views = { gt: 100 };
    } else if (viewFilter === 'medium') {
      where.views = { gte: 10, lte: 100 };
    } else if (viewFilter === 'low') {
      where.views = { gt: 0, lt: 10 };
    } else if (viewFilter === 'no-views') {
      where.views = 0;
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
          _count: {
            select: {
              tags: true,
            },
          },
        },
        orderBy: (() => {
          switch (sortBy) {
            case 'oldest':
              return { createdAt: 'asc' };
            case 'most-viewed':
              return { views: 'desc' };
            case 'least-viewed':
              return { views: 'asc' };
            case 'recently-viewed':
              return { updatedAt: 'desc' };
            case 'newest':
            default:
              return { createdAt: 'desc' };
          }
        })(),
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
    console.error('Error fetching admin blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
