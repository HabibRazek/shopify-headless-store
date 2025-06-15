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
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700 tracking-wide">
                NOS COLLECTIONS
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Découvrez Nos Collections
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez nos 10 collections d'emballages innovants, chacune conçue pour répondre
              à des besoins spécifiques tout en maintenant la plus haute qualité.
            </p>
          </motion.div>
        </div>

        {/* Categories Grid - 5 columns on large screens, 2 rows for 10 collections */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {COLLECTION_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={category.hasProducts ? `/collections/${category.handle}` : category.handle}>
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white rounded-3xl">
                  <div className="relative overflow-hidden">
                    {/* Category Image - Completely Rounded */}
                    <div className="aspect-square relative overflow-hidden rounded-3xl m-4">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 rounded-3xl"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                      />

                      {/* Subtle Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`} />

                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          category.hasProducts
                            ? 'bg-white/95 text-gray-700'
                            : 'bg-orange-100/95 text-orange-700'
                        }`}>
                          <Package className="h-3 w-3" />
                          {category.badge}
                        </span>
                      </div>

                      {/* Hover Arrow */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <div className="bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-sm">
                          <ArrowRight className="h-4 w-4 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2 text-center">
                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300 leading-tight">
                        {category.title}
                      </h3>

                      {/* Subtitle */}
                      <p className={`text-xs font-medium ${category.accent} opacity-80 line-clamp-2`}>
                        {category.subtitle}
                      </p>

                      {/* Description - Hidden on smaller screens, shown on hover */}
                      <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {category.description}
                      </p>

                      {/* CTA */}
                      <div className="pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`p-0 h-auto font-semibold group/btn text-xs ${
                            category.hasProducts
                              ? 'text-green-600 hover:text-green-700'
                              : 'text-orange-600 hover:text-orange-700'
                          }`}
                        >
                          {category.hasProducts ? 'Voir la collection' : 'Demander un devis'}
                          <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-1" />
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
