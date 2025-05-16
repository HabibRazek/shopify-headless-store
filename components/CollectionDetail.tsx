'use client';

import ProductGrid from '@/components/ProductGrid';

type CollectionDetailProps = {
  collection: any; // Using any for now since we're passing the raw collection data
};

export default function CollectionDetail({ collection }: CollectionDetailProps) {
  const products = collection.products?.edges || [];

  return (
    <div>
      <div className="pb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="mt-2 text-gray-500">{collection.description}</p>
        )}
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
