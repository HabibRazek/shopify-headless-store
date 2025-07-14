'use client';

import { Suspense } from 'react';
import ProductsClient from '@/app/products/products-client';
import { InlineLoader } from '@/components/ui/loader';

export default function ProductsPageClient() {
  return (
    <Suspense fallback={<InlineLoader text="Chargement des produits..." />}>
      <ProductsClient />
    </Suspense>
  );
}
