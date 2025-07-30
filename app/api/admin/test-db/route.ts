import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getPrismaClient } from '@/lib/prisma';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/admin/test-db - Test database connection
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    let prisma;
    try {
      prisma = getPrismaClient();
      await prisma.$connect();
      
      // Test a simple query
      const userCount = await prisma.user.count();
      
      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        userCount,
        timestamp: new Date().toISOString(),
      });
      
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Test DB error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
