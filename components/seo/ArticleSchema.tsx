'use client';

interface BlogPost {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string;
  };
  featuredImage?: string;
  category?: {
    name: string;
  };
  tags?: Array<{
    name: string;
  }>;
}

interface ArticleSchemaProps {
  post: BlogPost;
}

export default function ArticleSchema({ post }: ArticleSchemaProps) {
  if (!post) return null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://packedin.tn';
  const articleUrl = `${baseUrl}/blog/${post.slug}`;
  const imageUrl = post.featuredImage || `${baseUrl}/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || post.content.substring(0, 160),
    "image": [imageUrl],
    "url": articleUrl,
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.author?.name || "Équipe Packedin",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Packedin",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp`,
        "width": 600,
        "height": 60
      },
      "url": baseUrl
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "articleSection": post.category?.name || "Emballages",
    "keywords": post.tags?.map(tag => tag.name).join(", ") || "emballages, packaging, Tunisie",
    "wordCount": post.content.split(' ').length,
    "inLanguage": "fr-TN",
    "about": {
      "@type": "Thing",
      "name": "Emballages Flexibles",
      "description": "Solutions d'emballage flexible pour l'industrie alimentaire et cosmétique"
    },
    "mentions": [
      {
        "@type": "Organization",
        "name": "Packedin",
        "url": baseUrl
      }
    ],
    "isPartOf": {
      "@type": "Blog",
      "name": "Blog Packedin",
      "url": `${baseUrl}/blog`,
      "description": "Actualités et conseils sur les emballages flexibles en Tunisie"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleSchema)
      }}
    />
  );
}
