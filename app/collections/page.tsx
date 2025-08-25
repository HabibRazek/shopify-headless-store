import { Metadata } from 'next';
import CollectionsPageClient from './CollectionsPageClient';

export const metadata: Metadata = {
  title: 'Collections Emballages Flexibles | Doypacks, Sachets Zip & Plus | Packedin Tunisie',
  description: 'Explorez nos collections d\'emballages flexibles premium : doypacks kraft, sachets zip, emballages café, épices, beauté, snacks. Plus de 9 collections spécialisées avec personnalisation disponible. Livraison rapide en Tunisie.',
  keywords: [
    'collections emballages tunisie',
    'doypacks kraft collection',
    'sachets zip collection',
    'emballages café collection',
    'emballages épices collection',
    'emballages beauté collection',
    'emballages snacks collection',
    'emballages tisane collection',
    'emballages chocolat collection',
    'emballages croquettes collection',
    'collections packaging tunisie',
    'gamme emballages flexibles'
  ],
  openGraph: {
    title: 'Collections Emballages Flexibles | Doypacks, Sachets Zip & Plus | Packedin',
    description: 'Explorez nos collections d\'emballages flexibles premium : doypacks kraft, sachets zip, emballages spécialisés. Plus de 9 collections avec personnalisation.',
    url: '/collections',
    type: 'website',
    images: [
      {
        url: '/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp',
        width: 1200,
        height: 630,
        alt: 'Collections Emballages Flexibles Packedin Tunisie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Collections Emballages Flexibles | Doypacks, Sachets Zip & Plus | Packedin',
    description: 'Explorez nos collections d\'emballages flexibles premium : doypacks kraft, sachets zip, emballages spécialisés.',
    images: ['/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp'],
  },
  alternates: {
    canonical: '/collections',
  },
};

export default function CollectionsPage() {
  return <CollectionsPageClient />;
}
