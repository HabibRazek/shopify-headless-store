import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Packedin - Emballages Flexibles Premium Tunisie',
    short_name: 'Packedin',
    description: 'Leader en emballages flexibles en Tunisie. Doypacks kraft, sachets zip, emballages alimentaires personnalisés. Qualité premium, livraison rapide.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#16a34a',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'fr-TN',
    categories: ['business', 'shopping', 'productivity'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
        purpose: 'any'
      }
    ],
    shortcuts: [
      {
        name: 'Catalogue Produits',
        short_name: 'Produits',
        description: 'Voir tous nos emballages flexibles',
        url: '/products',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }]
      },
      {
        name: 'Collections',
        short_name: 'Collections',
        description: 'Explorer nos collections spécialisées',
        url: '/collections',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }]
      },
      {
        name: 'Contact',
        short_name: 'Contact',
        description: 'Nous contacter pour un devis',
        url: '/contact',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }]
      },
      {
        name: 'Blog',
        short_name: 'Blog',
        description: 'Actualités et conseils emballages',
        url: '/blog',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }]
      }
    ],
    related_applications: [],
    prefer_related_applications: false,
    edge_side_panel: {
      preferred_width: 400
    }
  }
}
