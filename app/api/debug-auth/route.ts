import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      DATABASE_URL: !!process.env.DATABASE_URL,
      
      // Show partial values for debugging (safe)
      NEXTAUTH_URL_VALUE: process.env.NEXTAUTH_URL,
      GOOGLE_CLIENT_ID_PARTIAL: process.env.GOOGLE_CLIENT_ID ? 
        process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 'Not set',
    };

    // Test database connection
    let dbStatus = 'unknown';
    let dbError = '';
    
    try {
      if (process.env.DATABASE_URL) {
        const { getPrismaClient } = await import('@/lib/prisma');
        const prisma = getPrismaClient();
        
        await Promise.race([
          prisma.$connect(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout')), 5000)
          )
        ]);
        
        await Promise.race([
          prisma.$queryRaw`SELECT 1`,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Query timeout')), 3000)
          )
        ]);
        
        await prisma.$disconnect();
        dbStatus = 'connected';
      } else {
        dbStatus = 'no_url';
      }
    } catch (error) {
      dbStatus = 'error';
      dbError = error instanceof Error ? error.message : 'Unknown error';
    }

    // Test NextAuth configuration
    let authStatus = 'unknown';
    let authError = '';
    
    try {
      // Try to import auth configuration
      await import('@/auth');
      authStatus = 'config_loaded';
    } catch (error) {
      authStatus = 'config_error';
      authError = error instanceof Error ? error.message : 'Unknown error';
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        status: dbStatus,
        error: dbError || undefined
      },
      auth: {
        status: authStatus,
        error: authError || undefined
      },
      deployment: {
        region: process.env.VERCEL_REGION || 'unknown',
        url: process.env.VERCEL_URL || 'unknown'
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
