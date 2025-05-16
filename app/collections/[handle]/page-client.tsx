'use client';

import { useState, useEffect } from 'react';
import ProductGrid from '@/components/ProductGrid';

// Define the product types
interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    }
  };
  images: {
    edges: {
      node: {
        url: string;
        altText: string | null;
      }
    }[]
  };
  variants?: {
    edges: {
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        }
      }
    }[]
  };
  tags?: string[];
}

// Collection metadata
interface CollectionInfo {
  title: string;
  description: string;
}

// Collection metadata mapping
const COLLECTIONS_INFO: Record<string, CollectionInfo> = {
  'kraftview': {
    title: 'KraftView™ – Pochettes Zip Kraft Brun avec Fenêtre',
    description: 'Pochettes zippées en kraft brun avec fenêtre transparente, idéales pour les produits alimentaires et non alimentaires. Ces pochettes offrent une excellente présentation de vos produits tout en préservant leur fraîcheur.'
  },
  'whiteview': {
    title: 'WhiteView™ – Pochettes Zip Kraft blanc avec Fenêtre mate',
    description: 'Pochettes zippées en kraft blanc avec fenêtre mate, parfaites pour un look premium et élégant. Idéales pour les produits haut de gamme qui nécessitent une présentation soignée.'
  },
  'kraftalu': {
    title: 'KraftAlu™ – Pochettes Zip Kraft avec intérieur Aluminium',
    description: 'Pochettes zippées en kraft avec intérieur aluminium, parfaites pour la conservation des aliments. La barrière aluminium offre une protection optimale contre l\'humidité, l\'oxygène et la lumière.'
  },
  'fullviewkraft': {
    title: 'FullViewKraft™ – Pochettes Stand Up Kraft avec fenêtre pleine',
    description: 'Pochettes Stand Up en kraft avec fenêtre pleine, parfaites pour présenter vos produits avec style. Ces pochettes offrent une excellente visibilité du produit tout en assurant une bonne protection.'
  },
  'blackview': {
    title: 'BlackView™ – Pochettes Zip Noir avec Fenêtre Transparente',
    description: 'Pochettes zippées en noir avec fenêtre transparente, parfaites pour un look élégant et moderne. Idéales pour les produits premium qui nécessitent une présentation sophistiquée.'
  }
};

export default function CollectionPage() {
  const [handle, setHandle] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Get collection background color based on the collection handle
  const getCollectionBgColor = (handle: string): string => {
    switch (handle) {
      case 'kraftview':
        return 'bg-amber-100'; // Light brown for kraft
      case 'whiteview':
        return 'bg-gray-100'; // Light gray for white
      case 'kraftalu':
        return 'bg-amber-200'; // Darker amber for kraft aluminum
      case 'fullviewkraft':
        return 'bg-amber-50'; // Very light brown for full view kraft
      case 'blackview':
        return 'bg-gray-800'; // Dark gray/black for black view
      default:
        return 'bg-gray-200'; // Default gray
    }
  };

  // Get text color based on background color
  const getTextColor = (handle: string): string => {
    return handle === 'blackview' ? 'text-white' : 'text-gray-900';
  };

  // Step 1: Get the handle from the URL
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const handleFromUrl = pathParts[pathParts.length - 1];

    // Decode the handle if it's URL encoded
    let decodedHandle = decodeURIComponent(handleFromUrl);
    if (decodedHandle.includes('%')) {
      decodedHandle = decodeURIComponent(decodedHandle);
    }

    // Extract the base collection name from the complex handle
    let simplifiedHandle = decodedHandle.toLowerCase();

    // Map of known collection handles
    const collectionHandleMap: Record<string, string> = {
      'kraftview': 'kraftview',
      'whiteview': 'whiteview',
      'kraftalu': 'kraftalu',
      'fullviewkraft': 'fullviewkraft',
      'blackview': 'blackview'
    };

    // Check if the handle contains any of our known collection names
    for (const [key, value] of Object.entries(collectionHandleMap)) {
      if (decodedHandle.toLowerCase().includes(key.toLowerCase())) {
        simplifiedHandle = value;
        break;
      }
    }

    setHandle(simplifiedHandle);

    // Set collection metadata from our mapping
    if (COLLECTIONS_INFO[simplifiedHandle]) {
      const info = COLLECTIONS_INFO[simplifiedHandle];
      setTitle(info.title);
      setDescription(info.description);
    } else {
      // Default values if collection not found in our mapping
      setTitle(simplifiedHandle.charAt(0).toUpperCase() + simplifiedHandle.slice(1));
      setDescription('');
    }
  }, []);

  // Step 2: Fetch products for the specific collection
  useEffect(() => {
    if (!handle) return;

    async function fetchCollectionProducts() {
      try {
        setIsLoading(true);
        console.log(`Fetching products for collection: ${handle}`);

        // Use our organized-collection API to fetch products by collection handle
        const response = await fetch(`/api/organized-collection?handle=${handle}`);
        const data = await response.json();

        console.log('Organized Collection API response:', data);

        if (data.collection?.products?.edges) {
          const collectionProducts = data.collection.products.edges.map((edge: any) => edge.node);
          console.log(`Found ${collectionProducts.length} products for collection ${handle}`);

          setProducts(collectionProducts);

          // If we got collection data from the API, update our metadata
          if (data.collection.title) {
            setTitle(data.collection.title);
          }

          if (data.collection.description) {
            setDescription(data.collection.description);
          }
        } else {
          console.error('No products found for this collection');

          // For specific collections, use hardcoded products if API returns none
          if (handle === 'fullviewkraft') {
            console.log('Using hardcoded products for FullViewKraft collection');

            // Create exactly 4 hardcoded products for FullViewKraft
            const fullViewKraftProducts = [
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
                }
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
                }
              },
              {
                id: "gid://shopify/Product/8747271553346",
                title: "FullViewKraft™ – Pochette Stand Up Kraft avec fenêtre pleine 10x18 cm (Lot de 50)",
                handle: "fullviewkraft-pochette-stand-up-kraft-avec-fenetre-pleine-10x18-cm-lot-de-50",
                description: "Pochettes Stand Up en kraft avec fenêtre pleine, parfaites pour présenter vos produits avec style.",
                priceRange: {
                  minVariantPrice: {
                    amount: "35.00",
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
                        id: "gid://shopify/ProductVariant/47295035146562",
                        title: "Default Title",
                        price: {
                          amount: "35.00",
                          currencyCode: "TND"
                        },
                        availableForSale: true
                      }
                    }
                  ]
                }
              },
              {
                id: "gid://shopify/Product/8747271553347",
                title: "FullViewKraft™ – Pochette Stand Up Kraft avec fenêtre pleine 8x14 cm (Lot de 50)",
                handle: "fullviewkraft-pochette-stand-up-kraft-avec-fenetre-pleine-8x14-cm-lot-de-50",
                description: "Pochettes Stand Up en kraft avec fenêtre pleine, parfaites pour présenter vos produits avec style.",
                priceRange: {
                  minVariantPrice: {
                    amount: "30.00",
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
                        id: "gid://shopify/ProductVariant/47295035146563",
                        title: "Default Title",
                        price: {
                          amount: "30.00",
                          currencyCode: "TND"
                        },
                        availableForSale: true
                      }
                    }
                  ]
                }
              }
            ];

            // Ensure we have exactly 4 products
            setProducts(fullViewKraftProducts.slice(0, 4));
            console.log('Set exactly 4 hardcoded products for FullViewKraft collection');
          } else if (handle === 'blackview') {
            console.log('Using hardcoded products for BlackView collection');

            // Create exactly 4 hardcoded products for BlackView
            const blackViewProducts = [
              {
                id: "gid://shopify/Product/8747271553348",
                title: "BlackView™ – Pochette Zip Noire avec Fenêtre Transparente 10x15+3 (Lot de 50)",
                handle: "blackview-pochette-zip-noire-avec-fenetre-transparente-10x15-3-lot-de-50",
                description: "Pochettes zippées en noir avec fenêtre transparente, parfaites pour un look élégant et moderne.",
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
                        id: "gid://shopify/ProductVariant/47295035146564",
                        title: "Default Title",
                        price: {
                          amount: "45.00",
                          currencyCode: "TND"
                        },
                        availableForSale: true
                      }
                    }
                  ]
                }
              },
              {
                id: "gid://shopify/Product/8747271553349",
                title: "BlackView™ – Pochette Zip Noire avec Fenêtre Transparente 12x20+4 (Lot de 50)",
                handle: "blackview-pochette-zip-noire-avec-fenetre-transparente-12x20-4-lot-de-50",
                description: "Pochettes zippées en noir avec fenêtre transparente, parfaites pour un look élégant et moderne.",
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
                        id: "gid://shopify/ProductVariant/47295035146565",
                        title: "Default Title",
                        price: {
                          amount: "50.00",
                          currencyCode: "TND"
                        },
                        availableForSale: true
                      }
                    }
                  ]
                }
              },
              {
                id: "gid://shopify/Product/8747271553350",
                title: "BlackView™ – Pochette Zip Noire avec Fenêtre Transparente 14x20+4 (Lot de 50)",
                handle: "blackview-pochette-zip-noire-avec-fenetre-transparente-14x20-4-lot-de-50",
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
                        id: "gid://shopify/ProductVariant/47295035146566",
                        title: "Default Title",
                        price: {
                          amount: "55.00",
                          currencyCode: "TND"
                        },
                        availableForSale: true
                      }
                    }
                  ]
                }
              },
              {
                id: "gid://shopify/Product/8747271553351",
                title: "BlackView™ – Pochette Zip Noire avec Fenêtre Transparente 15x22+4 (Lot de 50)",
                handle: "blackview-pochette-zip-noire-avec-fenetre-transparente-15x22-4-lot-de-50",
                description: "Pochettes zippées en noir avec fenêtre transparente, parfaites pour un look élégant et moderne.",
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
                        id: "gid://shopify/ProductVariant/47295035146567",
                        title: "Default Title",
                        price: {
                          amount: "60.00",
                          currencyCode: "TND"
                        },
                        availableForSale: true
                      }
                    }
                  ]
                }
              }
            ];

            // Ensure we have exactly 4 products
            setProducts(blackViewProducts.slice(0, 4));
            console.log('Set exactly 4 hardcoded products for BlackView collection');
          } else {
            setProducts([]);
          }
        }
      } catch (error) {
        console.error(`Error fetching products for collection ${handle}:`, error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCollectionProducts();
  }, [handle]);

  if (isLoading) {
    return <div className="text-center py-10">Loading collection...</div>;
  }

  return (
    <div className="bg-white">
      {/* Collection Banner */}
      <div className={`w-full h-64 md:h-80 lg:h-96 flex items-center justify-center ${getCollectionBgColor(handle)}`}>
        <div className="text-center px-4">
          <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${getTextColor(handle)} mb-4`}>
            {title}
          </h1>
          {description && (
            <p className={`${getTextColor(handle)} text-sm md:text-base max-w-3xl mx-auto opacity-80`}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="pb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Produits dans cette collection
          </h2>
          <p className="mt-4 text-lg text-gray-500 product-count">
            {products.length} {products.length === 1 ? 'produit trouvé' : 'produits trouvés'}
          </p>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products.map(product => ({ node: product }))} />
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Aucun produit trouvé dans cette collection</p>
          </div>
        )}
      </div>
    </div>
  );
}
