import { Metadata } from 'next';
import ProductsPageClient from '@/components/ProductsPageClient';
export const metadata: Metadata = {
  title: "Catalogue Produits - Emballages Flexibles Premium",
  description: "Découvrez notre gamme complète d'emballages flexibles : doypacks kraft, sachets zip, emballages alimentaires personnalisés. Plus de 100 produits disponibles avec livraison rapide en Tunisie.",
  keywords: [
    "catalogue emballages",
    "doypacks kraft tunisie",
    "sachets zip alimentaires",
    "emballages flexibles catalogue",
    "packaging personnalisé",
    "emballages café épices",
    "sachets kraft naturel",
    "emballages écologiques",
    "doypacks avec fenêtre",
    "emballages premium tunisie"
  ],
  openGraph: {
    title: "Catalogue Produits - Emballages Flexibles Premium | Packedin",
    description: "Plus de 100 emballages flexibles disponibles : doypacks kraft, sachets zip, emballages alimentaires personnalisés. Livraison rapide en Tunisie.",
    url: '/products',
    type: 'website',
    images: [
      {
        url: "/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp",
        width: 1200,
        height: 630,
        alt: "Catalogue Emballages Flexibles Packedin",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Catalogue Produits - Emballages Flexibles Premium | Packedin",
    description: "Plus de 100 emballages flexibles disponibles : doypacks kraft, sachets zip, emballages alimentaires personnalisés.",
    images: ["/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp"],
  },
  alternates: {
    canonical: "/products",
  },
};

// Add structured data for products page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Catalogue Emballages Flexibles - Packedin",
  "description": "Découvrez notre gamme complète d'emballages flexibles : doypacks kraft, sachets zip, emballages alimentaires personnalisés.",
  "url": "https://packedin.tn/products",
  "mainEntity": {
    "@type": "ItemList",
    "name": "Emballages Flexibles",
    "description": "Collection complète d'emballages flexibles premium",
    "numberOfItems": "100+",
    "itemListElement": [
      {
        "@type": "Product",
        "name": "Doypacks Kraft",
        "description": "Emballages doypacks en kraft naturel avec zip",
        "category": "Emballages Flexibles"
      },
      {
        "@type": "Product",
        "name": "Sachets Zip",
        "description": "Sachets avec fermeture zip pour produits alimentaires",
        "category": "Emballages Flexibles"
      }
    ]
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://packedin.tn"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Produits",
        "item": "https://packedin.tn/products"
      }
    ]
  }
};

export default function ProductsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="relative min-h-screen">
        {/* Innovative Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-green-50/30" />
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="h-full w-full" style={{
              backgroundImage: `
                linear-gradient(90deg, #10b981 1px, transparent 1px),
                linear-gradient(180deg, #10b981 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }} />
          </div>
        </div>

        <div className="relative mt-32 z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* SEO Optimized Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            {/* Stats Pills */}
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm border border-gray-200/50">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">100+ Produits</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm border border-gray-200/50">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">Livraison Rapide</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm border border-gray-200/50">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">Qualité Premium</span>
              </div>
            </div>

            {/* SEO Optimized Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4">
              <span className="block text-gray-900 mb-1 sm:mb-2">Notre</span>
              <span className="block bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                CATALOGUE
              </span>
            </h1>

            <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full mx-auto mb-3 sm:mb-4" />

            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              Découvrez notre gamme complète d'emballages flexibles innovants et durables : doypacks kraft, sachets zip, emballages alimentaires personnalisés
            </p>
          </div>

          <ProductsPageClient />
        </div>
      </div>
    </>
  );
}
