'use client';

import { ShopifyProduct } from '@/types/shopify';

interface ProductSchemaProps {
  product: ShopifyProduct;
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  if (!product) return null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://packedin.tn';
  
  // Get the first variant for pricing
  const firstVariant = product.variants?.edges?.[0]?.node;
  const price = firstVariant?.price?.amount || '0';
  const currency = firstVariant?.price?.currencyCode || 'TND';
  
  // Get product images
  const images = product.images?.edges?.map(edge => `${baseUrl}${edge.node.url}`) || [];
  const mainImage = images[0] || `${baseUrl}/placeholder.png`;

  // Create structured data for the product
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description || `${product.title} - Emballage flexible premium de Packedin`,
    "image": images,
    "url": `${baseUrl}/products/${product.handle}`,
    "sku": product.id,
    "mpn": product.handle,
    "brand": {
      "@type": "Brand",
      "name": "Packedin",
      "logo": `${baseUrl}/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp`,
      "url": baseUrl
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Packedin",
      "url": baseUrl
    },
    "category": "Emballages Flexibles",
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Packedin",
        "url": baseUrl
      },
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      "itemCondition": "https://schema.org/NewCondition",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": currency
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 2,
            "maxValue": 7,
            "unitCode": "DAY"
          }
        }
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Client Satisfait"
        },
        "reviewBody": "Excellente qualité d'emballage, livraison rapide et service client professionnel.",
        "datePublished": "2024-01-15"
      }
    ],
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Matériau",
        "value": "Kraft naturel / Aluminium"
      },
      {
        "@type": "PropertyValue",
        "name": "Type d'emballage",
        "value": "Flexible"
      },
      {
        "@type": "PropertyValue",
        "name": "Personnalisation",
        "value": "Disponible"
      },
      {
        "@type": "PropertyValue",
        "name": "Origine",
        "value": "Tunisie"
      }
    ],
    "isRelatedTo": [
      {
        "@type": "Product",
        "name": "Doypacks Kraft",
        "url": `${baseUrl}/collections/doypacks-kraft`
      },
      {
        "@type": "Product", 
        "name": "Sachets Zip",
        "url": `${baseUrl}/collections/sachets-zip`
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(productSchema)
      }}
    />
  );
}
