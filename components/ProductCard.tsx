'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface ProductImage {
  url: string;
  altText?: string;
}

interface ProductPrice {
  amount: string;
  currencyCode: string;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: ProductPrice;
  };
  images?: {
    edges?: Array<{
      node: ProductImage;
    }>;
  } | ProductImage[];
  primaryImage?: string;
}

type ProductCardProps = {
  product: Product | { node: Product };
};

export default function ProductCard({ product }: ProductCardProps) {
  // Handle both direct product and product.node structure
  const productData = 'node' in product ? product.node : product;

  const { title, handle } = productData;
  const price = productData.priceRange.minVariantPrice.amount;
  const currency = productData.priceRange.minVariantPrice.currencyCode;

  // Handle both old GraphQL format (edges/node) and new simplified format
  const imageNode = productData.images && 'edges' in productData.images
    ? productData.images.edges?.[0]?.node
    : Array.isArray(productData.images) ? productData.images[0] : null;
  const imageUrl = imageNode?.url || productData.primaryImage || '/placeholder.png';
  const imageAlt = imageNode?.altText || title;

  // Get cart functions from context
  const { addToCart } = useCart();

  // Loading state for add to cart button
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle adding product to cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Stop event propagation to parent elements

    if (isLoading) return; // Prevent multiple clicks

    setIsLoading(true);

    try {
      // Add the product to the cart
      addToCart({
        id: productData.id,
        title: title,
        price: price,
        currency: currency,
        imageUrl: imageUrl,
        handle: handle
      });

      // Show a toast notification
      toast.success('Added to cart', {
        description: `${title} has been added to your cart.`,
        icon: <Check className="h-4 w-4 text-green-500" />,
        position: 'top-right',
        duration: 3000,
      });
    } catch (error) {
      toast.error('Error', {
        description: 'There was an error adding the product to your cart. Please try again.',
        position: 'top-right',
        duration: 5000,
      });
    } finally {
      // Reset loading state after a short delay
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300 h-full">
      {/* Product Image Container - Optimized for 2-column Mobile */}
      <div className="relative bg-gray-50 p-2 sm:p-3 md:p-4 lg:p-6">
        <Link href={`/products/${handle}`} className="block">
          <div className="relative aspect-square w-full">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />

            {/* Quick View Overlay - Compact for Mobile */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/5">
              <Button
                size="sm"
                variant="outline"
                className="bg-white/95 text-green-700 hover:bg-white border-green-300 shadow-lg backdrop-blur-sm text-xs px-2 py-1"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="hidden sm:inline">Aperçu</span>
                <span className="sm:hidden">Voir</span>
              </Button>
            </div>
          </div>
        </Link>

        {/* Stock Badge - Compact */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex items-center gap-1 bg-green-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
          <span className="text-xs font-semibold text-green-700">Stock</span>
        </div>
      </div>

      {/* Product Information - Compact for 2-column Mobile */}
      <div className="flex flex-col p-2 sm:p-3 md:p-4 lg:p-6 flex-grow">
        {/* Product Title - Optimized for 2-column Mobile */}
        <Link href={`/products/${handle}`} className="block group/link mb-2 sm:mb-3">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 group-hover/link:text-green-700 transition-colors duration-200 leading-tight min-h-[2rem] sm:min-h-[2.5rem] md:min-h-[3rem] line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Price Display - Compact for Mobile */}
        <div className="mb-2 sm:mb-3">
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
            {formatPrice(price, currency)}
          </div>
          <div className="text-xs text-gray-500">
            Prix TTC
          </div>
        </div>

        {/* Product Features - Compact for 2-column Mobile */}
        <div className="flex flex-col gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500 flex-shrink-0"></div>
            <span className="text-xs text-gray-700 font-medium">Disponible</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <svg className="w-3 h-3 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs text-gray-700 font-medium">Livraison rapide</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <svg className="w-3 h-3 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            </svg>
            <span className="text-xs text-gray-700 font-medium">Qualité garantie</span>
          </div>
        </div>

        {/* Action Buttons - Compact for 2-column Mobile */}
        <div className="mt-auto space-y-1.5 sm:space-y-2">
          <Button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 sm:py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm"
            size="sm"
            type="button"
          >
            <ShoppingCart className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-4 sm:w-4" />
            {isLoading ? (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Ajout...</span>
              </div>
            ) : (
              <span>Ajouter</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
