/**
 * Utility functions for handling collection data
 */

// Define the collection types
export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
  products: {
    edges: {
      node: any;
    }[];
  };
}

/**
 * Maps a Shopify collection handle to a simplified handle
 * @param collectionTitle The collection title from Shopify
 * @returns The simplified handle
 */
export function getSimplifiedHandle(collectionTitle: string): string {
  if (collectionTitle.includes('KraftView')) return 'kraftview';
  if (collectionTitle.includes('WhiteView')) return 'whiteview';
  if (collectionTitle.includes('KraftAlu')) return 'kraftalu';
  if (collectionTitle.includes('FullViewKraft') || collectionTitle.includes('Full View Kraft')) return 'fullviewkraft';
  if (collectionTitle.includes('BlackView')) return 'blackview';
  if (collectionTitle.includes('FullAlu')) return 'fullalu';
  if (collectionTitle.includes('Test')) return 'test';
  
  // Default: convert to lowercase and remove special characters
  return collectionTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Gets the brand name for a collection
 * @param collectionHandle The simplified collection handle
 * @returns The brand name
 */
export function getBrandName(collectionHandle: string): string {
  switch (collectionHandle) {
    case 'kraftview':
      return 'KraftView™';
    case 'whiteview':
      return 'WhiteView™';
    case 'kraftalu':
      return 'KraftAlu™';
    case 'fullviewkraft':
      return 'FullViewKraft™';
    case 'blackview':
      return 'BlackView™';
    case 'fullalu':
      return 'FullAlu™';
    default:
      return collectionHandle;
  }
}

/**
 * Gets a collection image from various sources
 * @param collection The Shopify collection object
 * @param simplifiedHandle The simplified collection handle
 * @returns The image URL
 */
export function getCollectionImage(collection: ShopifyCollection, simplifiedHandle: string): string {
  // First try to get the image from the Shopify collection
  if (collection.image && collection.image.url) {
    return collection.image.url;
  }
  
  // If no image is available from Shopify, use a product image from the collection
  if (collection.products && collection.products.edges && collection.products.edges.length > 0) {
    const firstProduct = collection.products.edges[0].node;
    if (firstProduct.images && firstProduct.images.edges && firstProduct.images.edges.length > 0) {
      return firstProduct.images.edges[0].node.url;
    }
  }
  
  // If no product images are available, use a generic placeholder based on collection type
  const placeholderImages: Record<string, string> = {
    'kraftview': 'https://placehold.co/800x600/e9d8c2/333333?text=KraftView',
    'whiteview': 'https://placehold.co/800x600/f5f5f5/333333?text=WhiteView',
    'kraftalu': 'https://placehold.co/800x600/e0c9a6/333333?text=KraftAlu',
    'fullviewkraft': 'https://placehold.co/800x600/f0e6d2/333333?text=FullViewKraft',
    'blackview': 'https://placehold.co/800x600/333333/ffffff?text=BlackView',
    'fullalu': 'https://placehold.co/800x600/c0c0c0/333333?text=FullAlu'
  };
  
  if (placeholderImages[simplifiedHandle]) {
    return placeholderImages[simplifiedHandle];
  }
  
  // Final fallback
  return 'https://placehold.co/800x600/eeeeee/333333?text=Collection';
}

/**
 * Gets the collection metadata
 * @param handle The simplified collection handle
 * @returns The collection metadata
 */
export function getCollectionMetadata(handle: string): { title: string, description: string } {
  const collectionMapping: Record<string, { title: string, description: string }> = {
    'kraftview': {
      title: 'KraftView™ – Pochettes Zip Kraft Brun avec Fenêtre',
      description: 'Pochettes zippées en kraft brun avec fenêtre transparente, idéales pour les produits alimentaires et non alimentaires.'
    },
    'whiteview': {
      title: 'WhiteView™ – Pochettes Zip Kraft blanc avec Fenêtre mate',
      description: 'Pochettes zippées en kraft blanc avec fenêtre mate, parfaites pour un look premium et élégant.'
    },
    'kraftalu': {
      title: 'KraftAlu™ – Pochettes Zip Kraft avec intérieur Aluminium',
      description: 'Pochettes zippées en kraft avec intérieur aluminium, parfaites pour la conservation des aliments.'
    },
    'fullviewkraft': {
      title: 'FullViewKraft™ – Pochettes Stand Up Kraft avec fenêtre pleine',
      description: 'Pochettes Stand Up en kraft avec fenêtre pleine, parfaites pour présenter vos produits avec style.'
    },
    'blackview': {
      title: 'BlackView™ – Pochettes Zip Noir avec Fenêtre Transparente',
      description: 'Pochettes zippées en noir avec fenêtre transparente, parfaites pour un look élégant et moderne.'
    },
    'fullalu': {
      title: 'FullAlu™ – Pochettes Zip en Aluminium',
      description: 'Pochettes zippées entièrement en aluminium, offrant une barrière optimale contre l\'humidité, l\'oxygène et la lumière pour une conservation parfaite.'
    }
  };

  return collectionMapping[handle] || {
    title: handle.charAt(0).toUpperCase() + handle.slice(1),
    description: ''
  };
}

/**
 * Strips HTML tags from a string
 * @param html The HTML string
 * @returns The plain text
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Gets the fixed product count for a collection
 * @param handle The simplified collection handle
 * @returns The fixed product count
 */
export function getFixedProductCount(handle: string): number | undefined {
  const fixedProductCounts: Record<string, number> = {
    'blackview': 6,
    'fullviewkraft': 4,
    'kraftview': 6,
    'whiteview': 4,
    'kraftalu': 5,
    'fullalu': 1
  };
  
  return fixedProductCounts[handle];
}
