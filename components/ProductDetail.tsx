'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatPrice, getProductImage } from '@/lib/utils';
import { useShopContext } from '@/context/ShopContext';
import { ShopifyProduct } from '@/types/shopify';

type ProductDetailProps = {
  product: any; // Using any for now since we're passing the raw product data
  handle: string;
};

export default function ProductDetail({ product, handle }: ProductDetailProps) {
  const { addToCart } = useShopContext();
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const variants = product.variants?.edges || [];
  const firstVariant = variants[0]?.node;
  const images = product.images?.edges || [];

  // Set the first variant as selected by default if none is selected
  if (!selectedVariant && firstVariant) {
    setSelectedVariant(firstVariant.id);
  }

  const currentVariant = variants.find(
    (v: any) => v.node.id === selectedVariant
  )?.node || firstVariant;

  const price = currentVariant?.price?.amount || product.priceRange.minVariantPrice.amount;
  const currency = currentVariant?.price?.currencyCode || product.priceRange.minVariantPrice.currencyCode;

  const handleAddToCart = () => {
    if (!currentVariant) return;

    addToCart({
      variantId: currentVariant.id,
      quantity,
      title: `${product.title} - ${currentVariant.title}`,
      price: currentVariant.price.amount,
      image: getProductImage(product),
    });
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery - Mobile Optimized */}
          <div className="flex flex-col-reverse">
            <div className="aspect-h-1 aspect-w-1 w-full">
              <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden rounded-lg">
                <Image
                  src={getProductImage(product)}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
            {images.length > 1 && (
              <div className="mt-4 sm:mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {images.map((image: any) => (
                  <div
                    key={image.node.id}
                    className="relative h-16 sm:h-20 md:h-24 cursor-pointer overflow-hidden rounded-lg"
                  >
                    <Image
                      src={image.node.url}
                      alt={image.node.altText || product.title}
                      fill
                      sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                      className="object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info - Mobile Optimized */}
          <div className="mt-6 sm:mt-8 lg:mt-0 px-4 sm:px-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              {product.title}
            </h1>
            <div className="mt-2 sm:mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-2xl sm:text-3xl tracking-tight text-gray-900">
                {formatPrice(price, currency)}
              </p>
            </div>

            <div className="mt-4 sm:mt-6">
              <h3 className="sr-only">Description</h3>
              <div
                className="space-y-4 sm:space-y-6 text-sm sm:text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>

            <div className="mt-4 sm:mt-6">
              {variants.length > 1 && (
                <div>
                  <h3 className="text-sm text-gray-600">Variants</h3>
                  <div className="mt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {variants.map((variant: any) => (
                        <button
                          key={variant.node.id}
                          type="button"
                          className={`relative inline-flex items-center rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${
                            selectedVariant === variant.node.id
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedVariant(variant.node.id)}
                        >
                          {variant.node.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 sm:mt-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center justify-center sm:justify-start">
                    <button
                      type="button"
                      className="rounded-l-md border border-gray-300 px-3 py-2 text-gray-900 hover:bg-gray-50 text-sm sm:text-base"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <div className="w-12 sm:w-14 border-t border-b border-gray-300 px-3 py-2 text-center text-sm sm:text-base">
                      {quantity}
                    </div>
                    <button
                      type="button"
                      className="rounded-r-md border border-gray-300 px-3 py-2 text-gray-900 hover:bg-gray-50 text-sm sm:text-base"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="flex-1 rounded-md border border-transparent bg-indigo-600 px-4 py-2.5 sm:py-2 text-sm sm:text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
