import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    // Get session using auth()
    const session = await auth();
    
    // Get token using getToken() with fallback for different cookie names
    let token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      secureCookie: process.env.NODE_ENV === 'production',
    });

    // Fallback to try the other cookie name if first attempt fails
    if (!token) {
      token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: process.env.NODE_ENV === 'production'
          ? 'next-auth.session-token'
          : '__Secure-next-auth.session-token',
        secureCookie: process.env.NODE_ENV !== 'production',
      });
    }

    // Debug information
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasSession: !!session,
      hasToken: !!token,
      sessionUserId: session?.user?.id || null,
      tokenUserId: token?.id || null,
      userAgent: request.headers.get('user-agent')?.substring(0, 50),
      cookies: {
        sessionToken: request.cookies.get('next-auth.session-token')?.value ? 'present' : 'missing',
        secureSessionToken: request.cookies.get('__Secure-next-auth.session-token')?.value ? 'present' : 'missing',
        cookieNames: request.cookies.getAll().map(cookie => cookie.name)
      },
      url: request.url,
      host: request.headers.get('host')
    };

    return NextResponse.json({
      authenticated: !!session && !!token,
      session: session ? {
        user: {
          id: session.user?.id,
          email: session.user?.email,
          name: session.user?.name
        }
      } : null,
      debug: debugInfo
    });
  } catch (error) {
    console.error('Auth status check error:', error);
    return NextResponse.json({
      authenticated: false,
      error: 'Failed to check authentication status',
      debug: {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}
