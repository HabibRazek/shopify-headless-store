import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// Health check endpoint for blog functionality
export async function GET(request: NextRequest) {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {
      authentication: false,
      database: false,
      blogTables: false,
    },
    details: {} as any,
  };

  try {
    // Check authentication
    console.log('🔐 Testing authentication...');
    const session = await auth();
    checks.checks.authentication = !!session;
    checks.details.authentication = {
      hasSession: !!session,
      hasUser: !!session?.user,
      userRole: session?.user?.role,
      userId: session?.user?.id,
    };

    // Check database connection
    console.log('💾 Testing database connection...');
    try {
      await prisma.$connect();
      checks.checks.database = true;
      checks.details.database = { status: 'connected' };
    } catch (dbError) {
      checks.details.database = { 
        status: 'error', 
        error: dbError instanceof Error ? dbError.message : 'Unknown error' 
      };
    }

    // Check blog tables
    console.log('📝 Testing blog tables...');
    try {
      const [postCount, categoryCount, tagCount] = await Promise.all([
        prisma.blogPost.count(),
        prisma.blogCategory.count(),
        prisma.blogTag.count(),
      ]);
      
      checks.checks.blogTables = true;
      checks.details.blogTables = {
        posts: postCount,
        categories: categoryCount,
        tags: tagCount,
      };
    } catch (tableError) {
      checks.details.blogTables = { 
        status: 'error', 
        error: tableError instanceof Error ? tableError.message : 'Unknown error' 
      };
    }

    const allHealthy = Object.values(checks.checks).every(check => check === true);
    const status = allHealthy ? 200 : 503;

    console.log('🏥 Health check completed:', { 
      status, 
      healthy: allHealthy,
      checks: checks.checks 
    });

    return NextResponse.json(checks, { status });

  } catch (error) {
    console.error('❌ Health check failed:', error);
    
    return NextResponse.json({
      ...checks,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.warn('⚠️ Error disconnecting from database:', disconnectError);
    }
  }
}
