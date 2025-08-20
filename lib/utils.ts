import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a price with Tunisian Dinar (TND)
 * @param price - The price to format (can be string, number, null, or undefined)
 * @param currency - The currency code (defaults to 'TND')
 * @returns Formatted price string
 */
export function formatPrice(price: string | number | null | undefined, currency: string = 'TND'): string {
  // Handle null, undefined, or invalid values
  if (price === null || price === undefined || price === '') {
    return '0.00 TND';
  }

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Check if the parsed number is valid
  if (isNaN(numericPrice)) {
    return '0.00 TND';
  }

  // Always format with TND (Tunisian Dinar) since that's what you use
  return `${numericPrice.toFixed(2)} TND`;
}

/**
 * Get the first image URL from a Shopify product
 * @param product - The Shopify product object
 * @returns The URL of the first image, or a placeholder if no image is found
 */
interface ShopifyProductImage {
  url: string;
  altText?: string | null;
}

interface ShopifyProduct {
  images?: {
    edges: Array<{
      node: ShopifyProductImage;
    }>;
  };
}

export function getProductImage(product: ShopifyProduct): string {
  // Check if the product has images
  if (product?.images?.edges && product.images.edges.length > 0) {
    const firstImage = product.images.edges[0]?.node;
    if (firstImage && firstImage.url) {
      return firstImage.url;
    }
  }

  // Return a placeholder image if no image is found
  return '/placeholder.png';
}
