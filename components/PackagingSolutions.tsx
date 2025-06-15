'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

interface PackagingSolution {
  id: string;
  name: string;
  description: string;
  image: string;
  collectionHandle: string;
  color: string;
}

const packagingSolutions: PackagingSolution[] = [
  {
    id: 'kraftview',
    name: 'KraftView™',
    description: 'Pochettes kraft brun avec fenêtre transparente',
    image: '/images/collections/kraftview-collection-doypacks.jpeg',
    collectionHandle: 'kraftview™-pochettes-zip-kraft-brun-avec-fenetre-transparente',
    color: 'from-amber-100 to-orange-100'
  },
  {
    id: 'blackview',
    name: 'BlackView™',
    description: 'Pochettes noires élégantes avec fenêtre',
    image: '/images/collections/blackview-collection-doypacks.jpeg',
    collectionHandle: 'blackview™-pochettes-zip-noires-avec-fenetre',
    color: 'from-gray-100 to-slate-100'
  },
  {
    id: 'kraftalu',
    name: 'KraftAlu™',
    description: 'Kraft extérieur avec intérieur aluminium',
    image: '/images/collections/kraftalu-collection-doypacks.jpeg',
    collectionHandle: 'kraftalu™-pochettes-zip-kraft-avec-interieur-aluminium',
    color: 'from-yellow-100 to-amber-100'
  },
  {
    id: 'fullalu',
    name: 'FullAlu™',
    description: 'Protection maximale en aluminium',
    image: '/images/collections/fullalu-collection-doypacks.jpeg',
    collectionHandle: 'fullalu™-pochettes-zip-aluminium',
    color: 'from-gray-100 to-zinc-100'
  },
  {
    id: 'fulltrans',
    name: 'FullTrans™',
    description: 'Transparence givrée premium',
    image: '/images/collections/fulltrans-collection-doypacks.jpeg',
    collectionHandle: 'fulltrans™-frosted-pochettes-zip-transparentes-givrees',
    color: 'from-blue-50 to-cyan-50'
  },
  {
    id: 'fullviewalu',
    name: 'FullViewAlu™',
    description: 'Face transparente avec dos aluminium',
    image: '/images/collections/aluview-collection-doypacks.jpeg',
    collectionHandle: 'fullviewalu™-pochettes-zip-aluminisees-avec-face-transparente',
    color: 'from-indigo-50 to-blue-50'
  },
  {
    id: 'whiteview',
    name: 'WhiteView™',
    description: 'Kraft blanc avec fenêtre mate',
    image: '/images/collections/whiteview-collection-doypacks.jpeg',
    collectionHandle: 'whiteview™-pochettes-zip-kraft-blanc-avec-fenetre-mate',
    color: 'from-slate-50 to-gray-50'
  },
  {
    id: 'fullviewkraft',
    name: 'FullViewKraft™',
    description: 'Kraft avec fenêtre pleine largeur',
    image: '/images/collections/kraftview-collection-doypacks.jpeg', // Using kraftview as fallback
    collectionHandle: 'fullviewkraft™-pochettes-zip-kraft-avec-fenetre-pleine',
    color: 'from-orange-100 to-yellow-100'
  },
  {
    id: 'spoutview',
    name: 'SpoutView™',
    description: 'Pochettes avec bec verseur',
    image: '/images/collections/spout-pouch-collection-doypacks.jpeg',
    collectionHandle: 'spoutview™-pochettes-avec-bec-verseur',
    color: 'from-orange-100 to-red-100'
  }
];

export default function PackagingSolutions() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-green-50/30 via-white to-blue-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center mb-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-green-200/50">
            <Target className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm font-semibold text-green-700 tracking-wide">NOS SOLUTIONS</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Solutions d'<span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Emballage</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Pour chaque produit, il existe un emballage idéal. Chez Packedin.tn, nous vous proposons une gamme 
            complète de pochettes zip adaptées à vos besoins, alliant esthétique, praticité et conservation.
          </p>
        </motion.div>

        {/* Solutions Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8"
        >
          {packagingSolutions.map((solution) => (
            <motion.div
              key={solution.id}
              variants={itemVariants}
              className="group"
            >
              <Link href={`/collections/${encodeURIComponent(solution.collectionHandle)}`}>
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-20`} />
                  
                  {/* Image Container */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                    <Image
                      src={solution.image}
                      alt={solution.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="relative p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {solution.name}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      {solution.description}
                    </p>
                    
                    {/* Hover indicator */}
                    <div className="mt-4 flex items-center text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium">Découvrir la collection</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Decorative corner */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12 sm:mt-16"
        >
          <p className="text-gray-600 mb-6">
            Besoin d'aide pour choisir la solution parfaite ?
          </p>
          <Link href="/contact">
            <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Contactez nos experts
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
