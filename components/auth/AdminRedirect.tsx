'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export function AdminRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Only run after session is loaded and user is authenticated
    if (status === 'loading') return;

    if (session?.user?.role === 'admin' && !hasRedirected.current) {
      const callbackUrl = searchParams.get('callbackUrl');
      const currentPath = window.location.pathname;

      // Only redirect if:
      // 1. User is on home page
      // 2. There's a callbackUrl parameter (indicating they just logged in)
      // 3. Haven't already redirected in this session
      if (currentPath === '/' && callbackUrl && (callbackUrl === '/' || callbackUrl === window.location.origin)) {
        hasRedirected.current = true;
        router.replace('/admin');
      }
    }
  }, [session, status, router, searchParams]);

  return null; // This component doesn't render anything
}
