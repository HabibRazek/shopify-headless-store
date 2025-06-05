import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a price with the given currency
 * @param price - The price to format
 * @param currency - The currency code (e.g., 'USD', 'TND')
 * @returns Formatted price string
 */
export function formatPrice(price: string | number, currency: string = 'TND'): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Format the price based on the currency
  if (currency === 'TND') {
    // For Tunisian Dinar
    return `${numericPrice.toFixed(2)} TND`;
  } else {
    // For other currencies, use the Intl.NumberFormat
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(numericPrice);
  }
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
