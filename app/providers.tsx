'use client';

import { SessionProvider } from 'next-auth/react';
import { UploadThingProvider } from '@/components/providers/uploadthing-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UploadThingProvider>
        {children}
      </UploadThingProvider>
    </SessionProvider>
  );
}
