import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname is a protected route
  const isProtectedRoute = 
    pathname.startsWith('/profile') || 
    pathname.startsWith('/orders') ||
    pathname.startsWith('/checkout');

  // Check if the pathname is an auth route
  const isAuthRoute = 
    pathname.startsWith('/auth/signin') || 
    pathname.startsWith('/auth/signup');

  // Get the token
  const token = await getToken({ req: request });

  // If it's a protected route and there's no token, redirect to signin
  if (isProtectedRoute && !token) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // If it's an auth route and there's a token, redirect to profile
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
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
