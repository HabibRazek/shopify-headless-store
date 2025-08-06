'use client';

import { motion } from 'framer-motion';
import { Package, Truck, ThumbsUp, Shield } from 'lucide-react';
import Image from 'next/image';

export default function WhyChooseUs() {
  const features = [
    {
      icon: Package,
      title: 'Stock Disponible ?',
      description: 'Prêt à expédier - nous stockons de grandes quantités de sacs de stock.',
      bgColor: 'bg-gradient-to-br from-green-400 to-green-500',
      delay: 0.1
    },
    {
      icon: Truck,
      title: 'Livraison Rapide ?',
      description: 'Les commandes reçues avant 15h sont expédiées le même jour ouvrable.',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      delay: 0.2
    },
    {
      icon: ThumbsUp,
      title: 'Qualité Premium ?',
      description: 'Fabriqué avec des matériaux et des normes de la plus haute qualité.',
      bgColor: 'bg-gradient-to-br from-green-600 to-green-700',
      delay: 0.3
    },
    {
      icon: Shield,
      title: 'Support Garanti ?',
      description: 'Support client professionnel et service après-vente de qualité.',
      bgColor: 'bg-gradient-to-br from-green-700 to-green-800',
      delay: 0.4
    }
  ];

  return (
    <section className="py-8 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Floating Images */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* SpoutPouch - Floating Animation */}
          <div className="absolute top-10 right-8 w-32 h-48 md:w-40 md:h-60 opacity-60 md:opacity-75">
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 8, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="hidden md:block w-full h-full"
            >
              <Image
                src="/images/collections/SpoutPouch.png"
                alt="Spout Pouch"
                fill
                className="object-contain select-none filter drop-shadow-md"
                draggable={false}
                sizes="160px"
              />
            </motion.div>
            <div className="md:hidden w-full h-full">
              <Image
                src="/images/collections/SpoutPouch.png"
                alt="Spout Pouch"
                fill
                className="object-contain select-none filter drop-shadow-md"
                draggable={false}
                sizes="160px"
              />
            </div>
          </div>

          {/* KraftView - Floating Animation */}
          <div className="absolute top-16 left-6 w-28 h-44 md:w-36 md:h-56 opacity-55 md:opacity-70">
            <motion.div
              animate={{
                y: [0, 15, 0],
                rotate: [0, -6, 0],
                scale: [1, 1.03, 1]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="hidden md:block w-full h-full"
            >
              <Image
                src="/images/collections/KraftView.png"
                alt="Kraft View"
                fill
                className="object-contain select-none filter drop-shadow-md"
                draggable={false}
                sizes="144px"
              />
            </motion.div>
            <div className="md:hidden w-full h-full">
              <Image
                src="/images/collections/KraftView.png"
                alt="Kraft View"
                fill
                className="object-contain select-none filter drop-shadow-md"
                draggable={false}
                sizes="144px"
              />
            </div>
          </div>
        </div>

        {/* Title Section with Floating Elements */}
        <div className="text-center mb-8 relative">
          {/* Floating Elements near Title */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 left-1/4 w-8 h-8 bg-green-200/40 rounded-full blur-sm hidden md:block"
          />
          
          <motion.div
            animate={{
              y: [0, 8, 0],
              rotate: [0, -12, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-4 right-1/4 w-6 h-6 bg-emerald-300/30 rounded-full blur-sm hidden md:block"
          />

          <motion.div
            animate={{
              y: [0, -6, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-8 left-1/3 w-4 h-4 bg-green-400/50 rounded-full hidden md:block"
          />

          <motion.div
            animate={{
              y: [0, 12, 0],
              x: [0, 5, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute top-2 right-1/3 w-3 h-3 bg-teal-300/40 rounded-full hidden md:block"
          />

          {/* Title matching "Nos Produits Populaires" style */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight"
          >
            <span className="block text-black">Pourquoi</span>
            <span className="block text-green-500">Nous Choisir ?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-black max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8"
          >
            Excellence et innovation dans chaque solution d'emballage
          </motion.p>
        </div>

        {/* Simple Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 relative z-10">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.title} className="text-center group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: feature.delay,
                    type: "spring",
                    stiffness: 120
                  }}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    transition={{ duration: 0.2 }}
                    className={`
                      w-16 h-16 mx-auto mb-3 rounded-full
                      ${feature.bgColor}
                      flex items-center justify-center
                      shadow-md group-hover:shadow-lg
                      transition-all duration-300
                    `}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="text-sm md:text-base font-bold text-gray-800 mb-2 tracking-wide">
                    {feature.title}
                  </h3>

                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed px-1">
                    {feature.description}
                  </p>

                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '40px' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: feature.delay + 0.2 }}
                    className="h-0.5 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-2 rounded-full"
                  />
                </motion.div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
