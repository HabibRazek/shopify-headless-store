'use client';

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

  const imageNode = productData.images?.edges[0]?.node;
  const imageUrl = imageNode?.url || '/placeholder.png';
  const imageAlt = imageNode?.altText || title;

  // Get cart functions from context
  const { addToCart } = useCart();

  // Function to handle adding product to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Stop event propagation to parent elements

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
    }
  };

  return (
    <div className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Product Information */}
      <div className="flex-grow">
        <Link
          href={`/products/${handle}`}
          className="block"
        >
          <div className="relative overflow-hidden bg-gray-100">
            <div className="relative aspect-square w-full">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105 p-2"
              />
            </div>

            {/* Price tag overlay */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
              <p className="text-sm font-semibold text-green-600">
                {formatPrice(price, currency)}
              </p>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-base font-medium text-gray-800 line-clamp-2 min-h-[3rem]">{title}</h3>

            <div className="mt-2 flex items-center text-sm text-gray-500">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span>En stock</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4 mt-auto">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full shadow-sm hover:shadow-md transition-all duration-300"
          size="default"
          type="button"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
}
