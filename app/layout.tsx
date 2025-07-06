import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { CartProvider } from "@/context/CartContext";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

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
    title: 'Packedin - Emballages Flexibles Premium en Tunisie',
    description: 'Leader en emballages flexibles en Tunisie. Doypacks kraft, sachets zip, emballages alimentaires personnalisés. Qualité premium, livraison rapide.',
    siteName: 'Packedin',
    images: [
      {
        url: '/packedin-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Packedin - Emballages Flexibles Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Packedin - Emballages Flexibles Premium en Tunisie',
    description: 'Leader en emballages flexibles en Tunisie. Doypacks kraft, sachets zip, emballages alimentaires personnalisés.',
    images: ['/packedin-twitter-image.jpg'],
    creator: '@packedin_tn',
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
    icon: '/packedin.ico',
    shortcut: '/packedin.ico',
    apple: '/packedin.ico',
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
              "@type": "Organization",
              "name": "Packedin",
              "url": "https://packedin.tn",
              "logo": "https://packedin.tn/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp",
              "description": "Leader en emballages flexibles en Tunisie. Doypacks kraft, sachets zip, emballages alimentaires personnalisés.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "TN",
                "addressLocality": "Tunis",
                "addressRegion": "Tunis"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+216-XX-XXX-XXX",
                "contactType": "customer service",
                "email": "packedin.tn@gmail.com",
                "availableLanguage": ["French", "Arabic"]
              },
              "sameAs": [
                "https://facebook.com/packedin.tn",
                "https://instagram.com/packedin.tn",
                "https://linkedin.com/company/packedin-tn"
              ],
              "foundingDate": "2021",
              "industry": "Packaging and Containers",
              "keywords": "emballages flexibles, doypacks, sachets zip, packaging alimentaire, Tunisie"
            })
          }}
        />

        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#16a34a" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Packedin" />
        <meta name="mobile-web-app-capable" content="yes" />

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
              <div className="sm:block hidden">
                <TopBar />
              </div>
              <Navbar />
              <main className="pt-16 sm:pt-20 md:pt-24 lg:pt-28">
                {children}
              </main>
              <Footer />
              <Toaster />
            </CartProvider>
          </ShopProvider>
        </Providers>
      </body>
    </html>
  );
}
