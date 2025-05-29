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
  },
  'fullalu': {
    title: 'FullAlu™ – Pochettes Zip en Aluminium',
    description: 'Pochettes zippées entièrement en aluminium, offrant une barrière optimale contre l\'humidité, l\'oxygène et la lumière pour une conservation parfaite. Idéales pour les produits sensibles nécessitant une protection maximale.'
  }
};

export default function CollectionPage() {
  const [handle, setHandle] = useState<string>('');
  const [metadataHandle, setMetadataHandle] = useState<string>('');
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
      case 'fullalu':
        return 'bg-slate-300'; // Silver/metallic for aluminum
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

    // Use the original handle for API calls - no simplification needed
    // The API will handle the normalization
    setHandle(decodedHandle);

    // Extract a simple handle for metadata lookup
    let simpleHandle = decodedHandle.toLowerCase();

    // Map complex handles to simple ones for metadata
    if (simpleHandle.includes('kraftalu')) simpleHandle = 'kraftalu';
    else if (simpleHandle.includes('kraftview')) simpleHandle = 'kraftview';
    else if (simpleHandle.includes('whiteview')) simpleHandle = 'whiteview';
    else if (simpleHandle.includes('fullviewkraft')) simpleHandle = 'fullviewkraft';
    else if (simpleHandle.includes('blackview')) simpleHandle = 'blackview';
    else if (simpleHandle.includes('fullalu')) simpleHandle = 'fullalu';

    setMetadataHandle(simpleHandle);

    // Set collection metadata from our mapping
    if (COLLECTIONS_INFO[simpleHandle]) {
      const info = COLLECTIONS_INFO[simpleHandle];
      setTitle(info.title);
      setDescription(info.description);
    } else {
      // Default values if collection not found in our mapping
      setTitle(decodedHandle.charAt(0).toUpperCase() + decodedHandle.slice(1));
      setDescription('');
    }
  }, []);

  // Step 2: Fetch products for the specific collection
  useEffect(() => {
    if (!handle) return;

    async function fetchCollectionProducts() {
      try {
        setIsLoading(true);
        // Use the new collections API to fetch products by collection handle
        // First try with the original URL handle
        const pathParts = window.location.pathname.split('/');
        const originalHandle = pathParts[pathParts.length - 1];

        const response = await fetch(`/api/collections/${originalHandle}`);
        const data = await response.json();

        if (data.success && data.data?.products) {
          const collectionProducts = data.data.products;

          setProducts(collectionProducts);

          // If we got collection data from the API, update our metadata
          if (data.data.title) {
            setTitle(data.data.title);
          }

          if (data.data.description) {
            setDescription(data.data.description);
          }
        } else {
          setProducts([]);
        }
      } catch (error) {
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
      <div className={`w-full h-64 md:h-80 lg:h-96 flex items-center justify-center ${getCollectionBgColor(metadataHandle)}`}>
        <div className="text-center px-4">
          <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${getTextColor(metadataHandle)} mb-4`}>
            {title}
          </h1>
          {description && (
            <p className={`${getTextColor(metadataHandle)} text-sm md:text-base max-w-3xl mx-auto opacity-80`}>
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
