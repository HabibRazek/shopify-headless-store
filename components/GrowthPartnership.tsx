'use client';

import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Globe, Rocket } from 'lucide-react';

export default function GrowthPartnership() {
  const growthStages = [
    {
      icon: Lightbulb,
      title: 'Start-up',
      description: 'Accompagnement personnalisé pour les nouvelles entreprises avec des solutions flexibles et adaptées.',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      icon: TrendingUp,
      title: 'Croissance',
      description: 'Solutions évolutives pour soutenir votre expansion et augmenter vos volumes de production.',
      bgColor: 'bg-gradient-to-br from-green-600 to-green-700'
    },
    {
      icon: Globe,
      title: 'Marque Globale',
      description: 'Partenariat stratégique pour les marques établies avec des besoins internationaux avancés.',
      bgColor: 'bg-gradient-to-br from-green-700 to-green-800'
    }
  ];

  return (
    <section className="py-8 md:py-16 mb-4 md:mb-8 relative">{/* Removed background and reduced spacing */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Title */}
        <div className="text-center mb-4 md:mb-8">
          {/* Mobile Version - No Animations */}
          <div className="md:hidden">
            {/* Static Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] rounded-full mb-4 shadow-xl">
              <Rocket className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-3 leading-tight">
              <span className="block text-black">Nous Grandissons</span>
              <span className="block text-green-500">Avec Vous</span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-black max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6">
              Votre partenaire de confiance à chaque étape de votre croissance
            </p>
          </div>

          {/* Desktop Version - With Animations */}
          <div className="hidden md:block">
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] rounded-full mb-4 shadow-xl"
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Rocket className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-3 leading-tight">
                <span className="block text-black">Nous Grandissons</span>
                <span className="block text-green-500">Avec Vous</span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-black max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6">
                Votre partenaire de confiance à chaque étape de votre croissance
              </p>
            </motion.div>
          </div>
        </div>

        {/* Growth Stages */}
        <div className="relative">
          {/* Mobile Version - Simple and Professional */}
          <div className="md:hidden grid grid-cols-1 gap-6">
            {growthStages.map((stage, index) => {
              const IconComponent = stage.icon;
              return (
                <div
                  key={stage.title}
                  className="relative"
                >
                  {/* Simple Mobile Card Container */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">

                    {/* Simple Mobile Icon */}
                    <div className={`
                      w-16 h-16 mx-auto mb-4 rounded-full
                      ${stage.bgColor}
                      flex items-center justify-center
                      shadow-md
                    `}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Simple Mobile Title */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                      {stage.title}
                    </h3>

                    {/* Simple Mobile Description */}
                    <p className="text-gray-600 text-center leading-relaxed text-sm">
                      {stage.description}
                    </p>

                    {/* Simple Mobile Decorative Line */}
                    <div className="h-0.5 bg-gray-300 mx-auto mt-4 rounded-full w-16" />

                    {/* Mobile Step Indicator */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">
                          Étape {index + 1}
                        </span>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Version - Simple and Professional */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 lg:gap-12 relative">
            {growthStages.map((stage, index) => {
              const IconComponent = stage.icon;
              return (
                <div
                  key={stage.title}
                  className="relative group"
                >
                  {/* Simple Professional Card Container */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">

                    {/* Simple Professional Icon */}
                    <div className={`
                      w-16 h-16 mx-auto mb-6 rounded-full
                      ${stage.bgColor}
                      flex items-center justify-center
                      shadow-md
                    `}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Simple Professional Title */}
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                      {stage.title}
                    </h3>

                    {/* Simple Professional Description */}
                    <p className="text-gray-600 text-center leading-relaxed text-base">
                      {stage.description}
                    </p>

                    {/* Simple Decorative Line */}
                    <div className="h-0.5 bg-gray-300 mx-auto mt-6 rounded-full w-16" />

                    {/* Simple Card Footer */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">
                          Étape {index + 1}
                        </span>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      </div>
                    </div>
                </div>

                </div>
            );
          })}
          </div>
        </div>

      </div>
    </section>
  );
}
