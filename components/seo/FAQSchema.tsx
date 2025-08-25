'use client';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs?: FAQItem[];
}

export default function FAQSchema({ faqs }: FAQSchemaProps) {
  // Default FAQs for Packedin if none provided
  const defaultFAQs: FAQItem[] = [
    {
      question: "Quels types d'emballages flexibles proposez-vous ?",
      answer: "Nous proposons une large gamme d'emballages flexibles : doypacks kraft, sachets zip, emballages alimentaires, emballages pour café, épices, snacks, produits de beauté et bien plus. Tous nos emballages peuvent être personnalisés selon vos besoins."
    },
    {
      question: "Livrez-vous partout en Tunisie ?",
      answer: "Oui, nous livrons dans toute la Tunisie. Les délais de livraison varient entre 2 à 7 jours selon votre localisation. La livraison est gratuite pour les commandes importantes."
    },
    {
      question: "Proposez-vous des emballages personnalisés ?",
      answer: "Absolument ! Nous offrons des services de personnalisation complets : impression de votre logo, choix des couleurs, dimensions sur mesure, et différents types de fermetures. Contactez-nous pour un devis personnalisé."
    },
    {
      question: "Quels sont vos délais de production ?",
      answer: "Les délais de production varient selon le type d'emballage et la personnalisation demandée. En général, comptez 1 à 3 jours pour la préparation et 2 à 7 jours pour la livraison."
    },
    {
      question: "Vos emballages sont-ils écologiques ?",
      answer: "Oui, nous proposons des emballages écologiques en kraft naturel et d'autres matériaux respectueux de l'environnement. Nous nous engageons dans une démarche de développement durable."
    },
    {
      question: "Comment obtenir un devis ?",
      answer: "Vous pouvez obtenir un devis gratuit en nous contactant par téléphone au 29 362 224, par email à packedin.tn@gmail.com, ou en utilisant notre formulaire de contact sur le site web."
    },
    {
      question: "Quelles sont vos conditions de paiement ?",
      answer: "Nous acceptons les paiements en espèces, par carte bancaire et par virement bancaire. Pour les entreprises, nous proposons des conditions de paiement adaptées."
    },
    {
      question: "Avez-vous un minimum de commande ?",
      answer: "Oui, nous avons un minimum de commande qui varie selon le type d'emballage. Pour les emballages personnalisés, le minimum est généralement de 300 unités. Contactez-nous pour plus de détails."
    }
  ];

  const faqItems = faqs || defaultFAQs;

  if (!faqItems || faqItems.length === 0) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema)
      }}
    />
  );
}
