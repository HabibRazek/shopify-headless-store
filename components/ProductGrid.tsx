'use client';

import ProductCard from './ProductCard';
import { ShopifyProduct } from '@/types/shopify';

type ProductGridProps = {
  products: any[]; // Using any[] to handle different product structures
};

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {products.map((product, index) => (
        <ProductCard
          key={product.node?.id || product.id || index}
          product={product}
        />
      ))}
    </div>
  );
}
