'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        console.log('Test page - API response:', data);

        if (data.products?.edges) {
          setProducts(data.products.edges);
        } else {
          setError('Unexpected data format');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-10">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page - Products</h1>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div>
          <p className="mb-4">Found {products.length} products:</p>
          <ul className="space-y-4">
            {products.map((product) => (
              <li key={product.node.id} className="border p-4 rounded">
                <h2 className="font-bold">{product.node.title}</h2>
                <p className="text-sm text-gray-600">{product.node.handle}</p>
                <p className="mt-2">
                  {product.node.priceRange.minVariantPrice.amount} {product.node.priceRange.minVariantPrice.currencyCode}
                </p>
                {product.node.images?.edges[0]?.node?.url && (
                  <img
                    src={product.node.images.edges[0].node.url}
                    alt={product.node.title}
                    className="mt-2 h-40 w-auto object-contain"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
