import AboutPageClient from '@/components/AboutPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos de Packedin | Leader en Emballages Flexibles Premium en Tunisie',
  description: 'Découvrez l\'histoire de Packedin, leader en emballages flexibles en Tunisie depuis 2021. Notre mission : fournir des solutions d\'emballage premium, écologiques et personnalisées pour valoriser votre marque. Qualité, innovation et service client d\'excellence.',
  keywords: [
    'à propos packedin',
    'histoire packedin tunisie',
    'emballages flexibles tunisie',
    'entreprise packaging tunisie',
    'leader emballages tunisie',
    'mission packedin',
    'valeurs packedin',
    'équipe packedin',
    'innovation packaging',
    'qualité emballages'
  ],
  openGraph: {
    title: 'À propos de Packedin | Leader en Emballages Flexibles Premium en Tunisie',
    description: 'Découvrez l\'histoire de Packedin, leader en emballages flexibles en Tunisie depuis 2021. Notre mission : fournir des solutions d\'emballage premium, écologiques et personnalisées.',
    url: '/about',
    type: 'website',
    images: [
      {
        url: '/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp',
        width: 1200,
        height: 630,
        alt: 'À propos de Packedin - Leader en emballages flexibles en Tunisie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'À propos de Packedin | Leader en Emballages Flexibles Premium en Tunisie',
    description: 'Découvrez l\'histoire de Packedin, leader en emballages flexibles en Tunisie depuis 2021.',
    images: ['/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp'],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
