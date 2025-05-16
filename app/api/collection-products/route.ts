import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';

// GraphQL query to get products by collection ID or handle
const QUERY_COLLECTION_PRODUCTS = `
  query GetCollectionProducts($id: ID, $handle: String, $first: Int!) {
    collection(id: $id, handle: $handle) {
      id
      title
      handle
      description
      products(first: $first) {
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
            images(first: 10) {
              edges {
                node {
                  url
                  altText
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
                  availableForSale
                }
              }
            }
            tags
          }
        }
      }
    }
  }
`;

// Collection IDs mapping
const COLLECTION_IDS: Record<string, string> = {
  'kraftview': '459735605568',
  'whiteview': '459735638336',
  'kraftalu': '459735671104',
  'fullviewkraft': '459735703872',
  'blackview': '459735736640'
};

export async function GET(request: NextRequest) {
  try {
    // Get the collection handle or ID from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const handle = searchParams.get('handle');
    let id = searchParams.get('id');

    // If handle is provided but no ID, try to get the ID from the mapping
    if (handle && !id && COLLECTION_IDS[handle]) {
      id = COLLECTION_IDS[handle];
    }

    if (!handle && !id) {
      return NextResponse.json(
        { error: 'Collection handle or ID is required' },
        { status: 400 }
      );
    }

    console.log(`Fetching products for collection ${handle || id}...`);

    // Prepare variables for the GraphQL query
    const variables: Record<string, any> = { first: 50 };
    if (id) {
      variables.id = `gid://shopify/Collection/${id}`;
    } else if (handle) {
      variables.handle = handle;
    }

    // Fetch products from Shopify
    const { status, body } = await shopifyFetch({
      query: QUERY_COLLECTION_PRODUCTS,
      variables,
    });

    console.log('API response status:', status);

    if (status === 200 && body.data?.collection) {
      console.log(`Found collection: ${body.data.collection.title}`);
      console.log(`Number of products: ${body.data.collection.products.edges.length}`);

      return NextResponse.json({
        collection: body.data.collection
      });
    } else {
      console.error('Error or empty response:', body);
      return NextResponse.json(
        { error: 'Collection not found or empty' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error in collection-products API:', error);
    return NextResponse.json(
      { error: 'Error fetching collection products' },
      { status: 500 }
    );
  }
}
