import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching collections using Shopify Admin API...');
    
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
    
    // Fetch collections using the REST API
    // For custom collections
    const customUrl = `https://${shopifyDomain}/admin/api/${apiVersion}/custom_collections.json`;
    
    const customResponse = await fetch(customUrl, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });
    
    // For smart collections
    const smartUrl = `https://${shopifyDomain}/admin/api/${apiVersion}/smart_collections.json`;
    
    const smartResponse = await fetch(smartUrl, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });
    
    // Process custom collections
    let customCollections = [];
    if (customResponse.ok) {
      const customData = await customResponse.json();
      customCollections = customData.custom_collections || [];
      console.log(`Found ${customCollections.length} custom collections`);
    } else {
      console.log('Error fetching custom collections:', await customResponse.text());
    }
    
    // Process smart collections
    let smartCollections = [];
    if (smartResponse.ok) {
      const smartData = await smartResponse.json();
      smartCollections = smartData.smart_collections || [];
      console.log(`Found ${smartCollections.length} smart collections`);
    } else {
      console.log('Error fetching smart collections:', await smartResponse.text());
    }
    
    // Combine all collections
    const allCollections = [...customCollections, ...smartCollections];
    console.log(`Total collections: ${allCollections.length}`);
    
    // Format the response to match our expected structure
    const formattedData = {
      data: {
        collections: {
          edges: allCollections.map((collection: any) => ({
            node: {
              id: collection.id,
              title: collection.title,
              handle: collection.handle,
              description: collection.body_html || '',
              image: collection.image ? {
                url: collection.image.src,
                altText: collection.image.alt || collection.title
              } : null
            }
          }))
        }
      }
    };
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.log('Admin Collections API Error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({
      error: 'Error fetching collections',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
