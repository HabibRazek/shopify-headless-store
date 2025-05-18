import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';

// GraphQL query to get all products
const QUERY_ALL_PRODUCTS = `
  query GetAllProducts($first: Int = 100) {
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
`;

export async function GET(request, { params }) {
  try {
    // Get the collection name from the URL
    const collection = params.collection;

    // Map simplified handles to search terms (case insensitive)
    const collectionToSearchMap: Record<string, string[]> = {
      'kraftview': ['kraftview', 'kraft view', 'kraft-view', 'kraft brun', 'kraft-brun'],
      'whiteview': ['whiteview', 'white view', 'white-view', 'kraft blanc', 'kraft-blanc'],
      'kraftalu': ['kraftalu', 'kraft alu', 'kraft-alu', 'aluminium', 'aluminum'],
      'test': ['test']
    };

    // Get the search terms for this collection
    const searchTerms = collectionToSearchMap[collection.toLowerCase()] || [collection];
    console.log('Searching for products with collection terms:', searchTerms);

    // Fetch all products
    const { status, body } = await shopifyFetch({
      query: QUERY_ALL_PRODUCTS,
      variables: { first: 100 },
    });

    if (status === 200 && (body as any).data?.products?.edges) {
      // Filter products that match the collection search terms
      const allProducts = (body as any).data.products.edges;
      console.log(`Found ${allProducts.length} total products`);

      const filteredProducts = allProducts.filter((product: any) => {
        const productTitle = product.node.title.toLowerCase();

        // Check if product title contains any of the search terms
        return searchTerms.some(term =>
          productTitle.includes(term.toLowerCase())
        );
      });

      console.log(`Found ${filteredProducts.length} products matching collection "${collection}"`);

      // Get collection title in proper format
      const collectionTitle = collection.charAt(0).toUpperCase() + collection.slice(1);

      // Format the response to match our expected structure
      const formattedData = {
        data: {
          collection: {
            id: `collection-${collection}`,
            title: collectionTitle,
            handle: collection,
            description: `Products in the ${collectionTitle} collection`,
            products: {
              edges: filteredProducts
            }
          }
        }
      };

      return NextResponse.json(formattedData);
    } else {
      return NextResponse.json(
        { error: 'Error fetching products' },
        { status }
      );
    }
  } catch (error) {
    console.error('Products by Collection API Error:', error);
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    );
  }
}
