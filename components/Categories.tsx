'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Package, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Collection data mapping all 9 images to collection handles and metadata
// First 5 collections have actual products, others are coming soon
const COLLECTION_CATEGORIES = [
  // COLLECTIONS WITH PRODUCTS (Working Shopify collections)
  {
    id: 'kraftview',
    title: 'KraftView™',
    subtitle: 'Pochettes Zip Kraft Brun avec Fenêtre',
    description: 'Emballages écologiques en kraft avec fenêtre transparente pour une présentation optimale de vos produits.',
    image: '/images/collections/kraftview-collection-doypacks.jpeg',
    handle: 'kraftview™-pochettes-zip-kraft-brun-avec-fenetre-transparente',
    color: 'from-amber-50 to-orange-50',
    accent: 'text-amber-700',
    badge: 'Écologique',
    hasProducts: true
  },
  {
    id: 'blackview',
    title: 'BlackView™',
    subtitle: 'Pochettes Zip Noir avec Fenêtre',
    description: 'Design élégant et moderne avec finition mate pour un impact visuel maximal.',
    image: '/images/collections/blackview-collection-doypacks.jpeg',
    handle: 'blackview™-pochettes-zip-noir-avec-fenetre-transparente',
    color: 'from-gray-50 to-slate-50',
    accent: 'text-gray-700',
    badge: 'Premium',
    hasProducts: true
  },
  {
    id: 'kraftalu',
    title: 'KraftAlu™',
    subtitle: 'Pochette Zip Kraft avec intérieur Aluminium',
    description: 'Combinaison parfaite entre esthétique kraft et protection aluminium.',
    image: '/images/collections/kraftalu-collection-doypacks.jpeg',
    handle: 'kraftalu™-pochette-zip-kraft-avec-interieur-aluminium',
    color: 'from-emerald-50 to-green-50',
    accent: 'text-emerald-700',
    badge: 'Hybride',
    hasProducts: true
  },
  {
    id: 'whiteview',
    title: 'WhiteView™',
    subtitle: 'Pochettes Zip Kraft Blanc avec Fenêtre Mate',
    description: 'Pureté et élégance pour une présentation raffinée de vos produits premium.',
    image: '/images/collections/whiteview-collection-doypacks.jpeg',
    handle: 'whiteview',
    color: 'from-blue-50 to-indigo-50',
    accent: 'text-blue-700',
    badge: 'Élégant',
    hasProducts: true
  },
  {
    id: 'fullviewkraft',
    title: 'FullViewKraft™',
    subtitle: 'Pochettes Stand Up Kraft avec fenêtre pleine',
    description: 'Visibilité maximale avec fenêtre frontale intégrale pour une exposition optimale.',
    image: '/images/collections/kraftview-collection-doypacks.jpeg', // Using kraftview image as placeholder
    handle: 'fullviewkraft™-pochettes-stand-up-kraft-avec-fenetre-pleine',
    color: 'from-green-50 to-emerald-50',
    accent: 'text-green-700',
    badge: 'Visibilité Max',
    hasProducts: true
  },

  // MORE COLLECTIONS WITH PRODUCTS
  {
    id: 'fullviewalu',
    title: 'FullViewAlu™',
    subtitle: 'Pochettes Zip Aluminisées avec Face Transparente',
    description: 'Protection maximale avec barrière aluminium et fenêtre pour la visibilité produit.',
    image: '/images/collections/aluview-collection-doypacks.jpeg',
    handle: 'fullviewalu™-pochettes-zip-aluminisees-avec-face-transparente',
    color: 'from-slate-50 to-gray-50',
    accent: 'text-slate-700',
    badge: 'Protection+',
    hasProducts: true
  },
  {
    id: 'fullalu',
    title: 'FullAlu™',
    subtitle: 'Pochettes Zip en Aluminium',
    description: 'Protection ultime avec aluminium intégral pour les produits les plus sensibles.',
    image: '/images/collections/fullalu-collection-doypacks.jpeg',
    handle: 'fullalu™-pochettes-zip-en-aluminium-1',
    color: 'from-zinc-50 to-slate-50',
    accent: 'text-zinc-700',
    badge: 'Ultra Protection',
    hasProducts: true
  },
  {
    id: 'fulltrans',
    title: 'FullTrans™',
    subtitle: 'Pochettes Stand Up Transparentes Givrées',
    description: 'Visibilité totale du produit avec matériaux transparents givrés de haute qualité.',
    image: '/images/collections/fulltrans-collection-doypacks.jpeg',
    handle: 'fulltrans™-pochettes-stand-up-transparentes-givrees',
    color: 'from-cyan-50 to-blue-50',
    accent: 'text-cyan-700',
    badge: 'Transparent',
    hasProducts: true
  },
  // COLLECTIONS COMING SOON (Will check for products later)
  {
    id: 'spout-pouch',
    title: 'Spout Pouch',
    subtitle: 'Pochettes avec Bec Verseur',
    description: 'Solution pratique pour liquides et produits versables avec bec intégré.',
    image: '/images/collections/spout-pouch-collection-doypacks.jpeg',
    handle: 'spout-pouch-pochettes-avec-bec-verseur',
    color: 'from-teal-50 to-cyan-50',
    accent: 'text-teal-700',
    badge: 'Pratique',
    hasProducts: true // Let's test this
  },
  {
    id: 'sac-kraft',
    title: 'Sacs Kraft',
    subtitle: 'Sacs en Papier Kraft',
    description: 'Solutions d\'emballage écologiques en papier kraft pour tous vos besoins.',
    image: '/images/collections/sac-kraft-collection.jpeg',
    handle: 'sacs-kraft-ecologiques',
    color: 'from-yellow-50 to-amber-50',
    accent: 'text-yellow-700',
    badge: 'Écologique',
    hasProducts: true // Let's test this
  }
];

export default function Categories() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Elegant Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-gray-50/50" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]">
          <div className="h-full w-full" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #000 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, #000 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
        </div>
        {/* Subtle floating elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-gray-100/30 to-slate-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-slate-100/30 to-gray-100/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Sophisticated Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full mb-8 shadow-lg">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-bold tracking-wider uppercase">
                NOS COLLECTIONS
              </span>
            </div>

            {/* Elegant Title */}
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-black mb-8 tracking-tight">
              Découvrez Nos
              <span className="block bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent">
                Collections
              </span>
            </h2>

            {/* Refined Description */}
            <p className="text-xl md:text-2xl text-black/80 max-w-4xl mx-auto leading-relaxed font-medium">
              Découvrez nos 10 collections d'emballages innovants, chacune conçue pour répondre
              à des besoins spécifiques tout en maintenant la plus haute qualité.
            </p>

            {/* Decorative Line */}
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-black to-transparent rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* Luxury Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {COLLECTION_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={category.hasProducts ? `/collections/${category.handle}` : category.handle}>
                <Card className="group overflow-hidden border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 bg-white rounded-2xl hover:border-black/20">
                  <div className="relative overflow-hidden">
                    {/* Premium Category Image */}
                    <div className="aspect-square relative overflow-hidden rounded-2xl m-5">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110 rounded-2xl grayscale group-hover:grayscale-0"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                      />

                      {/* Sophisticated Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />

                      {/* Premium Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border ${
                          category.hasProducts
                            ? 'bg-black/90 text-white border-white/20'
                            : 'bg-orange-500/90 text-white border-orange-300/20'
                        }`}>
                          <Package className="h-3 w-3" />
                          {category.badge}
                        </span>
                      </div>

                      {/* Elegant Hover Arrow */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-3 group-hover:translate-x-0">
                        <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-full shadow-lg border border-gray-200/50">
                          <ArrowRight className="h-4 w-4 text-black" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 pt-2">
                    <div className="space-y-3 text-center">
                      {/* Elegant Title */}
                      <h3 className="text-lg md:text-xl font-black text-black group-hover:text-gray-800 transition-colors duration-500 leading-tight tracking-tight">
                        {category.title}
                      </h3>

                      {/* Sophisticated Subtitle */}
                      <p className="text-sm font-semibold text-black/70 line-clamp-2 leading-snug">
                        {category.subtitle}
                      </p>

                      {/* Refined Description */}
                      <p className="text-black/60 text-sm leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                        {category.description}
                      </p>

                      {/* Premium CTA */}
                      <div className="pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`p-0 h-auto font-bold group/btn text-sm transition-all duration-300 ${
                            category.hasProducts
                              ? 'text-black hover:text-gray-700'
                              : 'text-orange-600 hover:text-orange-700'
                          }`}
                        >
                          {category.hasProducts ? 'Voir la collection' : 'Demander un devis'}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
}
