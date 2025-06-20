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

    return NextResponse.json({
      authenticated: !!session && !!token,
      session: session ? {
        user: {
          id: session.user?.id,
          email: session.user?.email,
          name: session.user?.name
        }
      } : null
    });
  } catch {
    return NextResponse.json({
      authenticated: false,
      error: 'Failed to check authentication status'
    }, { status: 500 });
  }
}
