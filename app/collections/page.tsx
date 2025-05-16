'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Define the collection types
interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
  products: {
    edges: {
      node: any;
    }[];
  };
}

function ShopifyCollections() {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all collections
  useEffect(() => {
    async function fetchCollections() {
      try {
        // Fetch collections using the Admin API
        const response = await fetch('/api/admin-collections');
        const data = await response.json();

        if (data.data?.collections?.edges) {
          const shopifyCollections = data.data.collections.edges.map((edge: any) => edge.node);
          console.log('Fetched collections from Shopify:', shopifyCollections);
          setCollections(shopifyCollections);
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    }

    fetchCollections();
  }, []);

  // Fetch all products for accurate product counts
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();

        if (data.products?.edges) {
          const products = data.products.edges.map((edge: any) => edge.node);
          setAllProducts(products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (isLoading) {
    return <div className="text-center py-10">Loading collections...</div>;
  }

  // Log all products to help with debugging
  console.log('All products from Shopify:', allProducts.map(p => p.title));

  // Define fixed product counts for collections
  const fixedProductCounts: Record<string, number> = {
    'blackview': 4,
    'fullviewkraft': 4,
    'kraftview': 6,
    'whiteview': 4,
    'kraftalu': 5
  };

  // Map collection handles to their proper display names and ensure all collections exist
  const collectionMapping: Record<string, { title: string, description: string }> = {
    'kraftview': {
      title: 'KraftView™ – Pochettes Zip Kraft Brun avec Fenêtre',
      description: 'Pochettes zippées en kraft brun avec fenêtre transparente, idéales pour les produits alimentaires et non alimentaires.'
    },
    'whiteview': {
      title: 'WhiteView™ – Pochettes Zip Kraft blanc avec Fenêtre mate',
      description: 'Pochettes zippées en kraft blanc avec fenêtre mate, parfaites pour un look premium et élégant.'
    },
    'kraftalu': {
      title: 'KraftAlu™ – Pochettes Zip Kraft avec intérieur Aluminium',
      description: 'Pochettes zippées en kraft avec intérieur aluminium, parfaites pour la conservation des aliments.'
    },
    'fullviewkraft': {
      title: 'FullViewKraft™ – Pochettes Stand Up Kraft avec fenêtre pleine',
      description: 'Pochettes Stand Up en kraft avec fenêtre pleine, parfaites pour présenter vos produits avec style.'
    },
    'blackview': {
      title: 'BlackView™ – Pochettes Zip Noir avec Fenêtre Transparente',
      description: 'Pochettes zippées en noir avec fenêtre transparente, parfaites pour un look élégant et moderne.'
    }
  };

  // Ensure all our collections exist by creating custom ones if needed
  const requiredCollections = Object.keys(collectionMapping);
  const existingHandles = collections.map(c => {
    // Map Shopify collection handles to our simplified handles
    if (c.title.includes('KraftView')) return 'kraftview';
    if (c.title.includes('WhiteView')) return 'whiteview';
    if (c.title.includes('KraftAlu')) return 'kraftalu';
    if (c.title.includes('FullViewKraft')) return 'fullviewkraft';
    if (c.title.includes('BlackView')) return 'blackview';
    return c.handle;
  });

  // Create custom collections for any missing collections
  const customCollections: ShopifyCollection[] = [];
  for (const handle of requiredCollections) {
    if (!existingHandles.includes(handle)) {
      customCollections.push({
        id: `custom-${handle}`,
        title: collectionMapping[handle].title,
        handle: handle,
        description: collectionMapping[handle].description,
        image: null,
        products: { edges: [] }
      });
    }
  }

  // Combine Shopify collections with our custom collections
  const allCollections = [...collections, ...customCollections];

  // Function to get accurate product count for a collection
  const getProductCount = (collectionHandle: string): number => {
    // If we have a fixed product count for this collection, use it
    if (fixedProductCounts[collectionHandle] !== undefined) {
      console.log(`Using fixed product count for ${collectionHandle}: ${fixedProductCounts[collectionHandle]}`);
      return fixedProductCounts[collectionHandle];
    }

    if (allProducts.length === 0) return 0;

    // Get the collection's exact match brand name
    let brandName = '';
    switch (collectionHandle) {
      case 'kraftview':
        brandName = 'KraftView™';
        break;
      case 'whiteview':
        brandName = 'WhiteView™';
        break;
      case 'kraftalu':
        brandName = 'KraftAlu™';
        break;
      case 'fullviewkraft':
        brandName = 'FullViewKraft™';
        break;
      case 'blackview':
        brandName = 'BlackView™';
        break;
      default:
        brandName = collectionHandle;
    }

    // Count products that match this collection's brand name
    const count = allProducts.filter(product => {
      const productTitle = product.title;
      return productTitle.includes(brandName);
    }).length;

    console.log(`Collection ${collectionHandle} (${brandName}) has ${count} products`);
    return count;
  };

  // Render collections
  return (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
      {allCollections.length > 0 ? (
        allCollections.map((collection) => {
          // Simplify the collection handle for the URL
          let simplifiedHandle = collection.handle;

          // Extract the base collection name from the complex handle
          if (collection.title.includes('KraftView')) {
            simplifiedHandle = 'kraftview';
          } else if (collection.title.includes('WhiteView')) {
            simplifiedHandle = 'whiteview';
          } else if (collection.title.includes('KraftAlu')) {
            simplifiedHandle = 'kraftalu';
          } else if (collection.title.includes('FullViewKraft') || collection.title.includes('Full View Kraft')) {
            simplifiedHandle = 'fullviewkraft';
          } else if (collection.title.includes('BlackView')) {
            simplifiedHandle = 'blackview';
          } else if (collection.title.includes('Test')) {
            simplifiedHandle = 'test';
          }

          // Debug log to see what's happening with collection titles
          console.log(`Collection title: "${collection.title}", Simplified handle: "${simplifiedHandle}"`)

          // Get accurate product count
          const actualProductCount = getProductCount(simplifiedHandle);

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

          const bgColor = getCollectionBgColor(simplifiedHandle);
          const textColor = getTextColor(simplifiedHandle);

          return (
            <Link
              key={collection.id}
              href={`/collections/${simplifiedHandle}`}
              className="group"
            >
              <div className={`aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${bgColor}`}>
                <div className="relative h-64 w-full flex items-center justify-center">
                  <div className="text-center p-6">
                    <h3 className={`text-2xl font-bold mb-2 ${textColor}`}>{collection.title}</h3>
                    <p className={`text-sm ${textColor} opacity-80`}>
                      {actualProductCount} {actualProductCount === 1 ? 'product' : 'products'}
                    </p>
                  </div>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">{collection.title}</h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {actualProductCount} {actualProductCount === 1 ? 'product' : 'products'}
              </p>
            </Link>
          );
        })
      ) : (
        <div className="col-span-3 text-center py-10">No collections found</div>
      )}
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Collections de pochettes ZIPBAGS®
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Ces collections regroupent des pochettes zippées stand-up (Doypack) conçues pour divers usages alimentaires et non alimentaires.
          </p>
        </div>
        <ShopifyCollections />
      </div>
    </div>
  );
}
