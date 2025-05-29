import { NextRequest, NextResponse } from 'next/server';

// Collection keywords mapping to help categorize products
// Each collection has required keywords (must match) and optional keywords (at least one must match)
const COLLECTION_FILTERS: Record<string, {
  required: string[],
  optional: string[],
  excluded: string[],
  exactMatch: string[] // Products must contain one of these exact strings in the title
}> = {
  'kraftview': {
    required: [],
    optional: [],
    excluded: ['blanc', 'white', 'alu', 'aluminium', 'stand up', 'stand-up', 'fenêtre pleine', 'noir', 'black', 'fullviewkraft', 'fullalu'],
    exactMatch: ['KraftView™']
  },
  'whiteview': {
    required: [],
    optional: [],
    excluded: ['alu', 'aluminium', 'stand up', 'stand-up', 'fenêtre pleine', 'noir', 'black', 'fullviewkraft', 'fullalu'],
    exactMatch: ['WhiteView™']
  },
  'kraftalu': {
    required: [],
    optional: [],
    excluded: ['stand up', 'stand-up', 'fenêtre pleine', 'noir', 'black', 'fullviewkraft', 'fullalu'],
    exactMatch: ['KraftAlu™']
  },
  'fullviewkraft': {
    required: [],
    optional: [],
    excluded: ['fullalu'],
    exactMatch: ['FullViewKraft™', 'Stand Up Kraft']
  },
  'blackview': {
    required: [],
    optional: [],
    excluded: ['alu', 'aluminium', 'stand up', 'stand-up', 'fullviewkraft', 'fullalu'],
    exactMatch: ['BlackView™']
  },
  'fullalu': {
    required: [],
    optional: [],
    excluded: [],
    exactMatch: ['FullAlu™']
  }
};

// Collection metadata for consistent information
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
    title: 'FullViewKraft™ – Pochettes Stand Up Kraft avec fenêtre pleine',
    description: 'Pochettes Stand Up en kraft avec fenêtre pleine, parfaites pour présenter vos produits avec style.'
  },
  'blackview': {
    title: 'BlackView™',
    description: 'Pochettes zippées en noir avec fenêtre transparente, parfaites pour un look élégant et moderne.'
  },
  'fullalu': {
    title: 'FullAlu™ – Pochettes Zip en Aluminium',
    description: 'Pochettes zippées entièrement en aluminium, offrant une barrière optimale contre l\'humidité, l\'oxygène et la lumière pour une conservation parfaite.'
  }
};

export async function GET(request: NextRequest) {
  try {
    // Get the collection handle from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const handle = searchParams.get('handle');

    if (!handle) {
      return NextResponse.json(
        { error: 'Collection handle is required' },
        { status: 400 }
      );
    }

    // Check if the handle is a known collection
    if (!COLLECTION_FILTERS[handle]) {
      return NextResponse.json(
        { error: 'Unknown collection handle' },
        { status: 404 }
      );
    }

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

    // Fetch all products from Shopify
    console.log(`Fetching products for collection: ${handle}`);
    const productsUrl = `https://${shopifyAdminDomain}/admin/api/2024-07/products.json?limit=250`;

    const productsResponse = await fetch(productsUrl, {
      headers: {
        'X-Shopify-Access-Token': shopifyAdminAccessToken,
        'Content-Type': 'application/json',
      },
    });

    if (!productsResponse.ok) {
      console.error('Error response from Shopify Admin API:', productsResponse.status, productsResponse.statusText);
      return NextResponse.json(
        { error: `Error fetching products: ${productsResponse.statusText}` },
        { status: productsResponse.status }
      );
    }

    const productsData = await productsResponse.json();
    const allProducts = productsData.products || [];
    console.log(`Found ${allProducts.length} total products from Shopify`);

    // Get the filters for this collection
    const filters = COLLECTION_FILTERS[handle];
    console.log(`Using filters for ${handle}:`, JSON.stringify(filters, null, 2));

    // Filter products that match the collection criteria
    const collectionProducts = allProducts.filter((product: any) => {
      const title = product.title;
      const tags = product.tags || '';

      // Enable debugging for all collections
      const isDebug = true;

      // Get the brand name for this collection
      const brandName = filters.exactMatch[0]; // Use the first exact match as the brand name

      // Simple brand matching - product must contain the brand name in its title
      const hasBrandMatch = title.includes(brandName);

      if (!hasBrandMatch) {
        if (isDebug) {
          console.log(`EXCLUDED from ${handle}: "${product.title}" - does not contain brand name: "${brandName}"`);
        }
        return false;
      }

      // If we got here, product has the correct brand name
      console.log(`INCLUDED in ${handle}: "${product.title}" - matched brand name: "${brandName}"`);
      return true;
    });

    console.log(`Found ${collectionProducts.length} products matching collection: ${handle}`);

    // Format the products to match the expected structure
    const formattedProducts = collectionProducts.map((product: any) => ({
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
    }));

    // Get collection info
    const collectionInfo = COLLECTION_INFO[handle];

    // Limit the number of products for FullViewKraft to exactly 4
    let finalProducts = formattedProducts;
    if (handle === 'fullviewkraft' && formattedProducts.length > 4) {
      console.log(`Limiting FullViewKraft collection to 4 products (from ${formattedProducts.length})`);
      finalProducts = formattedProducts.slice(0, 4);
    }

    // Format the response
    const formattedResponse = {
      collection: {
        id: `gid://shopify/Collection/${handle}`,
        title: collectionInfo.title,
        handle: handle,
        description: collectionInfo.description,
        products: {
          edges: finalProducts.map((product: any) => ({
            node: product
          }))
        }
      }
    };

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error('Error in organized-collection API:', error);
    return NextResponse.json(
      { error: 'Error fetching collection products' },
      { status: 500 }
    );
  }
}
