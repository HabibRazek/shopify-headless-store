import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import ConditionalLayout from "@/components/ConditionalLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Packedin - Emballages Flexibles Premium en Tunisie | Doypacks & Sachets Personnalisés",
    template: "%s | Packedin - Emballages Flexibles Premium"
  },
  description: "Packedin, leader en emballages flexibles en Tunisie. Doypacks kraft, sachets zip, emballages alimentaires personnalisés. Qualité premium, livraison rapide, impression sur mesure. Contactez-nous pour un devis gratuit.",
  keywords: [
    "emballages flexibles tunisie",
    "doypacks kraft",
    "sachets zip personnalisés",
    "emballages alimentaires",
    "packaging flexible",
    "impression emballage",
    "sachets kraft naturel",
    "emballages écologiques",
    "packaging sur mesure tunisie",
    "doypacks avec zip",
    "emballages café",
    "sachets épices",
    "packaging produits bio",
    "emballages premium",
    "packedin tunisie"
  ],
  authors: [{ name: "Packedin" }],
  creator: "Packedin",
  publisher: "Packedin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://packedin.tn'),
  alternates: {
    canonical: '/',
    languages: {
      'fr-TN': '/fr',
      'ar-TN': '/ar',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_TN',
    url: '/',
    title: 'Packedin - Emballages Flexibles Premium en Tunisie | Doypacks & Sachets Personnalisés',
    description: 'Leader en emballages flexibles en Tunisie. Doypacks kraft, sachets zip, emballages alimentaires personnalisés. Qualité premium, livraison rapide, impression sur mesure. Contactez-nous pour un devis gratuit.',
    siteName: 'Packedin',
    images: [
      {
        url: '/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp',
        width: 1200,
        height: 630,
        alt: 'Packedin - Emballages Flexibles Premium en Tunisie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Packedin - Emballages Flexibles Premium en Tunisie | Doypacks & Sachets',
    description: 'Leader en emballages flexibles en Tunisie. Doypacks kraft, sachets zip, emballages alimentaires personnalisés. Qualité premium, livraison rapide.',
    images: ['/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp'],
    creator: '@packedin_tn',
    site: '@packedin_tn',
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
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
    yandex: process.env.YANDEX_VERIFICATION_ID,
    yahoo: process.env.YAHOO_VERIFICATION_ID,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icon.svg',
        color: '#16a34a',
      },
    ],
  },
  category: 'business',
  classification: 'Emballages Flexibles et Packaging',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-TN">
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Organization", "LocalBusiness"],
              "name": "Packedin",
              "alternateName": "Kings Worldwide Distribution",
              "url": "https://packedin.tn",
              "logo": "https://packedin.tn/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp",
              "image": "https://packedin.tn/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp",
              "description": "Leader en emballages flexibles en Tunisie. Doypacks kraft, sachets zip, emballages alimentaires personnalisés. Qualité premium, livraison rapide, impression sur mesure.",
              "slogan": "Votre partenaire en emballages flexibles premium",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Megrine Business Center",
                "addressLocality": "Megrine",
                "addressRegion": "Ben Arous",
                "postalCode": "2033",
                "addressCountry": "TN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "36.7372",
                "longitude": "10.2314"
              },
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+216-29-362-224",
                  "contactType": "customer service",
                  "email": "packedin.tn@gmail.com",
                  "availableLanguage": ["French", "Arabic"],
                  "areaServed": "TN"
                },
                {
                  "@type": "ContactPoint",
                  "telephone": "+216-20-387-333",
                  "contactType": "sales",
                  "availableLanguage": ["French", "Arabic"],
                  "areaServed": "TN"
                },
                {
                  "@type": "ContactPoint",
                  "telephone": "+216-50-095-115",
                  "contactType": "technical support",
                  "availableLanguage": ["French", "Arabic"],
                  "areaServed": "TN"
                }
              ],
              "sameAs": [
                "https://facebook.com/packedin.tn",
                "https://instagram.com/packedin.tn",
                "https://linkedin.com/company/packedin-tn"
              ],
              "foundingDate": "2021",
              "industry": "Packaging and Containers",
              "naics": "326112",
              "keywords": "emballages flexibles, doypacks kraft, sachets zip, packaging alimentaire, emballages personnalisés, impression emballage, Tunisie",
              "serviceArea": {
                "@type": "Country",
                "name": "Tunisia"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Emballages Flexibles",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Doypacks Kraft",
                      "description": "Emballages doypacks en kraft naturel avec ou sans fenêtre"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Sachets Zip",
                      "description": "Sachets refermables avec fermeture zip"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Emballages Alimentaires",
                      "description": "Emballages spécialisés pour produits alimentaires"
                    }
                  }
                ]
              },
              "priceRange": "€€",
              "currenciesAccepted": "TND, EUR",
              "paymentAccepted": "Cash, Credit Card, Bank Transfer"
            })
          }}
        />

        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#16a34a" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="msapplication-TileImage" content="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Packedin" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Business & Location Meta Tags */}
        <meta name="geo.region" content="TN-11" />
        <meta name="geo.placename" content="Megrine, Tunisia" />
        <meta name="geo.position" content="36.7372;10.2314" />
        <meta name="ICBM" content="36.7372, 10.2314" />

        {/* Language & Content Meta Tags */}
        <meta name="language" content="French" />
        <meta name="content-language" content="fr-TN" />
        <meta name="audience" content="all" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />

        {/* Business Category Meta Tags */}
        <meta name="category" content="business,packaging,manufacturing,e-commerce" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="packaging buyers, food industry, cosmetics industry, businesses in Tunisia" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ShopProvider>
            <CartProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <Toaster />
            </CartProvider>
          </ShopProvider>
        </Providers>
      </body>
    </html>
  );
}
