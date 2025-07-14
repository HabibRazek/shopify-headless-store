'use client';

import { Suspense } from 'react';
import AboutContent from '@/components/AboutContent';
import { InlineLoader } from '@/components/ui/loader';

export default function AboutPageClient() {
  return (
    <Suspense fallback={<InlineLoader text="Chargement de la page..." />}>
      <AboutContent />
    </Suspense>
  );
}
