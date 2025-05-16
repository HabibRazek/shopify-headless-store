import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';

// GraphQL query to get all products
const QUERY_ALL_PRODUCTS = `
  query GetAllProducts($first: Int!) {
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
          collections(first: 5) {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching FullViewKraft products...');

    // Fetch all products from Shopify
    const { status, body } = await shopifyFetch({
      query: QUERY_ALL_PRODUCTS,
      variables: { first: 100 }, // Fetch up to 100 products
    });

    console.log('API response status:', status);

    if (status === 200 && body.products?.edges) {
      // Filter products that belong to the FullViewKraft collection
      // We'll check product collections, tags, and title
      const fullViewKraftProducts = body.products.edges.filter((edge: any) => {
        const product = edge.node;

        // Check if product belongs to FullViewKraft collection
        const belongsToFullViewKraft = product.collections?.edges.some((collectionEdge: any) => {
          const collectionHandle = collectionEdge.node.handle.toLowerCase();
          return (
            collectionHandle === 'fullviewkraft' ||
            collectionHandle.includes('full-view') ||
            collectionHandle.includes('stand-up')
          );
        });

        // Check product title for FullViewKraft keywords
        const titleHasFullViewKraft =
          product.title.toLowerCase().includes('fullviewkraft') ||
          product.title.toLowerCase().includes('full view') ||
          product.title.toLowerCase().includes('stand up') ||
          product.title.toLowerCase().includes('fenêtre pleine') ||
          product.title.toLowerCase().includes('fenetre pleine');

        // Check product tags for FullViewKraft keywords
        const tagsHaveFullViewKraft = product.tags?.some((tag: string) =>
          tag.toLowerCase().includes('fullviewkraft') ||
          tag.toLowerCase().includes('full view') ||
          tag.toLowerCase().includes('stand up')
        );

        return belongsToFullViewKraft || titleHasFullViewKraft || tagsHaveFullViewKraft;
      });

      console.log(`Found ${fullViewKraftProducts.length} FullViewKraft products`);

      // Create a response that mimics the collection response structure
      const response = {
        collection: {
          title: "FullViewKraft",
          products: {
            edges: fullViewKraftProducts
          }
        }
      };

      return NextResponse.json(response);
    } else {
      console.error('Error in API response:', body);
      return NextResponse.json(
        { error: 'Error fetching FullViewKraft products' },
        { status }
      );
    }
  } catch (error) {
    console.error('Error in fullviewkraft-products API:', error);
    return NextResponse.json(
      { error: 'Error fetching FullViewKraft products' },
      { status: 500 }
    );
  }
}
