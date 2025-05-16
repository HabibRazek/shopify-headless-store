import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';

// GraphQL query to get a collection by handle with its products
const QUERY_COLLECTION_BY_HANDLE_WITH_PRODUCTS = `
  query GetCollectionByHandleWithProducts($handle: String!, $first: Int = 50) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
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
            images(first: 5) {
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
`;

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const { handle } = params;
    
    // Decode the handle if it's URL encoded
    let decodedHandle = decodeURIComponent(handle);
    if (decodedHandle.includes('%')) {
      decodedHandle = decodeURIComponent(decodedHandle);
    }
    
    // Clean up the handle - remove trademark symbols and other special characters
    decodedHandle = decodedHandle.replace('™', '').trim();
    
    const { status, body } = await shopifyFetch({
      query: QUERY_COLLECTION_BY_HANDLE_WITH_PRODUCTS,
      variables: { handle: decodedHandle, first: 50 },
    });

    if (status === 200) {
      if (body.data && body.data.collection) {
        return NextResponse.json(body);
      } else {
        return NextResponse.json(
          { error: 'Collection not found' },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Error fetching collection' },
        { status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching collection' },
      { status: 500 }
    );
  }
}
