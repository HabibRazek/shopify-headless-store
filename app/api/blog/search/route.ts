import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/blog/search - Search blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        posts: [],
        total: 0,
        query: query || '',
      });
    }

    const searchQuery = query.trim();

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: {
          published: true,
          OR: [
            {
              title: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            },
            {
              excerpt: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            },
            {
              content: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            },
            {
              category: {
                name: {
                  contains: searchQuery,
                  mode: 'insensitive',
                },
              },
            },
            {
              tags: {
                some: {
                  name: {
                    contains: searchQuery,
                    mode: 'insensitive',
                  },
                },
              },
            },
          ],
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
        orderBy: [
          {
            // Prioritize title matches
            title: 'asc',
          },
          {
            createdAt: 'desc',
          },
        ],
        take: limit,
      }),
      prisma.blogPost.count({
        where: {
          published: true,
          OR: [
            {
              title: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            },
            {
              excerpt: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            },
            {
              content: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            },
            {
              category: {
                name: {
                  contains: searchQuery,
                  mode: 'insensitive',
                },
              },
            },
            {
              tags: {
                some: {
                  name: {
                    contains: searchQuery,
                    mode: 'insensitive',
                  },
                },
              },
            },
          ],
        },
      }),
    ]);

    return NextResponse.json({
      posts,
      total,
      query: searchQuery,
    });
  } catch (error) {
    console.error('Error searching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to search blog posts' },
      { status: 500 }
    );
  }
}
