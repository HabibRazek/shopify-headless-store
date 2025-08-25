import ContactPageClient from '@/components/ContactPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Packedin | Devis Gratuit Emballages Flexibles Tunisie | 29 362 224',
  description: 'Contactez Packedin pour vos emballages flexibles en Tunisie. ☎️ 29 362 224 📱 WhatsApp 20 387 333 ✉️ packedin.tn@gmail.com 📍 Megrine Business Center. Devis gratuit, livraison rapide, conseil personnalisé.',
  keywords: [
    'contact packedin tunisie',
    'devis emballage gratuit',
    'téléphone packedin',
    'whatsapp packedin',
    'email packedin',
    'adresse packedin megrine',
    'contact emballage flexible',
    'conseil packaging tunisie',
    '29 362 224',
    'packedin.tn@gmail.com',
    'megrine business center',
    'contact doypacks',
    'contact sachets zip'
  ],
  openGraph: {
    title: 'Contact Packedin | Devis Gratuit Emballages Flexibles Tunisie',
    description: 'Contactez nos experts en emballage flexible. ☎️ 29 362 224 📱 WhatsApp 20 387 333 ✉️ packedin.tn@gmail.com 📍 Megrine Business Center. Devis gratuit, conseil personnalisé.',
    type: 'website',
    locale: 'fr_TN',
    url: '/contact',
    siteName: 'Packedin',
    images: [
      {
        url: '/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp',
        width: 1200,
        height: 630,
        alt: 'Contact Packedin - Emballages Flexibles Tunisie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Packedin | Devis Gratuit Emballages Flexibles Tunisie',
    description: 'Contactez nos experts en emballage flexible. Devis gratuit, conseil personnalisé. Megrine Business Center, Tunisie.',
    images: ['/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp'],
  },
  alternates: {
    canonical: '/contact',
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
