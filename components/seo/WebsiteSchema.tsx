'use client';

export default function WebsiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://packedin.tn';

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Packedin - Emballages Flexibles Premium en Tunisie",
    "alternateName": "Packedin",
    "url": baseUrl,
    "description": "Leader en emballages flexibles en Tunisie. Doypacks kraft, sachets zip, emballages alimentaires personnalisés. Qualité premium, livraison rapide, impression sur mesure.",
    "inLanguage": "fr-TN",
    "publisher": {
      "@type": "Organization",
      "name": "Packedin",
      "url": baseUrl,
      "logo": `${baseUrl}/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp`
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/products?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      {
        "@type": "OrderAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/contact`
        },
        "object": {
          "@type": "Product",
          "name": "Emballages Flexibles Personnalisés"
        }
      }
    ],
    "mainEntity": {
      "@type": "ItemList",
      "name": "Catégories d'emballages",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "ProductGroup",
            "name": "Doypacks Kraft",
            "url": `${baseUrl}/collections/doypacks-kraft`,
            "description": "Emballages doypacks en kraft naturel avec ou sans fenêtre"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "ProductGroup",
            "name": "Sachets Zip",
            "url": `${baseUrl}/collections/sachets-zip`,
            "description": "Sachets refermables avec fermeture zip"
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@type": "ProductGroup",
            "name": "Emballages Café",
            "url": `${baseUrl}/collections/emballages-cafe`,
            "description": "Emballages spécialisés pour café et torréfaction"
          }
        },
        {
          "@type": "ListItem",
          "position": 4,
          "item": {
            "@type": "ProductGroup",
            "name": "Emballages Épices",
            "url": `${baseUrl}/collections/emballages-epices`,
            "description": "Emballages pour épices et condiments"
          }
        },
        {
          "@type": "ListItem",
          "position": 5,
          "item": {
            "@type": "ProductGroup",
            "name": "Emballages Beauté",
            "url": `${baseUrl}/collections/emballages-beaute`,
            "description": "Emballages pour produits cosmétiques et de beauté"
          }
        }
      ]
    },
    "about": {
      "@type": "Thing",
      "name": "Emballages Flexibles",
      "description": "Solutions d'emballage flexible pour l'industrie alimentaire, cosmétique et pharmaceutique en Tunisie"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Businesses, Food Industry, Cosmetics Industry, Pharmaceutical Industry",
      "geographicArea": {
        "@type": "Country",
        "name": "Tunisia"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteSchema)
      }}
    />
  );
}
