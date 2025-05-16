import { NextRequest, NextResponse } from 'next/server';

// Collection IDs mapping
const COLLECTION_IDS: Record<string, string> = {
  'kraftview': '459735605568',
  'whiteview': '459735638336',
  'kraftalu': '459735671104',
  'fullviewkraft': '459735703872',
  'blackview': '459735736640'
};

// Collection metadata
const COLLECTION_INFO: Record<string, { title: string, description: string }> = {
  'kraftview': {
    title: 'KraftView™',
    description: 'Pochettes zippées en kraft brun avec fenêtre transparente, idéales pour les produits alimentaires et non alimentaires.'
  },
  'whiteview': {
    title: 'WhiteView™',
    description: 'Pochettes zippées en kraft blanc avec fenêtre mate, parfaites pour un look premium et élégant.'
  },
  'kraftalu': {
    title: 'KraftAlu™',
    description: 'Pochettes zippées en kraft avec intérieur aluminium, parfaites pour la conservation des aliments.'
  },
  'fullviewkraft': {
    title: 'FullViewKraft™',
    description: 'Pochettes Stand Up en kraft avec fenêtre pleine, parfaites pour présenter vos produits avec style.'
  },
  'blackview': {
    title: 'BlackView™',
    description: 'Pochettes zippées en noir avec fenêtre transparente, parfaites pour un look élégant et moderne.'
  }
};

export async function GET(request: NextRequest) {
  try {
    // Get the collection handle or ID from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const handle = searchParams.get('handle');
    let collectionId = searchParams.get('id');

    // If handle is provided but no ID, try to get the ID from the mapping
    if (handle && !collectionId && COLLECTION_IDS[handle]) {
      collectionId = COLLECTION_IDS[handle];
      console.log(`Mapped handle ${handle} to collection ID ${collectionId}`);
    }

    if (!collectionId) {
      return NextResponse.json(
        { error: 'Collection ID is required' },
        { status: 400 }
      );
    }

    console.log(`Fetching products for collection ID: ${collectionId} using Admin API`);

    // Get Shopify Admin API credentials from environment variables
    const shopifyAdminDomain = process.env.SHOPIFY_ADMIN_DOMAIN;
    const shopifyAdminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    console.log('Using Shopify Admin domain:', shopifyAdminDomain);
    console.log('Using Admin access token:', shopifyAdminAccessToken ? 'Token exists' : 'Token missing');

    if (!shopifyAdminDomain || !shopifyAdminAccessToken) {
      return NextResponse.json(
        { error: 'Shopify Admin API credentials are missing' },
        { status: 500 }
      );
    }

    // Fetch products from the collection using the Shopify Admin API
    const url = `https://${shopifyAdminDomain}/admin/api/2024-07/collections/${collectionId}/products.json`;

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
    console.log(`Found ${data.products?.length || 0} products in collection ${collectionId}`);

    // Get collection info based on handle or default to a generic title
    const collectionHandle = handle || '';
    const collectionInfo = COLLECTION_INFO[collectionHandle] || {
      title: collectionHandle ? collectionHandle.charAt(0).toUpperCase() + collectionHandle.slice(1) : 'Collection',
      description: ''
    };

    console.log(`Using collection title: ${collectionInfo.title}`);

    // Format the response to match the structure expected by the client
    const formattedResponse = {
      collection: {
        id: `gid://shopify/Collection/${collectionId}`,
        title: collectionInfo.title,
        handle: collectionHandle,
        description: collectionInfo.description,
        products: {
          edges: data.products.map((product: any) => ({
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
    console.error('Error in admin-collection-products API:', error);
    return NextResponse.json(
      { error: 'Error fetching collection products' },
      { status: 500 }
    );
  }
}
