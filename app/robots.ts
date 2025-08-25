import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://packedin.tn'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/products',
          '/collections',
          '/blog',
          '/about',
          '/contact',
          '/auth/signin',
          '/auth/signup',
          '/mentions-legales',
          '/politique-confidentialite',
          '/conditions-generales',
        ],
        disallow: [
          '/api/',
          '/auth/error',
          '/checkout/success',
          '/profile',
          '/admin/',
          '/_next/',
          '/uploads/receipts/',
          '/print-service',
          '/*.json$',
          '/manifest.json',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/products',
          '/collections',
          '/blog',
          '/about',
          '/contact',
        ],
        disallow: [
          '/api/',
          '/auth/',
          '/checkout/',
          '/profile',
          '/admin/',
          '/uploads/receipts/',
          '/print-service',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/products',
          '/collections',
          '/blog',
          '/about',
          '/contact',
        ],
        disallow: [
          '/api/',
          '/auth/',
          '/checkout/',
          '/profile',
          '/admin/',
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
