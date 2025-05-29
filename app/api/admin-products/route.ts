import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Fetching all products from Shopify Admin API...');
    }

    // Get Shopify Admin API credentials from environment variables
    const shopifyAdminDomain = process.env.SHOPIFY_ADMIN_DOMAIN;
    const shopifyAdminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (process.env.NODE_ENV === 'development') {
      console.log('Using Shopify Admin domain:', shopifyAdminDomain);
      console.log('Using Admin access token:', shopifyAdminAccessToken ? 'Token exists' : 'Token missing');
    }

    if (!shopifyAdminDomain || !shopifyAdminAccessToken) {
      return NextResponse.json(
        { error: 'Shopify Admin API credentials are missing' },
        { status: 500 }
      );
    }

    // Fetch all products using the Shopify Admin API
    const url = `https://${shopifyAdminDomain}/admin/api/2024-07/products.json?limit=250`;
    
    const response = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': shopifyAdminAccessToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error response from Shopify Admin API:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      
      return NextResponse.json(
        { error: `Error fetching products: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`Found ${data.products?.length || 0} products in total`);

    // Get the collection filter from query parameters
    const searchParams = request.nextUrl.searchParams;
    const collectionFilter = searchParams.get('collection');
    
    let filteredProducts = data.products;
    
    // If a collection filter is specified, filter the products
    if (collectionFilter) {
      console.log(`Filtering products for collection: ${collectionFilter}`);
      
      // Filter products based on title, tags, or product type
      filteredProducts = data.products.filter((product: any) => {
        const title = product.title.toLowerCase();
        const tags = product.tags ? product.tags.toLowerCase() : '';
        const productType = product.product_type ? product.product_type.toLowerCase() : '';
        
        const searchTerms = [
          'fullviewkraft',
          'full view kraft',
          'full-view-kraft',
          'stand up',
          'stand-up',
          'fenêtre pleine',
          'fenetre pleine',
          'pochette stand up'
        ];
        
        return searchTerms.some(term => 
          title.includes(term.toLowerCase()) || 
          tags.includes(term.toLowerCase()) || 
          productType.includes(term.toLowerCase())
        );
      });
      
      console.log(`Found ${filteredProducts.length} products matching collection: ${collectionFilter}`);
    }

    // Format the response to match the structure expected by the client
    const formattedResponse = {
      collection: {
        title: collectionFilter || "All Products",
        products: {
          edges: filteredProducts.map((product: any) => ({
            node: {
              id: product.id,
              title: product.title,
              handle: product.handle,
              description: product.body_html,
              priceRange: {
                minVariantPrice: {
                  amount: product.variants[0]?.price || "0",
                  currencyCode: "TND"
                }
              },
              images: {
                edges: product.images.map((image: any) => ({
                  node: {
                    url: image.src,
                    altText: image.alt || product.title
                  }
                }))
              },
              variants: {
                edges: product.variants.map((variant: any) => ({
                  node: {
                    id: variant.id,
                    title: variant.title,
                    price: {
                      amount: variant.price,
                      currencyCode: "TND"
                    },
                    availableForSale: variant.inventory_quantity > 0
                  }
                }))
              },
              tags: product.tags ? product.tags.split(', ') : []
            }
          }))
        }
      }
    };

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error('Error in admin-products API:', error);
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    );
  }
}
