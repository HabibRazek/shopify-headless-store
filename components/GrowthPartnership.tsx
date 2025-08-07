'use client';

import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Globe, Rocket } from 'lucide-react';

export default function GrowthPartnership() {
  const growthStages = [
    {
      icon: Lightbulb,
      title: 'Start-up',
      description: 'Accompagnement personnalisé pour les nouvelles entreprises avec des solutions flexibles et adaptées.',
      bgColor: 'bg-gradient-to-br from-green-400 to-green-500',
      delay: 0.1
    },
    {
      icon: TrendingUp,
      title: 'Croissance',
      description: 'Solutions évolutives pour soutenir votre expansion et augmenter vos volumes de production.',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      delay: 0.2
    },
    {
      icon: Globe,
      title: 'Marque Globale',
      description: 'Partenariat stratégique pour les marques établies avec des besoins internationaux avancés.',
      bgColor: 'bg-gradient-to-br from-green-600 to-green-700',
      delay: 0.3
    }
  ];

  return (
    <section className="py-4 md:py-24 mb-12 md:mb-0 bg-gradient-to-br from-gray-50 via-white to-green-50/30 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-32 h-32 bg-green-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-20 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Title */}
        <div className="text-center mb-6 md:mb-16">
          {/* Mobile Version - No Animations */}
          <div className="md:hidden">
            {/* Static Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] rounded-full mb-8 shadow-xl">
              <Rocket className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight">
              <span className="block text-black">Nous Grandissons</span>
              <span className="block text-green-500">Avec Vous</span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-black max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8">
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
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] rounded-full mb-8 shadow-xl"
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
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight">
                <span className="block text-black">Nous Grandissons</span>
                <span className="block text-green-500">Avec Vous</span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-black max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8">
                Votre partenaire de confiance à chaque étape de votre croissance
              </p>
            </motion.div>
          </div>
        </div>

        {/* Growth Stages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Mobile Version - No Animations */}
          <div className="md:hidden grid grid-cols-1 gap-8 lg:gap-12">
            {growthStages.map((stage) => {
              const IconComponent = stage.icon;
              return (
                <div
                  key={stage.title}
                  className="relative group"
                >
                  {/* Static Card Container */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 overflow-hidden">

                    {/* Static Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-emerald-500/10 to-blue-400/20 rounded-2xl opacity-20" />

                    {/* Static Icon */}
                    <div className={`
                      w-16 h-16 mx-auto mb-6 rounded-full relative z-10
                      ${stage.bgColor}
                      flex items-center justify-center
                      shadow-lg
                    `}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Static Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center relative z-10">
                      {stage.title}
                    </h3>

                    {/* Static Description */}
                    <p className="text-gray-600 text-center leading-relaxed relative z-10">
                      {stage.description}
                    </p>

                    {/* Static Decorative Line */}
                    <div className="h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-6 rounded-full relative z-10 w-20" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Version - With Animations */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 lg:gap-12">
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
                  {/* Enhanced Card Container */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 group-hover:border-green-300/50 overflow-hidden">

                    {/* Animated Background */}
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.2, 0.1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5
                      }}
                      className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-emerald-500/10 to-blue-400/20 rounded-2xl"
                    />

                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                      className={`
                        w-16 h-16 mx-auto mb-6 rounded-full relative z-10
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
                    className="text-xl font-bold text-gray-800 mb-4 text-center relative z-10"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {stage.title}
                  </motion.h3>

                  {/* Description */}
                  <p className="text-gray-600 text-center leading-relaxed relative z-10">
                    {stage.description}
                  </p>

                  {/* Decorative Elements */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '80px' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: stage.delay + 0.5 }}
                    className="h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-6 rounded-full relative z-10"
                  />
                </div>

                {/* Connection Lines (for desktop) */}
                {index < growthStages.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: stage.delay + 0.8 }}
                    className="hidden lg:block absolute top-1/2 -right-6 lg:-right-12 w-6 lg:w-12 h-0.5 bg-gradient-to-r from-green-400 to-green-600 transform -translate-y-1/2 z-10"
                  />
                )}
              </motion.div>
            );
          })}
          </div>
        </div>

      </div>
    </section>
  );
}
