import ContactPageClient from '@/components/ContactPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Packedin - Emballages Flexibles en Tunisie',
  description: 'Contactez Packedin pour vos besoins d\'emballage flexible en Tunisie. Téléphone, WhatsApp, email. Située à Nabeul, Avenue Darghouth.',
  keywords: 'contact packedin, emballage tunisie contact, devis emballage, nabeul, avenue darghouth, packaging tunisie',
  openGraph: {
    title: 'Contact Packedin - Expert en Emballages Flexibles',
    description: 'Contactez nos experts en emballage flexible. Devis gratuit, conseil personnalisé. Pacha Jasmin, Avenue Darghouth, Nabeul.',
    type: 'website',
    locale: 'fr_TN',
    url: 'https://packedin.tn/contact',
    siteName: 'Packedin',
    images: [
      {
        url: 'https://packedin.tn/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp',
        width: 1200,
        height: 630,
        alt: 'Packedin - Contact',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Packedin - Expert en Emballages Flexibles',
    description: 'Contactez nos experts en emballage flexible. Devis gratuit, conseil personnalisé.',
    images: ['https://packedin.tn/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp'],
  },
  alternates: {
    canonical: 'https://packedin.tn/contact',
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
};

export default function ContactPage() {
  return <ContactPageClient />;
}
