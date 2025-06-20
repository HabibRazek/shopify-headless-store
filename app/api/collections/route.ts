import { NextRequest } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { QUERY_ALL_COLLECTIONS, QUERY_ALL_COLLECTIONS_WITH_PRODUCTS } from '@/lib/queries';
import {
  parseQueryParams,
  validatePaginationParams,
  validateSortParams,
  validateFilterParams,
  handleApiOperation
} from '@/lib/utils/api';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// TypeScript interfaces for Shopify API responses
interface ShopifyImage {
  url: string;
  altText?: string;
}

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
}

interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: ShopifyImage;
  products?: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

interface ShopifyCollectionsResponse {
  collections: {
    edges: Array<{
      node: ShopifyCollection;
    }>;
  };
}
import {
  sortCollections,
  filterCollections,
  isValidCollection,
  getPrimaryImage
} from '@/lib/utils/collection';

export async function GET(request: NextRequest) {
  return handleApiOperation(async () => {
    const { searchParams } = new URL(request.url);
    const params = parseQueryParams(searchParams);

    // Validate and extract parameters
    const { limit } = validatePaginationParams(params);
    const { sortBy } = validateSortParams(params);
    const { search } = validateFilterParams(params);

    const includeProducts = params.includeProducts === true;
    const productsLimit = Math.min(100, Math.max(1, typeof params.productsLimit === 'number' ? params.productsLimit : 50));
    const collectionsLimit = Math.min(50, limit || 20);

    // Choose query based on whether products should be included
    const query = includeProducts ? QUERY_ALL_COLLECTIONS_WITH_PRODUCTS : QUERY_ALL_COLLECTIONS;
    const variables = includeProducts
      ? { first: collectionsLimit, productsFirst: productsLimit }
      : { first: collectionsLimit };

    const { status, body } = await shopifyFetch({ query, variables });

    if (status !== 200) {
      throw new Error(`Shopify API error: ${JSON.stringify(body)}`);
    }

    // Transform and validate collections
    const shopifyResponse = body as ShopifyCollectionsResponse;
    let collections = shopifyResponse.collections?.edges?.map((edge) => {
      const collection = edge.node;

      if (!isValidCollection(collection)) {
        return null;
      }

      // Calculate product count
      const productCount = collection.products?.edges?.length || 0;

      // Get primary image with fallback
      const primaryImage = getPrimaryImage(collection) ||
        collection.products?.edges?.[0]?.node?.images?.edges?.[0]?.node?.url;

      return {
        ...collection,
        productCount,
        image: collection.image || (primaryImage ? { url: primaryImage } : null),
        products: includeProducts
          ? collection.products?.edges?.map((productEdge) => productEdge.node) || []
          : undefined
      };
    }).filter((collection): collection is NonNullable<typeof collection> => collection !== null) || [];

    // Apply search filter if provided
    if (search) {
      collections = filterCollections(collections as any, search) as any;
    }

    // Apply sorting
    if (sortBy) {
      collections = sortCollections(collections as any, sortBy) as any;
    } else {
      // Default sort: by product count (most products first), then by title
      collections = sortCollections(collections as any, 'products') as any;
    }

    return {
      collections,
      total: collections.length,
      pagination: {
        limit: collectionsLimit,
        hasMore: collections.length === collectionsLimit
      },
      filters: {
        includeProducts,
        search,
        sortBy: sortBy || 'products'
      }
    };
  }, 'Failed to fetch collections');
}
