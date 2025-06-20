import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if we're missing database
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 503 }
      );
    }

    // Dynamic import to avoid build-time issues
    let prisma;
    try {
      const prismaModule = await import('@/lib/prisma');

      if (!prismaModule.getPrismaClient) {
        throw new Error('getPrismaClient function not found in prisma module');
      }

      prisma = prismaModule.getPrismaClient();

      // Test basic connection
      await prisma.$queryRaw`SELECT 1 as test`;

    } catch (importError) {
      return NextResponse.json(
        {
          message: 'Database connection failed',
          error: importError instanceof Error ? importError.message : 'Unknown error',
          details: 'Could not establish database connection'
        },
        { status: 500 }
      );
    }

    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!session.user.id) {
      return NextResponse.json(
        { message: 'Invalid session - Missing user ID' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        shopifyCustomerId: true,
        emailVerified: true,
        image: true,
        role: true,
        phone: true,
        address: true,
        city: true,
        postalCode: true,
        country: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check if we're in build time or missing database
    if (!process.env.DATABASE_URL || process.env.SKIP_ENV_VALIDATION === '1') {
      return NextResponse.json(
        { message: 'Profile update not available during build' },
        { status: 503 }
      );
    }

    // Dynamic import to avoid build-time issues
    let prisma;
    try {
      const prismaModule = await import('@/lib/prisma');

      if (!prismaModule.getPrismaClient) {
        throw new Error('getPrismaClient function not found in prisma module');
      }

      prisma = prismaModule.getPrismaClient();

      // Test basic connection
      await prisma.$queryRaw`SELECT 1 as test`;

    } catch (importError) {
      return NextResponse.json(
        {
          message: 'Database connection failed',
          error: importError instanceof Error ? importError.message : 'Unknown error',
          details: 'Could not establish database connection'
        },
        { status: 500 }
      );
    }

    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized - Please sign in again' },
        { status: 401 }
      );
    }

    if (!session.user.id) {
      return NextResponse.json(
        { message: 'Invalid session - Missing user ID' },
        { status: 401 }
      );
    }

    const { name, phone, address, city, postalCode, country } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      );
    }

    // First, check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!existingUser) {
      // Try to find user by email as fallback
      const userByEmail = await prisma.user.findUnique({
        where: { email: session.user.email! },
      });

      if (userByEmail) {
        // Update with the correct user ID
        session.user.id = userByEmail.id;
      } else {
        return NextResponse.json(
          { message: 'User not found in database. Please sign out and sign in again.' },
          { status: 404 }
        );
      }
    }

    let updatedUser;
    try {
      updatedUser = await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          name,
          phone,
          address,
          city,
          postalCode,
          country: country || 'TN',
        },
      });
    } catch (dbError) {
      return NextResponse.json(
        { message: `Database update failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}` },
        { status: 500 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(
      { message: 'Profile updated successfully', user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        message: 'Something went wrong',
        error: errorMessage,
        details: 'An unexpected error occurred during profile update'
      },
      { status: 500 }
    );
  }
}
