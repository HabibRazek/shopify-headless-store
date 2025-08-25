import { Metadata } from 'next';
import BlogPageClient from './BlogPageClient';

export const metadata: Metadata = {
  title: 'Blog Packedin | Actualités Emballages Flexibles & Packaging Tunisie',
  description: 'Découvrez les dernières actualités, conseils et tendances en emballages flexibles sur le blog Packedin. Articles sur les doypacks, sachets zip, packaging alimentaire, innovations et bonnes pratiques en Tunisie.',
  keywords: [
    'blog emballages tunisie',
    'actualités packaging',
    'conseils emballages flexibles',
    'tendances packaging 2024',
    'doypacks actualités',
    'sachets zip blog',
    'emballages alimentaires conseils',
    'packaging écologique tunisie',
    'innovations emballages',
    'blog packedin',
    'articles packaging',
    'guides emballages'
  ],
  openGraph: {
    title: 'Blog Packedin | Actualités Emballages Flexibles & Packaging Tunisie',
    description: 'Découvrez les dernières actualités, conseils et tendances en emballages flexibles. Articles sur les doypacks, sachets zip, packaging alimentaire et innovations.',
    url: '/blog',
    type: 'website',
    images: [
      {
        url: '/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp',
        width: 1200,
        height: 630,
        alt: 'Blog Packedin - Actualités Emballages Flexibles Tunisie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Packedin | Actualités Emballages Flexibles & Packaging Tunisie',
    description: 'Découvrez les dernières actualités, conseils et tendances en emballages flexibles.',
    images: ['/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp'],
  },
  alternates: {
    canonical: '/blog',
    types: {
      'application/rss+xml': '/blog/rss.xml',
    },
  },
};

export default function BlogPage() {
  return <BlogPageClient />;
}
