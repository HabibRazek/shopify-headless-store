import { NextRequest } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { QUERY_ALL_COLLECTIONS, QUERY_ALL_COLLECTIONS_WITH_PRODUCTS } from '@/lib/queries';
import {
  createSuccessResponse,
  createErrorResponse,
  parseQueryParams,
  validatePaginationParams,
  validateSortParams,
  validateFilterParams,
  handleApiOperation
} from '@/lib/utils/api';
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
    let collections = (body as any).collections?.edges?.map((edge: any) => {
      const collection = edge.node;

      if (!isValidCollection(collection)) {
        return null;
      }

      // Calculate product count
      const productCount = (collection as any).products?.edges?.length || 0;

      // Get primary image with fallback
      const primaryImage = getPrimaryImage(collection) ||
        (collection as any).products?.edges?.[0]?.node?.images?.edges?.[0]?.node?.url;

      return {
        ...collection,
        productCount,
        image: collection.image || (primaryImage ? { url: primaryImage } : null),
        products: includeProducts
          ? (collection as any).products?.edges?.map((productEdge: any) => productEdge.node) || []
          : undefined
      };
    }).filter(Boolean) || [];

    // Apply search filter if provided
    if (search) {
      collections = filterCollections(collections, search);
    }

    // Apply sorting
    if (sortBy) {
      collections = sortCollections(collections, sortBy);
    } else {
      // Default sort: by product count (most products first), then by title
      collections = sortCollections(collections, 'products');
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
