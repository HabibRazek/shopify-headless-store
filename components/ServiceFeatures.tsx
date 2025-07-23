'use client';

import { motion } from 'framer-motion';
import { Package, Truck, ThumbsUp, Shield } from 'lucide-react';

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
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: feature.delay,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="text-center group"
              >
                {/* Icon Container */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className={`
                    w-20 h-20 mx-auto mb-6 rounded-full 
                    ${feature.bgColor}
                    flex items-center justify-center
                    shadow-lg group-hover:shadow-xl
                    transition-all duration-300
                  `}
                >
                  <IconComponent className="w-10 h-10 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h3
                  className="text-lg font-bold text-gray-800 mb-3 tracking-wide"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {feature.title}
                </motion.h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed px-2">
                  {feature.description}
                </p>

                {/* Decorative Line */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '60px' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: feature.delay + 0.3 }}
                  className="h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-4 rounded-full"
                />
              </motion.div>
            );
          })}
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-300 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-green-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-green-500 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </section>
  );
}
