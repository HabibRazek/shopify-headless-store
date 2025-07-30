import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a price with the given currency (no dollar signs)
 * @param price - The price to format
 * @param currency - The currency code (e.g., 'TND', 'EUR')
 * @returns Formatted price string
 */
export function formatPrice(price: string | number, currency: string = 'TND'): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Always format without dollar signs and use TND as default
  if (currency === 'TND') {
    // For Tunisian Dinar
    return `${numericPrice.toFixed(2)} TND`;
  } else if (currency === 'EUR') {
    // For Euro
    return `${numericPrice.toFixed(2)} €`;
  } else {
    // For any other currency, just show the amount with currency code
    return `${numericPrice.toFixed(2)} ${currency}`;
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
