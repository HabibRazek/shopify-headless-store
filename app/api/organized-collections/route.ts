import { NextRequest, NextResponse } from 'next/server';

// Collection keywords mapping to help categorize products
const COLLECTION_KEYWORDS: Record<string, string[]> = {
  'kraftview': ['kraftview', 'kraft view', 'kraft-view', 'kraft brun', 'kraft-brun', 'fenêtre transparente', 'fenetre transparente'],
  'whiteview': ['whiteview', 'white view', 'white-view', 'kraft blanc', 'kraft-blanc', 'fenêtre mate', 'fenetre mate'],
  'kraftalu': ['kraftalu', 'kraft alu', 'kraft-alu', 'aluminium', 'aluminum', 'intérieur aluminium', 'interieur aluminium'],
  'fullviewkraft': ['fullviewkraft', 'full view kraft', 'full-view-kraft', 'stand up', 'stand-up', 'fenêtre pleine', 'fenetre pleine', 'pochette stand up'],
  'blackview': ['blackview', 'black view', 'black-view', 'noir', 'fenêtre transparente noir', 'fenetre transparente noir']
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

    // Step 1: Fetch all collections from Shopify
    console.log('Fetching collections from Shopify Admin API...');
    const collectionsUrl = `https://${shopifyAdminDomain}/admin/api/2024-07/custom_collections.json`;
    
    const collectionsResponse = await fetch(collectionsUrl, {
      headers: {
        'X-Shopify-Access-Token': shopifyAdminAccessToken,
        'Content-Type': 'application/json',
      },
    });

    if (!collectionsResponse.ok) {
      console.error('Error response from Shopify Admin API (collections):', collectionsResponse.status, collectionsResponse.statusText);
      return NextResponse.json(
        { error: `Error fetching collections: ${collectionsResponse.statusText}` },
        { status: collectionsResponse.status }
      );
    }

    const collectionsData = await collectionsResponse.json();
    const collections = collectionsData.custom_collections || [];
    console.log(`Found ${collections.length} collections from Shopify`);

    // Step 2: Fetch all products from Shopify
    console.log('Fetching all products from Shopify Admin API...');
    const productsUrl = `https://${shopifyAdminDomain}/admin/api/2024-07/products.json?limit=250`;
    
    const productsResponse = await fetch(productsUrl, {
      headers: {
        'X-Shopify-Access-Token': shopifyAdminAccessToken,
        'Content-Type': 'application/json',
      },
    });

    if (!productsResponse.ok) {
      console.error('Error response from Shopify Admin API (products):', productsResponse.status, productsResponse.statusText);
      return NextResponse.json(
        { error: `Error fetching products: ${productsResponse.statusText}` },
        { status: productsResponse.status }
      );
    }

    const productsData = await productsResponse.json();
    const products = productsData.products || [];
    console.log(`Found ${products.length} products from Shopify`);

    // Step 3: Organize products into collections based on product titles and collection keywords
    const organizedCollections: Record<string, any[]> = {};
    
    // Initialize collections with empty product arrays
    Object.keys(COLLECTION_KEYWORDS).forEach(collectionHandle => {
      organizedCollections[collectionHandle] = [];
    });

    // Assign products to collections based on keywords in title, tags, or product type
    products.forEach((product: any) => {
      const title = product.title.toLowerCase();
      const tags = product.tags ? product.tags.toLowerCase() : '';
      const productType = product.product_type ? product.product_type.toLowerCase() : '';
      
      // Check each collection's keywords
      for (const [collectionHandle, keywords] of Object.entries(COLLECTION_KEYWORDS)) {
        // Check if any keyword matches the product title, tags, or product type
        const matchesKeyword = keywords.some(keyword => 
          title.includes(keyword.toLowerCase()) || 
          tags.includes(keyword.toLowerCase()) || 
          productType.includes(keyword.toLowerCase())
        );
        
        if (matchesKeyword) {
          // Format the product to match the expected structure
          const formattedProduct = {
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
          };
          
          organizedCollections[collectionHandle].push(formattedProduct);
        }
      }
    });

    // Step 4: Format the response with all collections and their products
    const formattedCollections = Object.entries(organizedCollections).map(([handle, products]) => {
      const collectionInfo = COLLECTION_INFO[handle] || {
        title: handle.charAt(0).toUpperCase() + handle.slice(1),
        description: ''
      };
      
      // Find the matching Shopify collection if it exists
      const shopifyCollection = collections.find((c: any) => 
        c.title.toLowerCase().includes(handle.toLowerCase()) ||
        c.handle.toLowerCase().includes(handle.toLowerCase())
      );
      
      return {
        id: shopifyCollection?.id || `gid://shopify/Collection/${handle}`,
        title: collectionInfo.title,
        handle: handle,
        description: collectionInfo.description,
        productCount: products.length,
        products: {
          edges: products.map(product => ({
            node: product
          }))
        }
      };
    });

    console.log('Organized collections with product counts:', 
      formattedCollections.map(c => `${c.title}: ${c.productCount} products`)
    );

    return NextResponse.json({ collections: formattedCollections });
  } catch (error) {
    console.error('Error in organized-collections API:', error);
    return NextResponse.json(
      { error: 'Error fetching and organizing collections' },
      { status: 500 }
    );
  }
}
