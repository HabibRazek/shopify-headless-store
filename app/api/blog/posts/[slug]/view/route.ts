import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();
    const { slug } = params;

    // Get client IP and User Agent for anonymous tracking
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Find the blog post
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true, views: true }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Simple session-based tracking to prevent multiple increments
    // Check if this view was already tracked in this session
    const viewKey = `blog_view_${post.id}`;
    const hasViewedInSession = request.headers.get('x-viewed-posts')?.includes(viewKey);

    let shouldIncrementView = !hasViewedInSession;

    // If no existing view found, create one and increment the counter
    if (shouldIncrementView) {
      // Increment the view count on the post
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { views: { increment: 1 } }
      });
    }

    const response = NextResponse.json({
      success: true,
      viewIncremented: shouldIncrementView,
      totalViews: shouldIncrementView ? post.views + 1 : post.views,
      isNewVisitor: shouldIncrementView,
      viewedAt: new Date()
    });

    // Set header to track viewed posts in this session
    if (shouldIncrementView) {
      const viewedPosts = request.headers.get('x-viewed-posts') || '';
      const newViewedPosts = viewedPosts ? `${viewedPosts},blog_view_${post.id}` : `blog_view_${post.id}`;
      response.headers.set('x-viewed-posts', newViewedPosts);
    }

    return response;

  } catch (error) {
    console.error('Error tracking post view:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if user has viewed the post
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();
    const { slug } = params;

    // Get client IP and User Agent for anonymous tracking
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Find the blog post
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true, views: true }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    let viewRecord = null;

    // TODO: Re-enable after Prisma client regeneration
    // if (session?.user?.id) {
    //   // For authenticated users
    //   viewRecord = await prisma.postView.findFirst({
    //     where: {
    //       postId: post.id,
    //       userId: session.user.id
    //     }
    //   });
    // } else {
    //   // For anonymous users
    //   viewRecord = await prisma.postView.findFirst({
    //     where: {
    //       postId: post.id,
    //       userId: null,
    //       ipAddress: ip,
    //       userAgent: userAgent
    //     }
    //   });
    // }

    return NextResponse.json({
      hasViewed: !!viewRecord,
      viewedAt: viewRecord?.viewedAt || null,
      totalViews: post.views
    });

  } catch (error) {
    console.error('Error checking post view:', error);
    return NextResponse.json(
      { error: 'Failed to check view status' },
      { status: 500 }
    );
  }
}
