'use client';

import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Globe } from 'lucide-react';

export default function GrowthPartnership() {
  const growthStages = [
    {
      icon: Lightbulb,
      title: 'Start-up',
      description: 'Accompagnement personnalisé pour les nouvelles entreprises avec des solutions flexibles.',
      bgColor: 'bg-gradient-to-br from-green-400 to-green-500',
      delay: 0.1
    },
    {
      icon: TrendingUp,
      title: 'Croissance',
      description: 'Solutions évolutives pour soutenir votre expansion et augmenter vos volumes.',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      delay: 0.2
    },
    {
      icon: Globe,
      title: 'Marque Globale',
      description: 'Partenariat stratégique pour les marques établies avec des besoins internationaux.',
      bgColor: 'bg-gradient-to-br from-green-600 to-green-700',
      delay: 0.3
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Nous Grandissons Avec Vous
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Growth Stages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {growthStages.map((stage, index) => {
            const IconComponent = stage.icon;
            return (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: stage.delay,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  y: -15,
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
                className="relative group"
              >
                {/* Card Container */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-green-200">
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                    className={`
                      w-16 h-16 mx-auto mb-6 rounded-full 
                      ${stage.bgColor}
                      flex items-center justify-center
                      shadow-lg group-hover:shadow-xl
                      transition-all duration-300
                    `}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    className="text-xl font-bold text-gray-800 mb-4 text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {stage.title}
                  </motion.h3>

                  {/* Description */}
                  <p className="text-gray-600 text-center leading-relaxed">
                    {stage.description}
                  </p>

                  {/* Decorative Elements */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '80px' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: stage.delay + 0.5 }}
                    className="h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-6 rounded-full"
                  />

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/0 to-green-600/0 group-hover:from-green-400/5 group-hover:to-green-600/5 transition-all duration-500"></div>
                </div>

                {/* Connection Lines (for desktop) */}
                {index < growthStages.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: stage.delay + 0.8 }}
                    className="hidden md:block absolute top-1/2 -right-6 lg:-right-12 w-6 lg:w-12 h-0.5 bg-gradient-to-r from-green-400 to-green-600 transform -translate-y-1/2 z-10"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/6 w-4 h-4 bg-green-300 rounded-full"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-1/4 right-1/6 w-3 h-3 bg-green-400 rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-3/4 left-1/3 w-2 h-2 bg-green-500 rounded-full"
          />
        </div>
      </div>
    </section>
  );
}
