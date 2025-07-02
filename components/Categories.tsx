'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';


// Collection data mapping all 9 images to collection handles and metadata
// First 5 collections have actual products, others are coming soon
const COLLECTION_CATEGORIES = [
  // COLLECTIONS WITH PRODUCTS (Working Shopify collections)
  {
    id: 'kraftview',
    title: 'KraftView™',
    subtitle: 'Pochettes Zip Kraft Brun avec Fenêtre',
    description: 'Emballages écologiques en kraft avec fenêtre transparente pour une présentation optimale de vos produits.',
    image: '/images/collections/KraftView.png',
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
    image: '/images/collections/BlackView.png',
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
    image: '/images/collections/KraftAlu.png',
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
    image: '/images/collections/WhiteView.png',
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
    image: '/images/collections/KraftView.png', // Using kraftview image as placeholder
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
    image: '/images/collections/FullViewAlu.png',
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
    image: '/images/collections/FullAlu.png',
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
    image: '/images/collections/FullTrans.png',
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
    image: '/images/collections/SpoutPouch.png',
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
    image: '/images/collections/SacKraft.png',
    handle: 'sacs-kraft-ecologiques',
    color: 'from-yellow-50 to-amber-50',
    accent: 'text-yellow-700',
    badge: 'Écologique',
    hasProducts: true // Let's test this
  }
];

export default function Categories() {
  return (
    <section className="bg-white py-12 md:py-16 relative overflow-hidden mt-[-100px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section matching the design */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            

            {/* Green "NOS COLLECTIONS" Button */}
            <div className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full mb-8 shadow-lg">
              <span className="text-sm font-bold tracking-wider uppercase">
                ✓ NOS COLLECTIONS
              </span>
            </div>

            {/* Title with Green "Collections" */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-6 tracking-tight">
              Découvrez Nos
              <br />
              <span className="text-green-500">Collections</span>
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Découvrez nos 10 collections d'emballages innovants, chacune conçue pour<br />
              répondre à des besoins spécifiques tout en maintenant la plus haute qualité.
            </p>

            {/* Green Decorative Line */}
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-green-500 rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* Circular Categories Grid - 3 cols on mobile, 5 on desktop */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-8 lg:gap-12 max-w-6xl mx-auto">
          {COLLECTION_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <Link href={category.hasProducts ? `/collections/${category.handle}` : category.handle}>
                <div className="group cursor-pointer relative">
                  {/* Large Product Image */}
                  <div className="relative w-32 h-40 md:w-40 md:h-48 lg:w-48 lg:h-56 mb-4">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-contain z-30"
                      sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                    />
                  </div>

                  {/* Circular Background - Positioned at bottom of image */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-24 h-24 md:w-40 md:h-40 lg:w-40 lg:h-40 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg group-hover:opacity-0">
                  </div>

                  {/* Text that stays visible on hover */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex items-center justify-center z-40">
                    <h3 className=" mt-16 text-[10px] md:text-xs lg:text-sm font-bold text-white group-hover:text-black text-center leading-tight px-2">
                      {category.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
}
