import { NextRequest, NextResponse } from 'next/server';

// Collection metadata
const COLLECTIONS_INFO: Record<string, { title: string, description: string }> = {
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

// Sample products for each collection
const COLLECTION_PRODUCTS: Record<string, any[]> = {
  'kraftview': [
    {
      id: "gid://shopify/Product/8747271553340",
      title: "KraftView™ – Pochette Zip Kraft avec fenêtre 14x22 cm (Lot de 100)",
      handle: "kraftview-pochette-zip-kraft-avec-fenetre-14x22-cm-lot-de-100",
      description: "Pochettes zippées en kraft brun avec fenêtre transparente, idéales pour les produits alimentaires et non alimentaires.",
      priceRange: {
        minVariantPrice: {
          amount: "45.00",
          currencyCode: "TND"
        }
      },
      images: {
        edges: [
          {
            node: {
              url: "https://cdn.shopify.com/s/files/1/0792/1761/6464/files/kraftview-sample.jpg",
              altText: "KraftView Pochette"
            }
          }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/47295035146556",
              title: "Default Title",
              price: {
                amount: "45.00",
                currencyCode: "TND"
              },
              availableForSale: true
            }
          }
        ]
      },
      tags: ["kraft", "fenêtre", "alimentaire"]
    },
    {
      id: "gid://shopify/Product/8747271553341",
      title: "KraftView™ – Pochette Zip Kraft avec fenêtre 16x26 cm (Lot de 100)",
      handle: "kraftview-pochette-zip-kraft-avec-fenetre-16x26-cm-lot-de-100",
      description: "Pochettes zippées en kraft brun avec fenêtre transparente, idéales pour les produits alimentaires et non alimentaires.",
      priceRange: {
        minVariantPrice: {
          amount: "55.00",
          currencyCode: "TND"
        }
      },
      images: {
        edges: [
          {
            node: {
              url: "https://cdn.shopify.com/s/files/1/0792/1761/6464/files/kraftview-sample.jpg",
              altText: "KraftView Pochette"
            }
          }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/47295035146557",
              title: "Default Title",
              price: {
                amount: "55.00",
                currencyCode: "TND"
              },
              availableForSale: true
            }
          }
        ]
      },
      tags: ["kraft", "fenêtre", "alimentaire"]
    }
  ],
  'whiteview': [
    {
      id: "gid://shopify/Product/8747271553342",
      title: "WhiteView™ – Pochette Zip Kraft blanc avec fenêtre 14x22 cm (Lot de 100)",
      handle: "whiteview-pochette-zip-kraft-blanc-avec-fenetre-14x22-cm-lot-de-100",
      description: "Pochettes zippées en kraft blanc avec fenêtre mate, parfaites pour un look premium et élégant.",
      priceRange: {
        minVariantPrice: {
          amount: "50.00",
          currencyCode: "TND"
        }
      },
      images: {
        edges: [
          {
            node: {
              url: "https://cdn.shopify.com/s/files/1/0792/1761/6464/files/whiteview-sample.jpg",
              altText: "WhiteView Pochette"
            }
          }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/47295035146558",
              title: "Default Title",
              price: {
                amount: "50.00",
                currencyCode: "TND"
              },
              availableForSale: true
            }
          }
        ]
      },
      tags: ["kraft blanc", "fenêtre", "premium"]
    }
  ],
  'kraftalu': [
    {
      id: "gid://shopify/Product/8747271553343",
      title: "KraftAlu™ – Pochette Zip Kraft avec intérieur aluminium 14x22 cm (Lot de 100)",
      handle: "kraftalu-pochette-zip-kraft-avec-interieur-aluminium-14x22-cm-lot-de-100",
      description: "Pochettes zippées en kraft avec intérieur aluminium, parfaites pour la conservation des aliments.",
      priceRange: {
        minVariantPrice: {
          amount: "60.00",
          currencyCode: "TND"
        }
      },
      images: {
        edges: [
          {
            node: {
              url: "https://cdn.shopify.com/s/files/1/0792/1761/6464/files/kraftalu-sample.jpg",
              altText: "KraftAlu Pochette"
            }
          }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/47295035146559",
              title: "Default Title",
              price: {
                amount: "60.00",
                currencyCode: "TND"
              },
              availableForSale: true
            }
          }
        ]
      },
      tags: ["kraft", "aluminium", "conservation"]
    }
  ],
  'fullviewkraft': [
    {
      id: "gid://shopify/Product/8747271553344",
      title: "FullViewKraft™ – Pochette Stand Up Kraft avec fenêtre pleine 16x26 cm (Lot de 50)",
      handle: "fullviewkraft-pochette-stand-up-kraft-avec-fenetre-pleine-16x26-cm-lot-de-50",
      description: "Pochettes Stand Up en kraft avec fenêtre pleine, parfaites pour présenter vos produits avec style.",
      priceRange: {
        minVariantPrice: {
          amount: "45.00",
          currencyCode: "TND"
        }
      },
      images: {
        edges: [
          {
            node: {
              url: "https://cdn.shopify.com/s/files/1/0792/1761/6464/files/fullviewkraft-sample.jpg",
              altText: "FullViewKraft Pochette"
            }
          }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/47295035146560",
              title: "Default Title",
              price: {
                amount: "45.00",
                currencyCode: "TND"
              },
              availableForSale: true
            }
          }
        ]
      },
      tags: ["kraft", "stand up", "fenêtre pleine"]
    },
    {
      id: "gid://shopify/Product/8747271553345",
      title: "FullViewKraft™ – Pochette Stand Up Kraft avec fenêtre pleine 12x20 cm (Lot de 50)",
      handle: "fullviewkraft-pochette-stand-up-kraft-avec-fenetre-pleine-12x20-cm-lot-de-50",
      description: "Pochettes Stand Up en kraft avec fenêtre pleine, parfaites pour présenter vos produits avec style.",
      priceRange: {
        minVariantPrice: {
          amount: "40.00",
          currencyCode: "TND"
        }
      },
      images: {
        edges: [
          {
            node: {
              url: "https://cdn.shopify.com/s/files/1/0792/1761/6464/files/fullviewkraft-sample.jpg",
              altText: "FullViewKraft Pochette"
            }
          }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/47295035146561",
              title: "Default Title",
              price: {
                amount: "40.00",
                currencyCode: "TND"
              },
              availableForSale: true
            }
          }
        ]
      },
      tags: ["kraft", "stand up", "fenêtre pleine"]
    }
  ],
  'blackview': [
    {
      id: "gid://shopify/Product/8747271553346",
      title: "BlackView™ – Pochette Zip noir avec fenêtre transparente 14x22 cm (Lot de 100)",
      handle: "blackview-pochette-zip-noir-avec-fenetre-transparente-14x22-cm-lot-de-100",
      description: "Pochettes zippées en noir avec fenêtre transparente, parfaites pour un look élégant et moderne.",
      priceRange: {
        minVariantPrice: {
          amount: "55.00",
          currencyCode: "TND"
        }
      },
      images: {
        edges: [
          {
            node: {
              url: "https://cdn.shopify.com/s/files/1/0792/1761/6464/files/blackview-sample.jpg",
              altText: "BlackView Pochette"
            }
          }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/47295035146562",
              title: "Default Title",
              price: {
                amount: "55.00",
                currencyCode: "TND"
              },
              availableForSale: true
            }
          }
        ]
      },
      tags: ["noir", "fenêtre", "premium"]
    }
  ]
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

    console.log(`Fetching hardcoded products for collection: ${handle}`);

    // Get collection info and products
    const collectionInfo = COLLECTIONS_INFO[handle] || {
      title: handle.charAt(0).toUpperCase() + handle.slice(1),
      description: ''
    };
    
    const products = COLLECTION_PRODUCTS[handle] || [];
    
    console.log(`Found ${products.length} hardcoded products for collection ${handle}`);

    // Format the response to match the structure expected by the client
    const formattedResponse = {
      collection: {
        id: `gid://shopify/Collection/${handle}`,
        title: collectionInfo.title,
        handle: handle,
        description: collectionInfo.description,
        products: {
          edges: products.map(product => ({
            node: product
          }))
        }
      }
    };

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error('Error in hardcoded-collections API:', error);
    return NextResponse.json(
      { error: 'Error fetching collection products' },
      { status: 500 }
    );
  }
}
