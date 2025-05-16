'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { ShopifyProduct } from '@/types/shopify';
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
      console.error('Error adding product to cart:', error);
      toast.error('Error', {
        description: 'There was an error adding the product to your cart. Please try again.',
        position: 'top-right',
        duration: 5000,
      });
    }
  };

  return (
    <div className="group flex flex-col h-full">
      {/* Product Information */}
      <div className="flex-grow">
        <Link
          href={`/products/${handle}`}
          className="block"
        >
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
            <div className="relative h-64 w-full">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="h-full w-full object-cover object-center group-hover:opacity-75"
              />
            </div>
          </div>
          <h3 className="mt-4 text-sm text-gray-700">{title}</h3>
          <p className="mt-1 text-lg font-medium text-gray-900">
            {formatPrice(price, currency)}
          </p>
        </Link>
      </div>

      {/* Add to Cart Button - Completely separate from the Link */}
      <div className="mt-3">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-black hover:bg-gray-800 text-white"
          size="sm"
          type="button"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
