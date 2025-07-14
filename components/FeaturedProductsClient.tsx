'use client';

import { Suspense } from 'react';
import FeaturedProducts from '@/components/FeaturedProducts';
import { InlineLoader } from '@/components/ui/loader';

export default function FeaturedProductsClient() {
  return (
    <Suspense fallback={<InlineLoader text="Chargement des produits populaires..." />}>
      <FeaturedProducts />
    </Suspense>
  );
}
