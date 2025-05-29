import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Simple auth options for server-side session checking
const authOptions = {
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-build",
};

export async function GET(request: NextRequest) {
  try {
    // Check if we're in build time or missing database
    if (!process.env.DATABASE_URL || process.env.SKIP_ENV_VALIDATION === '1') {
      return NextResponse.json(
        { message: 'Orders not available during build' },
        { status: 503 }
      );
    }

    // Dynamic import to avoid build-time issues
    const { default: prisma } = await import('@/lib/prisma');

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get all orders for the user
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(
      { orders },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
