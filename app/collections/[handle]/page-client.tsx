'use client';

import { useState, useEffect } from 'react';
import ProductGrid from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';
import { Package, Star, TrendingUp, Bell } from 'lucide-react';

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

// Enhanced Collection metadata mapping with rich descriptions
const COLLECTIONS_INFO: Record<string, CollectionInfo> = {
  'kraftview': {
    title: 'KraftView™ – Pochettes Zip Kraft Brun avec Fenêtre',
    description: 'Découvrez la collection KraftView™, notre gamme de pochettes zip stand-up kraft brun avec fenêtre transparente, alliant élégance naturelle et fonctionnalité optimale. Conçues pour offrir une présentation premium à vos produits, ces pochettes sont idéales pour les marques qui souhaitent se démarquer sur les étagères ou en e-commerce. Le kraft brun apporte un aspect authentique et écologique, tandis que la fenêtre transparente permet une excellente visibilité de vos produits. Fabriquées avec des matériaux multicouches haute barrière, elles assurent une conservation parfaite contre l\'humidité, l\'air et les UV. 🌿 Avantages de la gamme KraftView™ : Design naturel et authentique avec finition mate, Fenêtre claire pour mettre en valeur le contenu, Fermeture zip refermable + encoche de déchirement, Food grade (apte au contact alimentaire), maintien en rayon. Apte au contact alimentaire. Convient aux produits secs, poudres, cosmétiques, snacks, etc. Disponible en plusieurs tailles. 🌿 Utilisations recommandées : Snacks et superaliments, Thés, cafés, infusions, Épices, céréales, fruits secs, Produits de beauté en vrac, Échantillons professionnels'
  },
  'whiteview': {
    title: 'WhiteView™ – Pochettes Zip Kraft Blanc avec Fenêtre Mate',
    description: 'Explorez la collection WhiteView™, notre gamme premium de pochettes zip stand-up kraft blanc avec fenêtre mate, parfaites pour une présentation haut de gamme et sophistiquée. Ces pochettes incarnent l\'élégance et la pureté, idéales pour les marques premium qui exigent une présentation impeccable. Le kraft blanc offre une toile parfaite pour votre branding, tandis que la fenêtre mate ajoute une touche de raffinement unique. Fabriquées avec des matériaux de qualité supérieure, elles garantissent une protection optimale de vos produits. ✨ Avantages de la gamme WhiteView™ : Design épuré et premium avec finition mate exclusive, Fenêtre mate pour un effet sophistiqué, Fermeture zip haute qualité + encoche pratique, Surface idéale pour impression premium, Barrière multicouche pour conservation optimale. Apte au contact alimentaire certifié. Convient parfaitement aux produits cosmétiques, compléments alimentaires, thés premium, épices fines, produits biologiques, échantillons de luxe. 🎯 Applications recommandées : Cosmétiques et soins premium, Compléments alimentaires, Thés et infusions de luxe, Épices et condiments fins, Produits biologiques certifiés, Échantillons et coffrets cadeaux'
  },
  'kraftalu': {
    title: 'KraftAlu™ – Pochettes Zip Kraft avec Intérieur Aluminium',
    description: 'Découvrez la collection KraftAlu™, notre solution innovante de pochettes zip stand-up kraft avec intérieur aluminium, offrant la protection ultime pour vos produits sensibles. Cette gamme révolutionnaire combine l\'esthétique naturelle du kraft avec la performance technique de l\'aluminium, créant une barrière inégalée contre l\'humidité, l\'oxygène, la lumière et les arômes. Parfaites pour les produits nécessitant une conservation longue durée et une fraîcheur préservée. 🛡️ Avantages de la gamme KraftAlu™ : Barrière aluminium haute performance, Protection maximale contre humidité, oxygène et UV, Design kraft naturel et authentique, Fermeture zip étanche + encoche de déchirement, Conservation longue durée garantie, Apte au contact alimentaire certifié. Idéale pour café, thé, épices, compléments alimentaires, produits pharmaceutiques, cosmétiques sensibles. 🔬 Technologies avancées : Multicouche kraft/aluminium/PE, Étanchéité renforcée, Résistance aux perforations, Stabilité dimensionnelle, Test de migration conforme. Applications spécialisées : Café et thé premium, Épices et aromates, Compléments alimentaires, Produits pharmaceutiques, Cosmétiques actifs, Échantillons techniques'
  },
  'fullviewkraft': {
    title: 'FullViewKraft™ – Pochettes Stand Up Kraft avec Fenêtre Pleine',
    description: 'Explorez la collection FullViewKraft™, notre gamme exceptionnelle de pochettes stand-up kraft avec fenêtre pleine, conçues pour offrir une visibilité maximale de vos produits tout en conservant l\'authenticité du kraft naturel. Ces pochettes révolutionnaires permettent une présentation spectaculaire de vos produits, idéales pour les marques qui souhaitent créer un impact visuel fort en magasin ou en ligne. La fenêtre pleine transforme votre emballage en véritable vitrine, mettant en valeur couleurs, textures et qualité de vos produits. 🌟 Avantages de la gamme FullViewKraft™ : Fenêtre pleine pour visibilité maximale, Design kraft authentique et écologique, Présentation produit spectaculaire, Fermeture zip premium + encoche pratique, Stabilité debout optimale, Impact visuel garanti en rayon. Matériaux haute qualité, apte contact alimentaire, conservation optimale. Parfaite pour produits colorés, texturés, premium nécessitant mise en valeur visuelle. 🎨 Mise en valeur optimale : Fruits secs et noix colorés, Bonbons et confiseries artisanales, Thés et infusions aux couleurs vives, Épices et mélanges exotiques, Cosmétiques naturels, Produits artisanaux et bio, Créations culinaires premium'
  },
  'blackview': {
    title: 'BlackView™ – Pochettes Zip Noir avec Fenêtre Transparente',
    description: 'Découvrez la collection BlackView™, notre gamme de pochettes zip stand-up noires avec fenêtre transparente, alliant élégance, fonctionnalité et protection optimale. Conçues pour offrir une présentation premium à vos produits, ces pochettes sont idéales pour les marques qui souhaitent se démarquer sur les étagères ou en e-commerce. Le coloris noir mate apporte un aspect moderne et haut de gamme, tandis que la fenêtre transparente permet une excellente visibilité de vos produits. Fabriquées avec des matériaux multicouches haute barrière, elles assurent une conservation parfaite contre l\'humidité, l\'air et les UV. 🖤 Avantages de la gamme BlackView™ : Design noir élégant avec finition mate, Fenêtre claire pour mettre en valeur le contenu, Fermeture zip refermable + encoche de déchirement, Food grade (apte au contact alimentaire), maintien en rayon. Apte au contact alimentaire. Convient aux produits secs, poudres, cosmétiques, snacks, etc. Disponible en plusieurs tailles. 🖤 Utilisations recommandées : Snacks et superaliments, Thés, cafés, infusions, Épices, céréales, fruits secs, Produits de beauté en vrac, Échantillons professionnels'
  },
  'fullalu': {
    title: 'FullAlu™ – Pochettes Zip en Aluminium',
    description: 'Explorez la collection FullAlu™, notre gamme ultra-premium de pochettes zip entièrement en aluminium, offrant la protection maximale pour vos produits les plus sensibles et précieux. Cette collection représente le summum de la technologie d\'emballage, avec une barrière totale contre tous les facteurs de dégradation : humidité, oxygène, lumière UV, arômes et contaminations externes. Conçues pour les applications les plus exigeantes, ces pochettes garantissent une conservation parfaite et une durée de vie prolongée. 🥈 Avantages de la gamme FullAlu™ : Protection aluminium intégrale 360°, Barrière totale contre humidité, oxygène et UV, Design métallique premium et moderne, Fermeture zip haute sécurité + encoche, Conservation longue durée exceptionnelle, Résistance maximale aux perforations. Certifié apte contact alimentaire, normes pharmaceutiques. Idéal pour produits ultra-sensibles, haute valeur, conservation critique. ⚡ Performance technique : Étanchéité absolue garantie, Résistance thermique élevée, Stabilité dimensionnelle parfaite, Protection électrostatique, Tests de migration conformes. Applications critiques : Produits pharmaceutiques, Compléments alimentaires sensibles, Cosmétiques actifs premium, Échantillons de laboratoire, Produits techniques spécialisés, Conservations longue durée'
  }
};

export default function CollectionPage() {
  const [handle, setHandle] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Simple neutral background for all collections
  const getCollectionBgColor = (): string => {
    return 'bg-white'; // Clean white background for all collections
  };

  // Consistent text color for all collections
  const getTextColor = (): string => {
    return 'text-gray-900'; // Dark text for good readability
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

    // setMetadataHandle(simpleHandle); // Currently not used

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

          // Use descriptionHtml if available, otherwise fall back to description
          if (data.data.descriptionHtml) {
            setDescription(data.data.descriptionHtml);
          } else if (data.data.description) {
            setDescription(data.data.description);
          }
        } else {
          setProducts([]);
        }
      } catch {
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
    <div className="min-h-screen relative">
    

      {/* Simplified Collection Banner */}
      <div className="relative z-10 overflow-hidden mt-20">
        <div className={`w-full min-h-[50vh] flex items-center justify-center relative ${getCollectionBgColor()}`}>
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            {/* Simple Collection Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2  rounded-full"></div>
              <span className="text-sm font-semibold text-gray-700 tracking-wide">COLLECTION PREMIUM</span>
            </div>

            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black ${getTextColor()} mb-6 leading-tight`}>
              {title}
            </h1>



            {/* Simplified Collection Stats */}
            <div className="flex flex-wrap justify-center items-center gap-6">
              <div className="bg-gray-100 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    {products.length} {products.length === 1 ? 'Produit' : 'Produits'}
                  </span>
                </div>
              </div>

              <div className="bg-gray-100 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold text-gray-700">Qualité Premium</span>
                </div>
              </div>

              <div className="bg-gray-100 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Innovation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Products Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mt-[-100px] mb-4">
            Produits de la Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez tous les produits disponibles dans cette collection premium
          </p>

          <div className="mt-8 inline-flex items-center gap-3 bg-gray-100 px-6 py-3 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-700">
              {products.length} {products.length === 1 ? 'produit disponible' : 'produits disponibles'}
            </span>
          </div>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products.map(product => ({ node: product }))} className="lg:grid-cols-3" />
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="max-w-md mx-auto">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Collection en préparation</h3>
              <p className="text-gray-500 mb-6">
                Cette collection sera bientôt disponible avec de nouveaux produits innovants
              </p>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Bell className="mr-2 h-4 w-4" />
                Me notifier
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Dynamic Product Information Section from Shopify */}
      {description && (
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-green-50/30 py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="h-full w-full" style={{
              backgroundImage: `
                linear-gradient(90deg, #10b981 1px, transparent 1px),
                linear-gradient(180deg, #10b981 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }} />
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-100 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-200 rounded-full opacity-15 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-50 rounded-full opacity-25 animate-pulse delay-500"></div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              {/* Enhanced Content Container */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-8 md:p-12 lg:p-16">
                <div className="prose prose-lg max-w-none">
                  <div
                    className="shopify-description
                      [&>h1]:text-4xl [&>h1]:md:text-5xl [&>h1]:lg:text-6xl [&>h1]:font-black [&>h1]:text-gray-900 [&>h1]:mb-8 [&>h1]:text-center [&>h1]:leading-tight [&>h1]:tracking-tight
                      [&>h2]:text-3xl [&>h2]:md:text-4xl [&>h2]:font-bold [&>h2]:text-green-800 [&>h2]:mb-6 [&>h2]:mt-12 [&>h2]:text-center [&>h2]:relative [&>h2]:after:content-[''] [&>h2]:after:block [&>h2]:after:w-24 [&>h2]:after:h-1 [&>h2]:after:bg-gradient-to-r [&>h2]:after:from-green-500 [&>h2]:after:to-green-700 [&>h2]:after:mx-auto [&>h2]:after:mt-4 [&>h2]:after:rounded-full
                      [&>h3]:text-2xl [&>h3]:md:text-3xl [&>h3]:font-bold [&>h3]:text-gray-800 [&>h3]:mb-6 [&>h3]:mt-10 [&>h3]:text-center
                      [&>p]:text-lg [&>p]:md:text-xl [&>p]:mb-8 [&>p]:leading-relaxed [&>p]:text-gray-700 [&>p]:text-center [&>p]:max-w-4xl [&>p]:mx-auto
                      [&>ul]:grid [&>ul]:md:grid-cols-2 [&>ul]:gap-4 [&>ul]:mb-10 [&>ul]:mt-8
                      [&>li]:flex [&>li]:items-start [&>li]:gap-4 [&>li]:p-4 [&>li]:bg-green-50 [&>li]:rounded-xl [&>li]:border [&>li]:border-green-100 [&>li]:shadow-sm [&>li]:transition-all [&>li]:duration-300 [&>li]:hover:shadow-md [&>li]:hover:bg-green-100/50
                      [&>li]:before:content-['✓'] [&>li]:before:text-green-600 [&>li]:before:font-bold [&>li]:before:text-xl [&>li]:before:bg-white [&>li]:before:rounded-full [&>li]:before:w-8 [&>li]:before:h-8 [&>li]:before:flex [&>li]:before:items-center [&>li]:before:justify-center [&>li]:before:shadow-sm [&>li]:before:border [&>li]:before:border-green-200 [&>li]:before:flex-shrink-0
                      [&>li]:text-gray-800 [&>li]:font-medium [&>li]:text-base
                      [&>strong]:font-bold [&>strong]:text-gray-900 [&>strong]:bg-yellow-100 [&>strong]:px-2 [&>strong]:py-1 [&>strong]:rounded [&>strong]:text-sm
                      [&>blockquote]:bg-gradient-to-r [&>blockquote]:from-green-700 [&>blockquote]:via-green-500 [&>blockquote]:to-[#77db19bd] [&>blockquote]:text-white [&>blockquote]:p-8 [&>blockquote]:rounded-2xl [&>blockquote]:text-center [&>blockquote]:shadow-xl [&>blockquote]:mt-12 [&>blockquote]:mb-8
                      [&>blockquote>p]:text-white [&>blockquote>p]:text-xl [&>blockquote>p]:font-semibold [&>blockquote>p]:mb-4 [&>blockquote>p]:leading-relaxed
                      [&_em]:text-white [&_em]:opacity-90 [&_em]:text-lg [&_em]:not-italic [&_em]:font-medium"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </div>

                {/* Enhanced Call-to-Action Section */}
                <div className="mt-16 text-center">
                  <div className="inline-flex items-center gap-2 bg-green-100 px-6 py-3 rounded-full mb-8">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-800 font-semibold text-lg">Emballage Premium Disponible</span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-green-800 mb-2">Livraison Rapide</h4>
                      <p className="text-green-700">Expédition sous 24-48h partout en Tunisie</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-green-800 mb-2">Qualité Garantie</h4>
                      <p className="text-green-700">Matériaux premium et finition professionnelle</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-green-800 mb-2">Support Expert</h4>
                      <p className="text-green-700">Conseil personnalisé pour vos projets</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
