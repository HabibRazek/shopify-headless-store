import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/shopify/products - Fetch products from Shopify
export async function GET(request: NextRequest) {
  try {
    // Check if Shopify credentials are configured
    const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_ADMIN_DOMAIN;
    const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!storeDomain || !accessToken) {
      console.error('Shopify credentials not configured');
      console.error('Store domain:', storeDomain);
      console.error('Access token available:', !!accessToken);
      return NextResponse.json(
        {
          error: 'Shopify not configured',
          products: { edges: [] }
        },
        { status: 200 } // Return 200 with empty products instead of error
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const cursor = searchParams.get('cursor');

    // Determine which GraphQL query to use based on token type
    const isAdminToken = accessToken.startsWith('shpat_');

    const query = isAdminToken ? `
      query getProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            node {
              id
              title
              handle
              description
              productType
              vendor
              tags
              createdAt
              updatedAt
              images(first: 5) {
                edges {
                  node {
                    id
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
                    price
                    compareAtPrice
                    sku
                    inventoryQuantity
                    inventoryPolicy
                    inventoryManagement
                  }
                }
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    ` : `
      query getProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            node {
              id
              title
              handle
              description
              productType
              vendor
              tags
              createdAt
              updatedAt
              images(first: 5) {
                edges {
                  node {
                    id
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
                    price
                    compareAtPrice
                    sku
                    availableForSale
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    `;

    const variables = {
      first: parseInt(limit),
      ...(cursor && { after: cursor })
    };

    console.log('Fetching products from Shopify...');
    console.log('Store domain:', storeDomain);
    console.log('Using access token type:', accessToken.startsWith('shpat_') ? 'Admin API' : 'Storefront API');

    // Determine API endpoint and headers based on token type
    const isAdminToken = accessToken.startsWith('shpat_');
    const apiEndpoint = isAdminToken
      ? `https://${storeDomain}/admin/api/2024-10/graphql.json`
      : `https://${storeDomain}/api/2023-10/graphql.json`;

    const headers = isAdminToken
      ? {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        }
      : {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': accessToken,
        };

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      console.error('Shopify API response not ok:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Shopify API error response:', errorText);
      
      return NextResponse.json(
        { 
          error: `Shopify API error: ${response.status}`,
          products: { edges: [] }
        },
        { status: 200 } // Return 200 with empty products
      );
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('Shopify GraphQL errors:', data.errors);
      return NextResponse.json(
        { 
          error: 'Shopify GraphQL errors',
          details: data.errors,
          products: { edges: [] }
        },
        { status: 200 } // Return 200 with empty products
      );
    }

    console.log(`Successfully fetched ${data.data.products.edges.length} products from Shopify`);
    
    return NextResponse.json({
      success: true,
      products: data.data.products,
      pageInfo: data.data.products.pageInfo,
    });

  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error',
        products: { edges: [] }
      },
      { status: 200 } // Return 200 with empty products to prevent UI errors
    );
  }
}
