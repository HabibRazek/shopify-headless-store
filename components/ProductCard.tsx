'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

type ProductCardProps = {
  product: any; // Using any to handle both direct product and product.node
};

export default function ProductCard({ product }: ProductCardProps) {
  // Handle both direct product and product.node structure
  const productData = product.node || product;

  const { title, handle } = productData;
  const price = productData.priceRange.minVariantPrice.amount;
  const currency = productData.priceRange.minVariantPrice.currencyCode;

  // Handle both old GraphQL format (edges/node) and new simplified format
  const imageNode = productData.images?.edges?.[0]?.node || productData.images?.[0];
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
      {/* Product Image Container */}
      <div className="relative bg-gray-50 p-6">
        <Link href={`/products/${handle}`} className="block">
          <div className="relative aspect-square w-full">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />

            {/* Quick View Overlay - Subtle */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/5">
              <Button
                size="sm"
                variant="outline"
                className="bg-white/95 text-green-700 hover:bg-white border-green-300 shadow-lg backdrop-blur-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Aperçu rapide
              </Button>
            </div>
          </div>
        </Link>

        {/* Stock Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-green-100 px-3 py-1.5 rounded-full">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-xs font-semibold text-green-700">En stock</span>
        </div>
      </div>

      {/* Product Information - Clear Layout */}
      <div className="flex flex-col p-6 flex-grow">
        {/* Product Title - Full Display */}
        <Link href={`/products/${handle}`} className="block group/link mb-4">
          <h3 className="text-lg font-bold text-gray-900 group-hover/link:text-green-700 transition-colors duration-200 leading-tight min-h-[3rem]">
            {title}
          </h3>
        </Link>

        {/* Price Display - Prominent */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-green-600">
            {formatPrice(price, currency)}
          </div>
          <div className="text-sm text-gray-500">
            Prix TTC
          </div>
        </div>

        {/* Product Features */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700 font-medium">Disponible immédiatement</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm text-gray-700 font-medium">Livraison rapide</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            </svg>
            <span className="text-sm text-gray-700 font-medium">Qualité garantie</span>
          </div>
        </div>

        {/* Add to Cart Button - Fixed at Bottom */}
        <div className="mt-auto">
          <Button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            size="lg"
            type="button"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Ajout en cours...
              </div>
            ) : (
              'Ajouter au panier'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
