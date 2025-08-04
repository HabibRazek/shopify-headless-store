'use client';

import { motion } from 'framer-motion';
import { Package, Truck, ThumbsUp, Shield } from 'lucide-react';
import Image from 'next/image';

export default function ServiceFeatures() {
  const features = [
    {
      icon: Package,
      title: 'INVENTAIRE',
      description: 'Prêt à expédier - nous stockons de grandes quantités de sacs de stock.',
      bgColor: 'bg-gradient-to-br from-green-400 to-green-500',
      delay: 0.1
    },
    {
      icon: Truck,
      title: 'EXPÉDITION',
      description: 'Les commandes reçues avant 15h sont expédiées le même jour ouvrable.',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      delay: 0.2
    },
    {
      icon: ThumbsUp,
      title: 'QUALITÉ SUPÉRIEURE',
      description: 'Fabriqué avec des matériaux et des normes de la plus haute qualité.',
      bgColor: 'bg-gradient-to-br from-green-600 to-green-700',
      delay: 0.3
    },
    {
      icon: Shield,
      title: 'SERVICE FIABLE',
      description: 'Support client professionnel et service après-vente de qualité.',
      bgColor: 'bg-gradient-to-br from-green-700 to-green-800',
      delay: 0.4
    }
  ];

  return (
    <section className="py-8 relative overflow-hidden">
      {/* Clean section without background */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Soft Floating Images & Creative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Soft Animated Background Squares */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-green-200/30 rotate-45"
          />

          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-gray-300/40 rotate-12"
          />

          {/* SpoutPouch - Complete Image */}
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
            className="absolute top-10 right-8 w-32 h-48 md:w-40 md:h-60 opacity-60 md:opacity-75"
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

          {/* KraftView - Complete Image */}
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
            className="absolute top-16 left-6 w-28 h-44 md:w-36 md:h-56 opacity-55 md:opacity-70"
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

          {/* Soft Creative Elements */}
          <motion.div
            animate={{
              rotate: [0, 180, 360],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 w-40 h-40 border border-green-200/30 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          />

          {/* Soft Floating Dots */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/3 right-1/3 w-3 h-3 bg-green-300/60 rounded-full"
          />

          <motion.div
            animate={{
              y: [0, 8, 0],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-gray-400/50 rounded-full"
          />
        </div>

        {/* Compact Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="text-center mb-8"
        >
          {/* Soft Title with Gray & Green */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3"
          >
            <span className="text-gray-800">
              Pourquoi
            </span>{' '}
            <span className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 bg-clip-text text-transparent">
              Nous Choisir
            </span>
          </motion.h2>

          {/* Soft Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-4 leading-relaxed"
          >
            Excellence et innovation dans chaque solution d'emballage
          </motion.p>

          {/* Soft Decorative Line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full mx-auto"
          />
        </motion.div>

        {/* Compact Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 relative z-10">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
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
                className="text-center group"
              >
                {/* Soft Icon Container */}
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

                {/* Soft Title */}
                <h3 className="text-sm md:text-base font-bold text-gray-800 mb-2 tracking-wide">
                  {feature.title}
                </h3>

                {/* Soft Description */}
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed px-1">
                  {feature.description}
                </p>

                {/* Soft Decorative Line */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '40px' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: feature.delay + 0.2 }}
                  className="h-0.5 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-2 rounded-full"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
