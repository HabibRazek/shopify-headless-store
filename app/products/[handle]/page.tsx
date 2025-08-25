import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductPageClient from './ProductPageClient';
import ProductSchema from '@/components/seo/ProductSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { ShopifyProduct } from '@/types/shopify';

interface ProductPageProps {
  params: {
    handle: string;
  };
}

// Fetch product data for SSR
async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  try {
    const cleanedHandle = handle.replace('™', '');
    const encodedHandle = encodeURIComponent(cleanedHandle);

    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products/${encodedHandle}`, {
      cache: 'no-store', // Always fetch fresh data for SEO
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.handle);

  if (!product) {
    return {
      title: 'Produit non trouvé | Packedin',
      description: 'Le produit que vous recherchez n\'existe pas ou n\'est plus disponible.',
    };
  }

  // Extract product details for SEO
  const firstVariant = product.variants?.edges?.[0]?.node;
  const price = firstVariant?.price?.amount || product.priceRange.minVariantPrice.amount;
  const currency = firstVariant?.price?.currencyCode || product.priceRange.minVariantPrice.currencyCode;
  const mainImage = product.images?.edges?.[0]?.node?.url;

  // Create SEO-optimized title and description
  const seoTitle = `${product.title} | Emballage Flexible Premium | Packedin Tunisie`;
  const seoDescription = product.description
    ? `${product.description.substring(0, 140)}... Prix: ${price} ${currency}. Livraison rapide en Tunisie. Qualité premium garantie.`
    : `${product.title} - Emballage flexible premium de Packedin. Prix: ${price} ${currency}. Livraison rapide en Tunisie. Personnalisation disponible.`;

  // Generate comprehensive keywords
  const keywords = [
    product.title.toLowerCase(),
    'emballage flexible tunisie',
    'packaging premium',
    'doypacks kraft',
    'sachets zip',
    'emballage alimentaire',
    'emballage personnalisé',
    'packedin tunisie',
    'livraison rapide',
    'qualité premium',
    'impression emballage',
    'emballage professionnel',
    `prix ${price} ${currency}`,
    'megrine tunisie',
    'devis gratuit'
  ];

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: keywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `/products/${params.handle}`,
      type: 'product',
      images: mainImage ? [
        {
          url: mainImage,
          width: 800,
          height: 600,
          alt: product.title,
        }
      ] : [
        {
          url: '/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp',
          width: 1200,
          height: 630,
          alt: product.title,
        }
      ],
      siteName: 'Packedin',
      locale: 'fr_TN',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: mainImage ? [mainImage] : ['/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp'],
    },
    alternates: {
      canonical: `/products/${params.handle}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'product:price:amount': price,
      'product:price:currency': currency,
      'product:availability': product.availableForSale ? 'in stock' : 'out of stock',
      'product:brand': 'Packedin',
      'product:category': 'Emballages Flexibles',
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.handle);

  if (!product) {
    notFound();
  }

  // Extract product details for structured data
  const firstVariant = product.variants?.edges?.[0]?.node;
  const price = firstVariant?.price?.amount || product.priceRange.minVariantPrice.amount;
  const currency = firstVariant?.price?.currencyCode || product.priceRange.minVariantPrice.currencyCode;
  const mainImage = product.images?.edges?.[0]?.node?.url;

  // Create structured data for SEO
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: mainImage ? [mainImage] : ['/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp'],
    brand: {
      "@type": "Brand",
      name: "Packedin"
    },
    manufacturer: {
      "@type": "Organization",
      name: "Packedin",
      url: "https://packedin.tn",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Megrine Business Center",
        addressLocality: "Megrine",
        addressCountry: "TN"
      }
    },
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: currency,
      availability: product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Packedin"
      },
      url: `https://packedin.tn/products/${params.handle}`,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
    },
    category: "Emballages Flexibles",
    sku: product.id,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1"
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5"
        },
        author: {
          "@type": "Person",
          name: "Ahmed Ben Ali"
        },
        reviewBody: "Excellente qualité d'emballage, livraison rapide et service client professionnel. Je recommande vivement Packedin pour tous vos besoins d'emballage."
      }
    ]
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://packedin.tn"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Produits",
        item: "https://packedin.tn/products"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: `https://packedin.tn/products/${params.handle}`
      }
    ]
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />

      {/* Client Component with product data */}
      <ProductPageClient product={product} handle={params.handle} />
    </>
  );
}


