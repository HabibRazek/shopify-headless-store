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
    };

    // Test database connection
    let dbStatus = 'unknown';
    try {
      if (process.env.DATABASE_URL) {
        const { getPrismaClient } = await import('@/lib/prisma');
        const prisma = getPrismaClient();
        await prisma.$connect();
        await prisma.$disconnect();
        dbStatus = 'connected';
      } else {
        dbStatus = 'no_url';
      }
    } catch (error) {
      dbStatus = 'error';
      console.error('Database health check error:', error);
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: dbStatus,
    });
  } catch (error) {
    console.error('Health check error:', error);
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
