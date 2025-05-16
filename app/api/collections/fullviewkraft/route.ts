import { NextRequest, NextResponse } from 'next/server';
import { storefrontClient } from '@/lib/shopify';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching FullViewKraft products directly from Shopify...');

    // Use the Shopify GraphQL API to query for the FullViewKraft collection by ID
    const query = `
      {
        collection(id: "gid://shopify/Collection/459735638336") {
          id
          title
          handle
          products(first: 50) {
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

    // Execute the GraphQL query
    const { data, errors } = await storefrontClient.request(query);

    console.log('GraphQL response received');

    if (errors) {
      console.error('GraphQL errors:', errors);
      return NextResponse.json(
        { error: 'Error fetching FullViewKraft products' },
        { status: 500 }
      );
    }

    // Check if we got a collection back
    if (data.collection) {
      console.log(`Found collection: ${data.collection.title}`);
      console.log(`Number of products: ${data.collection.products.edges.length}`);

      // Return the collection data
      return NextResponse.json({
        collection: data.collection
      });
    }

    // If we got here, no collection was found
    console.log('No collection found for FullViewKraft');
    return NextResponse.json({
      collection: {
        title: "FullViewKraft",
        products: {
          edges: []
        }
      }
    });
  } catch (error) {
    console.error('Error in FullViewKraft API:', error);
    return NextResponse.json(
      { error: 'Error fetching FullViewKraft products' },
      { status: 500 }
    );
  }
}
