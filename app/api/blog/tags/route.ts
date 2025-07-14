import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET /api/blog/tags - Get all blog tags
export async function GET() {
  try {
    const tags = await prisma.blogTag.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                published: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog tags' },
      { status: 500 }
    );
  }
}

// POST /api/blog/tags - Create a new blog tag (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, slug } = body;

    // Check if slug already exists
    const existingTag = await prisma.blogTag.findUnique({
      where: { slug },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: 'A tag with this slug already exists' },
        { status: 400 }
      );
    }

    const tag = await prisma.blogTag.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Error creating blog tag:', error);
    return NextResponse.json(
      { error: 'Failed to create blog tag' },
      { status: 500 }
    );
  }
}
