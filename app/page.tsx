
'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import { ShopifyProduct } from '@/types/shopify';

function FeaturedProducts() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        console.log('FeaturedProducts component - API response:', data);

        if (data.products?.edges) {
          setProducts(data.products.edges);
        } else {
          setIsError(true);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (isLoading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  if (isError) {
    return <div className="text-center py-10">Error loading products</div>;
  }

  // Only show first 4 products on homepage
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="mt-6">
      <ProductGrid products={featuredProducts} />
      <div className="mt-8 text-center">
        <Link
          href="/products"
          className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <section className="py-12 bg-gray-50 rounded-lg mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              ZIPBAGS® Collections
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Découvrez nos collections de pochettes zippées stand-up (Doypack) conçues pour divers usages alimentaires et non alimentaires.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/products"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Shop Now
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  href="/collections"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Browse Collections
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Featured Products
          </h2>
          <Suspense fallback={<div className="text-center py-10">Loading products...</div>}>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
