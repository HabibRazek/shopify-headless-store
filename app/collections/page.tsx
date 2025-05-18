'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShopifyCollection,
  getSimplifiedHandle,
  getBrandName,
  getCollectionImage,
  getCollectionMetadata,
  stripHtml,
  getFixedProductCount
} from '@/lib/collection-utils';

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

  // We're now using utility functions from lib/collection-utils.ts instead of hardcoded values

  // Define the required collections
  const requiredCollections = ['kraftview', 'whiteview', 'kraftalu', 'fullviewkraft', 'blackview', 'fullalu'];

  // Map Shopify collection handles to our simplified handles
  const existingHandles = collections.map(c => getSimplifiedHandle(c.title));

  // Create custom collections for any missing collections
  const customCollections: ShopifyCollection[] = [];
  for (const handle of requiredCollections) {
    if (!existingHandles.includes(handle)) {
      const metadata = getCollectionMetadata(handle);
      customCollections.push({
        id: `custom-${handle}`,
        title: metadata.title,
        handle: handle,
        description: metadata.description,
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
    const fixedCount = getFixedProductCount(collectionHandle);
    if (fixedCount !== undefined) {
      console.log(`Using fixed product count for ${collectionHandle}: ${fixedCount}`);
      return fixedCount;
    }

    if (allProducts.length === 0) return 0;

    // Get the collection's exact match brand name
    const brandName = getBrandName(collectionHandle);

    // Count products that match this collection's brand name
    const count = allProducts.filter(product => {
      const productTitle = product.title;
      return productTitle.includes(brandName);
    }).length;

    console.log(`Collection ${collectionHandle} (${brandName}) has ${count} products`);
    return count;
  };

  // We're now using the utility function from lib/collection-utils.ts

  // Render collections
  return (
    <div className="space-y-16">
      {/* Featured Collections */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm font-medium text-gray-500">COLLECTIONS POPULAIRES</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {allCollections.length > 0 ? (
          allCollections.map((collection) => {
            // Simplify the collection handle for the URL
            const simplifiedHandle = getSimplifiedHandle(collection.title);

            // Get accurate product count
            const actualProductCount = getProductCount(simplifiedHandle);

            // Get collection image
            const collectionImage = getCollectionImage(collection, simplifiedHandle);

            // Get collection title parts (split at the first dash)
            const titleParts = collection.title.split('–');
            const mainTitle = titleParts[0].trim();
            const subtitle = titleParts.length > 1 ? titleParts[1].trim() : '';

            return (
              <Link
                key={collection.id}
                href={`/collections/${simplifiedHandle}`}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Collection Image */}
                <div className="relative h-80 w-full overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                    <Image
                      src={collectionImage}
                      alt={collection.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain object-center"
                      priority={true}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                {/* Collection Info */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="mb-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      {actualProductCount} {actualProductCount === 1 ? 'produit' : 'produits'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1 group-hover:text-green-300 transition-colors">
                    {mainTitle}
                  </h3>
                  {subtitle && (
                    <p className="text-sm text-gray-300 mb-3">
                      {subtitle}
                    </p>
                  )}
                  <div className="h-0.5 w-16 bg-green-500 mb-3 transform origin-left transition-all duration-300 group-hover:w-24 group-hover:bg-green-400" />
                  <p className="text-sm text-gray-300 line-clamp-2 mb-4 max-w-md">
                    {stripHtml(collection.description)}
                  </p>
                  <div className="flex items-center mt-auto">
                    <span className="text-sm font-medium text-white group-hover:text-green-300 transition-colors">
                      Voir la collection
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-3 text-center py-10">No collections found</div>
        )}
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <div className="bg-white sm:mt-[-64px]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-10rem] right-[5rem] h-[30rem] w-[70rem] bg-gradient-to-b from-[#bdffad] to-transparent rounded-full blur-[9rem] opacity-70" />
          <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-5" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-block mb-4">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full text-green-700 text-sm font-medium shadow-sm">
                Nos collections
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl lg:text-6xl">
              Collections <span className="block text-green-700">ZIPBAGS®</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-gray-700">
              Découvrez notre gamme complète de pochettes zippées stand-up (Doypack) conçues pour divers usages alimentaires et non alimentaires.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center space-x-1 p-2" aria-label="Tabs">
            <div
              className="bg-green-50 text-green-700 shadow-sm rounded-lg py-3 px-6 font-medium text-sm transition-all duration-200 flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Nos Collections</span>
            </div>
            <Link
              href="/products"
              className="bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-700 rounded-lg py-3 px-6 font-medium text-sm transition-all duration-200 flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>Tous les Produits</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Collections Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="pb-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Nos Collections
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Chaque collection est conçue pour répondre à des besoins spécifiques en matière d'emballage.
            </p>
          </div>
        </div>

        <ShopifyCollections />
      </div>

      {/* Features Section */}
      <div className="bg-green-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Pourquoi choisir ZIPBAGS®?
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
              Nos pochettes offrent une combinaison unique de qualité, de fonctionnalité et d'esthétique pour mettre en valeur vos produits.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Qualité Supérieure</h3>
              <p className="text-gray-500">
                Nos pochettes sont fabriquées avec des matériaux de haute qualité pour garantir la fraîcheur et la protection de vos produits.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Présentation Optimale</h3>
              <p className="text-gray-500">
                Nos pochettes avec fenêtre offrent une visibilité optimale de vos produits, améliorant leur présentation sur les étagères.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Durée de Conservation</h3>
              <p className="text-gray-500">
                Nos pochettes hermétiques et refermables prolongent la durée de conservation de vos produits et préservent leur fraîcheur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
