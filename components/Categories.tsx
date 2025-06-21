'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Package, Sparkles, TrendingUp, Award } from 'lucide-react';
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
    <section className="py-24 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 relative overflow-hidden">
      {/* Innovative Background Design */}
      <div className="absolute inset-0">
        {/* Green Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 via-white to-emerald-50/30" />

        {/* Geometric Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.04]">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(90deg, #10b981 1px, transparent 1px),
              linear-gradient(180deg, #10b981 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Green Elements */}
        <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-r from-emerald-400/10 to-green-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Green Chart Pattern */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.02]">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <pattern id="greenChart" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="none" stroke="#10b981" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#greenChart)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Innovative Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Stats Row */}
            <div className="flex justify-center items-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-green-200/50">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-bold text-black">10+ Collections</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-green-200/50">
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-sm font-bold text-black">Qualité Premium</span>
              </div>
            </div>

            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full mb-8 shadow-lg">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-bold tracking-wider uppercase">
                NOS COLLECTIONS
              </span>
            </div>

            {/* Elegant Title with Green Accent */}
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-black mb-8 tracking-tight">
              Découvrez Nos
              <span className="block bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                Collections
              </span>
            </h2>

            {/* Refined Description */}
            <p className="text-xl md:text-2xl text-black/80 max-w-4xl mx-auto leading-relaxed font-medium">
              Découvrez nos 10 collections d'emballages innovants, chacune conçue pour répondre
              à des besoins spécifiques tout en maintenant la plus haute qualité.
            </p>

            {/* Green Decorative Line */}
            <div className="mt-8 flex justify-center">
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* Innovative Categories Grid */}
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
                <Card className="group overflow-hidden border border-green-200/30 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 bg-white/95 backdrop-blur-sm rounded-3xl hover:border-green-400/50 hover:bg-white">
                  <div className="relative overflow-hidden">
                    {/* Clean Category Image */}
                    <div className="aspect-square relative overflow-hidden rounded-3xl m-4">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-105 rounded-3xl"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                      />

                      {/* Green Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />

                      {/* Clean Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border ${
                          category.hasProducts
                            ? 'bg-green-600/95 text-white border-green-400/30'
                            : 'bg-orange-500/95 text-white border-orange-400/30'
                        }`}>
                          <Package className="h-3 w-3" />
                          {category.badge}
                        </span>
                      </div>

                      {/* Green Hover Arrow */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-3 group-hover:translate-x-0">
                        <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-full shadow-sm border border-green-200/50">
                          <ArrowRight className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 pt-2">
                    <div className="space-y-3 text-center">
                      {/* Clean Title */}
                      <h3 className="text-lg md:text-xl font-black text-black group-hover:text-green-600 transition-colors duration-500 leading-tight tracking-tight">
                        {category.title}
                      </h3>

                      {/* Clean Subtitle */}
                      <p className="text-sm font-semibold text-black/70 line-clamp-2 leading-snug">
                        {category.subtitle}
                      </p>

                      {/* Clean Description */}
                      <p className="text-black/60 text-sm leading-relaxed line-clamp-2 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                        {category.description}
                      </p>

                      {/* Green CTA */}
                      <div className="pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`p-0 h-auto font-bold group/btn text-sm transition-all duration-300 ${
                            category.hasProducts
                              ? 'text-green-600 hover:text-green-700'
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
