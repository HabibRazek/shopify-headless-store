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
    let dbLatency = 0;
    let dbError = '';

    try {
      if (process.env.DATABASE_URL) {
        const startTime = Date.now();
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
        dbLatency = Date.now() - startTime;
        dbStatus = 'connected';
      } else {
        dbStatus = 'no_url';
      }
    } catch (error) {
      dbStatus = 'error';
      dbError = error instanceof Error ? error.message : 'Unknown error';
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        status: dbStatus,
        latency: dbLatency,
        error: dbError || undefined
      },
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
