/**
 * Dynamic collection utility functions
 * No hardcoded data - everything is computed dynamically
 */

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  descriptionHtml?: string;
  image?: {
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  } | null;
  products?: Product[];
  productCount?: number;
  updatedAt?: string;
}

export interface ProductImage {
  id?: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  quantityAvailable?: number;
}

export interface PriceRange {
  minVariantPrice: {
    amount: string;
    currencyCode: string;
  };
  maxVariantPrice: {
    amount: string;
    currencyCode: string;
  };
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  priceRange?: PriceRange;
  compareAtPriceRange?: PriceRange;
  tags?: string[];
  availableForSale?: boolean;
  totalInventory?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Sanitizes and normalizes a collection handle
 */
export function normalizeHandle(handle: string): string {
  return handle
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Strips HTML tags from a string
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Formats a price for display
 */
export function formatPrice(amount: string | number, currencyCode: string = 'EUR'): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currencyCode,
  }).format(numericAmount);
}

/**
 * Checks if a product is on sale
 */
export function isProductOnSale(product: Product): boolean {
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount;
  const currentPrice = product.priceRange?.minVariantPrice?.amount;
  
  if (!compareAtPrice || !currentPrice) return false;
  
  return parseFloat(compareAtPrice) > parseFloat(currentPrice);
}

/**
 * Gets the primary image for a product or collection
 */
export function getPrimaryImage(item: Product | Collection): string | null {
  // For products
  if ('images' in item && item.images && item.images.length > 0) {
    return item.images[0]?.url || null;
  }
  
  // For collections
  if ('image' in item && item.image?.url) {
    return item.image.url;
  }
  
  return null;
}

/**
 * Calculates discount percentage
 */
export function getDiscountPercentage(originalPrice: string | number, salePrice: string | number): number {
  const original = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice;
  const sale = typeof salePrice === 'string' ? parseFloat(salePrice) : salePrice;
  
  if (original <= 0 || sale <= 0 || sale >= original) return 0;
  
  return Math.round(((original - sale) / original) * 100);
}

/**
 * Sorts collections by various criteria
 */
export function sortCollections(collections: Collection[], sortBy: string): Collection[] {
  const sorted = [...collections];
  
  switch (sortBy) {
    case 'name':
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    
    case 'products':
    case 'productCount':
      return sorted.sort((a, b) => (b.productCount || 0) - (a.productCount || 0));
    
    case 'recent':
    case 'updatedAt':
      return sorted.sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });
    
    default:
      return sorted;
  }
}

/**
 * Filters collections by search term
 */
export function filterCollections(collections: Collection[], searchTerm: string): Collection[] {
  if (!searchTerm.trim()) return collections;
  
  const term = searchTerm.toLowerCase();
  
  return collections.filter(collection => 
    collection.title.toLowerCase().includes(term) ||
    collection.description?.toLowerCase().includes(term) ||
    collection.handle.toLowerCase().includes(term)
  );
}

/**
 * Sorts products by various criteria
 */
export function sortProducts(products: Product[], sortBy: string, reverse: boolean = false): Product[] {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'TITLE':
    case 'title':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    
    case 'PRICE':
    case 'price':
      sorted.sort((a, b) => {
        const priceA = parseFloat(a.priceRange?.minVariantPrice?.amount || '0');
        const priceB = parseFloat(b.priceRange?.minVariantPrice?.amount || '0');
        return priceA - priceB;
      });
      break;
    
    case 'CREATED_AT':
    case 'created':
      sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
      break;
    
    case 'BEST_SELLING':
    case 'bestselling':
    default:
      // Keep original order for best selling (as provided by Shopify)
      break;
  }
  
  return reverse ? sorted.reverse() : sorted;
}

/**
 * Filters products by search term
 */
export function filterProducts(products: Product[], searchTerm: string): Product[] {
  if (!searchTerm.trim()) return products;
  
  const term = searchTerm.toLowerCase();
  
  return products.filter(product => 
    product.title.toLowerCase().includes(term) ||
    product.description?.toLowerCase().includes(term) ||
    product.tags?.some(tag => tag.toLowerCase().includes(term))
  );
}

/**
 * Gets available sort options for collections
 */
export function getCollectionSortOptions() {
  return [
    { value: 'products', label: 'Plus de produits' },
    { value: 'name', label: 'Nom A-Z' },
    { value: 'recent', label: 'Plus récent' },
  ];
}

/**
 * Gets available sort options for products
 */
export function getProductSortOptions() {
  return [
    { value: 'BEST_SELLING', label: 'Meilleures ventes' },
    { value: 'TITLE', label: 'Nom A-Z' },
    { value: 'PRICE', label: 'Prix croissant' },
    { value: 'CREATED_AT', label: 'Plus récent' },
  ];
}

/**
 * Validates if a collection has required fields
 */
export function isValidCollection(collection: unknown): collection is Collection {
  return collection !== null &&
         typeof collection === 'object' &&
         collection !== undefined &&
         typeof (collection as any).id === 'string' &&
         typeof (collection as any).title === 'string' &&
         typeof (collection as any).handle === 'string';
}

/**
 * Validates if a product has required fields
 */
export function isValidProduct(product: unknown): product is Product {
  return product !== null &&
         typeof product === 'object' &&
         product !== undefined &&
         typeof (product as any).id === 'string' &&
         typeof (product as any).title === 'string' &&
         typeof (product as any).handle === 'string';
}
