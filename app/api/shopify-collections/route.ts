import { NextResponse } from 'next/server';
import { shopifyFetch, storefrontClient } from '@/lib/shopify';

// GraphQL query to get all collections with their products
const QUERY_ALL_COLLECTIONS_WITH_PRODUCTS = `
  query GetAllCollectionsWithProducts($first: Int = 20) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
          products(first: 10) {
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
                }
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Simpler query to test the connection
const SIMPLE_QUERY = `
  query {
    shop {
      name
      primaryDomain {
        url
        host
      }
    }
  }
`;

export async function GET() {
  try {
    console.log('Fetching collections from Shopify...');
    console.log('Using Shopify domain:', process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
    console.log('Using access token:', process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ? 'Token exists' : 'Token missing');

    // First, try a simple query to test the connection
    try {
      console.log('Testing Shopify connection with simple query...');
      const simpleResponse = await storefrontClient.request(SIMPLE_QUERY);
      console.log('Simple query response:', JSON.stringify(simpleResponse));
    } catch (simpleError) {
      console.error('Simple query error:', simpleError);
    }

    // Now try the collections query
    const { status, body } = await shopifyFetch({
      query: QUERY_ALL_COLLECTIONS_WITH_PRODUCTS,
      variables: { first: 20 },
    });

    console.log('Shopify API response status:', status);
    console.log('Shopify API response body:', JSON.stringify(body));

    if (status === 200) {
      if ((body as any).data?.collections?.edges) {
        const collections = (body as any).data.collections.edges;
        console.log(`Found ${collections.length} collections`);

        // Log each collection
        collections.forEach((collection: any) => {
          const { title, handle } = collection.node;
          console.log(`Collection: ${title}, Handle: ${handle}`);
        });
      } else {
        console.log('No collections found in response');
      }

      return NextResponse.json(body);
    } else {
      console.log('Error fetching collections:', body);
      return NextResponse.json(
        { error: 'Error fetching collections', details: body },
        { status }
      );
    }
  } catch (error) {
    console.error('Collections API Error:', error);
    return NextResponse.json(
      { error: 'Error fetching collections', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
