import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// PUT /api/blog/categories/[id] - Update a blog category (admin only)
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
    const { name, slug, description } = body;

    // Check if the category exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id: params.id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if slug already exists (excluding current category)
    if (slug !== existingCategory.slug) {
      const slugExists = await prisma.blogCategory.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'A category with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const category = await prisma.blogCategory.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating blog category:', error);
    return NextResponse.json(
      { error: 'Failed to update blog category' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/categories/[id] - Delete a blog category (admin only)
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

    const category = await prisma.blogCategory.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has posts
    if (category._count.posts > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing posts' },
        { status: 400 }
      );
    }

    await prisma.blogCategory.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog category:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog category' },
      { status: 500 }
    );
  }
}
