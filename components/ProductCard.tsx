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
    <div className="group relative flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-green-100 hover:border-green-200">
      {/* Product Image Container */}
      <div className="relative overflow-hidden bg-white">
        <Link href={`/products/${handle}`} className="block">
          <div className="relative aspect-square w-full">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105 p-6"
              priority={false}
            />

            {/* Enhanced Quick View Button - More Visible Product */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-[1px]">
              <Button
                size="sm"
                variant="default"
                className="shadow-lg bg-white/95 text-green-700 hover:bg-white border border-green-200"
              >
                Aperçu rapide
              </Button>
            </div>
          </div>
        </Link>

        {/* Clean Price Badge */}
        <div className="absolute top-3 right-3 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
          <p className="text-sm font-semibold text-green-700">
            {formatPrice(price, currency)}
          </p>
        </div>

        {/* Clean Stock Status Badge */}
        <div className="absolute top-3 left-3 flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-green-200 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-xs font-medium text-green-700">En stock</span>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex-grow p-5">
        <Link href={`/products/${handle}`} className="block group/link">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 min-h-[3rem] group-hover/link:text-green-700 transition-colors duration-200 leading-tight mb-3">
            {title}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-green-300"></div>
            </div>
            <span className="text-xs font-medium text-gray-600">Disponible</span>
          </div>

          <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-200">
            Livraison rapide
          </span>
        </div>

        {/* Clean Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full"
          size="default"
          type="button"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isLoading ? 'Ajout...' : 'Ajouter au panier'}
        </Button>
      </div>
    </div>
  );
}
