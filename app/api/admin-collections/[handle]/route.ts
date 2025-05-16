import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    // In Next.js 14+, params needs to be awaited
    const handle = params.handle;
    console.log('Fetching collection with handle using Admin API:', handle);

    // Map simplified handles to actual collection titles for searching
    const handleToTitleMap: Record<string, string> = {
      'kraftview': 'KraftView',
      'whiteview': 'WhiteView',
      'kraftalu': 'KraftAlu',
      'test': 'Test'
    };

    const searchTitle = handleToTitleMap[handle] || handle;
    console.log('Searching for collection with title containing:', searchTitle);

    const shopifyDomain = process.env.SHOPIFY_ADMIN_DOMAIN;
    const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION || '2024-07';

    console.log('Using Shopify Admin domain:', shopifyDomain);
    console.log('Using Admin access token:', accessToken ? 'Token exists' : 'Token missing');

    if (!shopifyDomain || !accessToken) {
      return NextResponse.json({
        error: 'Missing Shopify Admin credentials'
      }, { status: 500 });
    }

    // Step 1: Get all collections and filter by title
    const customUrl = `https://${shopifyDomain}/admin/api/${apiVersion}/custom_collections.json`;
    const smartUrl = `https://${shopifyDomain}/admin/api/${apiVersion}/smart_collections.json`;

    // Try custom collections first
    const customResponse = await fetch(customUrl, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    // Then try smart collections
    const smartResponse = await fetch(smartUrl, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    let collection = null;

    // Check custom collections
    if (customResponse.ok) {
      const customData = await customResponse.json();
      console.log(`Found ${customData.custom_collections?.length || 0} custom collections`);

      if (customData.custom_collections && customData.custom_collections.length > 0) {
        // Find collection by title match
        const matchingCollection = customData.custom_collections.find((coll: any) =>
          coll.title.toLowerCase().includes(searchTitle.toLowerCase())
        );

        if (matchingCollection) {
          collection = matchingCollection;
          console.log('Found matching custom collection:', collection.title);
        }
      }
    } else {
      console.log('Error fetching custom collections:', await customResponse.text());
    }

    // If not found in custom collections, check smart collections
    if (!collection && smartResponse.ok) {
      const smartData = await smartResponse.json();
      console.log(`Found ${smartData.smart_collections?.length || 0} smart collections`);

      if (smartData.smart_collections && smartData.smart_collections.length > 0) {
        // Find collection by title match
        const matchingCollection = smartData.smart_collections.find((coll: any) =>
          coll.title.toLowerCase().includes(searchTitle.toLowerCase())
        );

        if (matchingCollection) {
          collection = matchingCollection;
          console.log('Found matching smart collection:', collection.title);
        }
      }
    } else if (!collection) {
      console.log('Error fetching smart collections:', await smartResponse.text());
    }

    // If collection not found in either type
    if (!collection) {
      return NextResponse.json({
        error: 'Collection not found'
      }, { status: 404 });
    }

    // Step 2: Get the products for this collection
    const productsUrl = `https://${shopifyDomain}/admin/api/${apiVersion}/products.json?collection_id=${collection.id}`;

    const productsResponse = await fetch(productsUrl, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (!productsResponse.ok) {
      const errorText = await productsResponse.text();
      console.log('Shopify Admin API error (products):', errorText);
      return NextResponse.json({
        error: 'Error fetching products from Shopify Admin API',
        details: errorText
      }, { status: productsResponse.status });
    }

    const productsData = await productsResponse.json();
    console.log(`Found ${productsData.products.length} products for collection ${collection.title}`);

    // Format the response to match our expected structure
    const formattedData = {
      data: {
        collection: {
          id: collection.id,
          title: collection.title,
          handle: collection.handle,
          description: collection.body_html || '',
          image: collection.image ? {
            url: collection.image.src,
            altText: collection.image.alt || collection.title
          } : null,
          products: {
            edges: productsData.products.map((product: any) => ({
              node: {
                id: product.id,
                title: product.title,
                handle: product.handle,
                description: product.body_html || '',
                priceRange: {
                  minVariantPrice: {
                    amount: product.variants[0]?.price || '0',
                    currencyCode: 'TND'
                  }
                },
                images: {
                  edges: product.images.map((image: any) => ({
                    node: {
                      url: image.src,
                      altText: image.alt || product.title
                    }
                  }))
                }
              }
            }))
          }
        }
      }
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.log('Admin Collection API Error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({
      error: 'Error fetching collection',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
