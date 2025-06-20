import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
  try {
    console.log('🔄 Profile GET request received');

    // Check if we're missing database
    if (!process.env.DATABASE_URL) {
      console.log('❌ Database not configured');
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 503 }
      );
    }

    console.log('✅ Database URL available');

    // Dynamic import to avoid build-time issues
    let prisma;
    try {
      console.log('🔄 Attempting to import Prisma client...');
      const prismaModule = await import('@/lib/prisma');
      console.log('✅ Prisma module imported, available functions:', Object.keys(prismaModule));

      if (!prismaModule.getPrismaClient) {
        throw new Error('getPrismaClient function not found in prisma module');
      }

      prisma = prismaModule.getPrismaClient();
      console.log('✅ Prisma client instance created');

      // Test basic connection
      await prisma.$queryRaw`SELECT 1 as test`;
      console.log('✅ Database connection test successful');

    } catch (importError) {
      console.error('❌ Failed to load/test Prisma client:', importError);
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
    console.log('🔍 Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id || 'none',
      userEmail: session?.user?.email || 'none'
    });

    if (!session || !session.user) {
      console.log('❌ No valid session found');
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!session.user.id) {
      console.log('❌ No user ID in session');
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
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 Profile update request received');

    // Check if we're in build time or missing database
    if (!process.env.DATABASE_URL || process.env.SKIP_ENV_VALIDATION === '1') {
      console.log('❌ Database not available');
      return NextResponse.json(
        { message: 'Profile update not available during build' },
        { status: 503 }
      );
    }

    console.log('✅ Database URL available:', process.env.DATABASE_URL.substring(0, 30) + '...');

    // Dynamic import to avoid build-time issues
    let prisma;
    try {
      console.log('🔄 Attempting to import Prisma client...');
      const prismaModule = await import('@/lib/prisma');
      console.log('✅ Prisma module imported, available functions:', Object.keys(prismaModule));

      if (!prismaModule.getPrismaClient) {
        throw new Error('getPrismaClient function not found in prisma module');
      }

      prisma = prismaModule.getPrismaClient();
      console.log('✅ Prisma client instance created');

      // Test basic connection
      await prisma.$queryRaw`SELECT 1 as test`;
      console.log('✅ Database connection test successful');

    } catch (importError) {
      console.error('❌ Failed to load/test Prisma client:', importError);
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
    console.log('🔍 Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id || 'none',
      userEmail: session?.user?.email || 'none'
    });

    if (!session || !session.user) {
      console.log('❌ No valid session found');
      return NextResponse.json(
        { message: 'Unauthorized - Please sign in again' },
        { status: 401 }
      );
    }

    if (!session.user.id) {
      console.log('❌ No user ID in session');
      return NextResponse.json(
        { message: 'Invalid session - Missing user ID' },
        { status: 401 }
      );
    }

    const { name, phone, address, city, postalCode, country } = await request.json();
    console.log('📝 Update data received:', { name, phone, address, city, postalCode, country });

    if (!name) {
      console.log('❌ Name is required but not provided');
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      );
    }

    console.log('🔄 Attempting to update user:', session.user.id);

    // First, check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!existingUser) {
      console.error('❌ User not found in database:', session.user.id);

      // Try to find user by email as fallback
      const userByEmail = await prisma.user.findUnique({
        where: { email: session.user.email! },
      });

      if (userByEmail) {
        console.log('🔄 Found user by email, updating session...');
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
      console.log('✅ User updated successfully');
    } catch (dbError) {
      console.error('❌ Database update failed:', dbError);
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
    console.error('❌ Profile update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    console.error('❌ Error stack:', errorStack);

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
