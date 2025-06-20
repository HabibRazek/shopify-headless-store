import { NextRequest } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import {
  parseQueryParams,
  validatePaginationParams,
  validateSortParams,
  handleApiOperation
} from '@/lib/utils/api';
import {
  normalizeHandle,
  sortProducts,
  filterProducts,
  isValidCollection,
  isValidProduct,
  formatPrice,
  isProductOnSale,
  getPrimaryImage
} from '@/lib/utils/collection';

// TypeScript interfaces for Shopify API responses
interface ShopifyCollectionResponse {
  collection: {
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
    };
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
    updatedAt: string;
  };
}

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description?: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
        width?: number;
        height?: number;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
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
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  tags: string[];
  availableForSale: boolean;
  totalInventory?: number;
  createdAt: string;
  updatedAt: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  return handleApiOperation(async () => {
    const { handle: rawHandle } = await params;
    const { searchParams } = new URL(request.url);
    const queryParams = parseQueryParams(searchParams);

    // Validate parameters
    const { limit } = validatePaginationParams(queryParams);
    const { sortBy, reverse } = validateSortParams(queryParams);

    // Clean and normalize the handle
    let handle = decodeURIComponent(rawHandle);
    if (handle.includes('%')) {
      handle = decodeURIComponent(handle);
    }

    // Try the original handle first, then try normalized versions
    const originalHandle = handle;
    const cleanHandle = handle.replace('™', '').trim();
    const normalizedHandle = normalizeHandle(cleanHandle);



    const productsLimit = Math.min(100, limit || 50);
    const sortKey = sortBy || 'BEST_SELLING';
    const search = typeof queryParams.search === 'string' ? queryParams.search : '';

    // Enhanced query for collection with sorting
    const query = `
      query GetCollectionByHandle($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys!, $reverse: Boolean!) {
        collection(handle: $handle) {
          id
          title
          handle
          description
          descriptionHtml
          image {
            url
            altText
            width
            height
          }
          products(first: $first, sortKey: $sortKey, reverse: $reverse) {
            edges {
              node {
                id
                title
                handle
                description
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                  maxVariantPrice {
                    amount
                    currencyCode
                  }
                }
                compareAtPriceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 5) {
                  edges {
                    node {
                      url
                      altText
                      width
                      height
                    }
                  }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      availableForSale
                      selectedOptions {
                        name
                        value
                      }
                    }
                  }
                }
                tags
                availableForSale
                totalInventory
                createdAt
                updatedAt
              }
            }
          }
          updatedAt
        }
      }
    `;

    // Try different handle variants until we find the collection
    const handleVariants = [originalHandle, cleanHandle, normalizedHandle];
    let collection = null;
    for (const handleVariant of handleVariants) {
      const { status, body } = await shopifyFetch({
        query,
        variables: { handle: handleVariant, first: productsLimit, sortKey, reverse: reverse || false },
      });

      if (status === 200 && (body as ShopifyCollectionResponse)?.collection) {
        collection = (body as ShopifyCollectionResponse).collection;
        break;
      }
    }

    if (!collection || !isValidCollection(collection)) {
      throw new Error(`Collection not found with any handle variant: ${handleVariants.join(', ')}`);
    }

    // Transform and validate products
    let products = collection.products?.edges?.map((edge) => {
      const product = edge.node;

      if (!isValidProduct(product)) {
        return null;
      }

      return {
        ...product,
        images: product.images?.edges?.map((imgEdge) => imgEdge.node) || [],
        variants: product.variants?.edges?.map((varEdge) => varEdge.node) || [],
        onSale: isProductOnSale(product),
        primaryImage: getPrimaryImage(product),
        formattedPrice: formatPrice(
          product.priceRange?.minVariantPrice?.amount || '0',
          product.priceRange?.minVariantPrice?.currencyCode || 'EUR'
        ),
        formattedCompareAtPrice: product.compareAtPriceRange?.minVariantPrice?.amount
          ? formatPrice(
              product.compareAtPriceRange.minVariantPrice.amount,
              product.compareAtPriceRange.minVariantPrice.currencyCode || 'EUR'
            )
          : null
      };
    }).filter((product): product is NonNullable<typeof product> => product !== null) || [];

    // Apply search filter if provided
    if (search) {
      products = filterProducts(products as any, search) as any;
    }

    // Apply additional sorting if needed (client-side refinement)
    if (sortBy && sortBy !== sortKey) {
      products = sortProducts(products as any, sortBy, reverse) as any;
    }

    const transformedCollection = {
      ...collection,
      productCount: products.length,
      products,
      pagination: {
        limit: productsLimit,
        hasMore: products.length === productsLimit
      },
      filters: {
        search,
        sortBy: sortKey,
        reverse
      }
    };

    return transformedCollection;
  }, `Failed to fetch collection`);
}
