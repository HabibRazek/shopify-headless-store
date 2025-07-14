import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// PUT /api/blog/tags/[id] - Update a blog tag (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if the tag exists
    const existingTag = await prisma.blogTag.findUnique({
      where: { id: params.id },
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    // Check if slug already exists (excluding current tag)
    if (slug !== existingTag.slug) {
      const slugExists = await prisma.blogTag.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'A tag with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const tag = await prisma.blogTag.update({
      where: { id: params.id },
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error updating blog tag:', error);
    return NextResponse.json(
      { error: 'Failed to update blog tag' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/tags/[id] - Delete a blog tag (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const tag = await prisma.blogTag.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    // Unlike categories, we can delete tags even if they have posts
    // The many-to-many relationship will be automatically cleaned up
    await prisma.blogTag.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog tag' },
      { status: 500 }
    );
  }
}
