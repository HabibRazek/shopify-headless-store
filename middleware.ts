import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and auth debug page
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname.startsWith('/auth-debug')
  ) {
    return NextResponse.next();
  }

  // Check if the pathname is a protected route
  const isProtectedRoute =
    pathname.startsWith('/profile') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/checkout');

  // Check if the pathname is an auth route
  const isAuthRoute =
    pathname.startsWith('/auth/signin') ||
    pathname.startsWith('/auth/signup');

  // If it's not a protected route or auth route, continue
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  try {
    // Simplified token configuration that works for both environments
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Debug logging for both environments
    console.log('Middleware Debug:', {
      pathname,
      hasToken: !!token,
      isProtectedRoute,
      isAuthRoute,
      tokenId: token?.id || 'none',
      environment: process.env.NODE_ENV
    });

    // If it's a protected route and there's no token, redirect to signin
    if (isProtectedRoute && !token) {
      console.log('🔒 Redirecting to signin - no valid token for protected route:', pathname);
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    // If it's an auth route and there's a token, redirect to profile
    if (isAuthRoute && token) {
      console.log('✅ Redirecting authenticated user from auth route to profile');
      return NextResponse.redirect(new URL('/profile', request.url));
    }

    // Allow access to protected routes if token exists
    if (isProtectedRoute && token) {
      console.log('✅ Allowing access to protected route:', pathname);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('❌ Middleware error:', error);

    // If there's an error with token validation and it's a protected route,
    // redirect to signin as a fallback
    if (isProtectedRoute) {
      console.log('🔒 Fallback redirect to signin due to error');
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      url.searchParams.set('error', 'middleware_error');
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/profile/:path*',
    '/orders/:path*',
    '/checkout/:path*',
    '/auth/signin',
    '/auth/signup',
  ],
};
