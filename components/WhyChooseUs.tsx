'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Clock, Package, Recycle, Settings, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function WhyChooseUs() {

  const features = [
    {
      icon: ShoppingCart,
      title: "Petites quantités dès le départ",
      description: "Commandez à partir de 50 unités pour tester le marché sans risque. Idéal pour les artisans, PME et startups.",
      highlight: "🎯 Flexibilité sans frais de démarrage",
      buttonText: "Demandez un devis !",
      buttonVariant: "default" as const,
      iconColor: "text-green-500",
      gradientFrom: "from-green-500/10",
      gradientTo: "to-emerald-500/10"
    },
    {
      icon: Clock,
      title: "Délais ultra rapides",
      description: "Production rapide et fiable, avec des délais actualisés chaque semaine.",
      highlight: "⏰ Ne perdez plus de temps pour lancer votre produit",
      buttonText: "En Savoir plus",
      buttonVariant: "outline" as const,
      iconColor: "text-blue-500",
      gradientFrom: "from-blue-500/10",
      gradientTo: "to-cyan-500/10"
    },
    {
      icon: Package,
      title: "Commande facile & 100% en ligne",
      description: "Configurez votre pochette, envoyez votre design, validez votre BAT et suivez la production directement en ligne.",
      highlight: "💻 Simplicité, transparence et autonomie",
      buttonText: "Commandez en ligne",
      buttonVariant: "default" as const,
      iconColor: "text-green-500",
      gradientFrom: "from-green-500/10",
      gradientTo: "to-emerald-500/10"
    },
    {
      icon: Settings,
      title: "Options sur mesure",
      description: "Choisissez vos formats, matériaux, effets spéciaux, fenêtres, zip, vernis...",
      highlight: "🎨 Un packaging parfaitement adapté à votre image",
      buttonText: "En Savoir plus",
      buttonVariant: "outline" as const,
      iconColor: "text-purple-500",
      gradientFrom: "from-purple-500/10",
      gradientTo: "to-pink-500/10"
    },
    {
      icon: Recycle,
      title: "Packaging léger et écologique",
      description: "Réduction des coûts d'expédition, stockage à plat, moins de déchets.",
      highlight: "🌱 Gagnez de l'espace, économisez du poids, réduisez votre empreinte",
      buttonText: "En Savoir plus",
      buttonVariant: "outline" as const,
      iconColor: "text-green-500",
      gradientFrom: "from-green-500/10",
      gradientTo: "to-emerald-500/10"
    },
    {
      icon: Headphones,
      title: "Support client réactif",
      description: "Notre équipe vous accompagne de la création à la livraison.",
      highlight: "🤝 Service client à taille humaine, conseil personnalisé",
      buttonText: "Nous contacter",
      buttonVariant: "outline" as const,
      iconColor: "text-orange-500",
      gradientFrom: "from-orange-500/10",
      gradientTo: "to-red-500/10"
    }
  ];

  return (
    <section className="relative py-16 md:py-20 mt-[-200px] overflow-hidden bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main floating orbs */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-300/20 to-emerald-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-300/15 to-purple-300/15 rounded-full blur-3xl"
        />

        {/* Additional floating elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [360, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
          className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-full blur-2xl"
        />

        {/* Geometric shapes */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-10 w-4 h-4 bg-green-400/30 transform rotate-45"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1.1, 1, 1.1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-20 w-6 h-6 bg-emerald-400/30 rounded-full"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12 md:mb-16"
        >
          {/* Enhanced Icon with Pulse Effect */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 150 }}
            className="relative inline-flex items-center justify-center mb-8"
          >
            {/* Outer pulse ring */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute w-24 h-24 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full"
            />

            {/* Middle pulse ring */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.2, 0.4]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute w-20 h-20 bg-gradient-to-r from-green-500/40 to-emerald-500/40 rounded-full"
            />

            {/* Main icon container */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
              className="relative w-16 h-16 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] rounded-full shadow-2xl flex items-center justify-center border-2 border-white/20"
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Settings className="w-8 h-8 text-white drop-shadow-lg" />
              </motion.div>

              {/* Sparkle effects */}
              <motion.div
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-80"
              />
              <motion.div
                animate={{
                  scale: [0, 1, 0],
                  rotate: [360, 180, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full opacity-70"
              />
            </motion.div>
          </motion.div>

          {/* Innovative Title with Typing Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6"
          >
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
            >
              <span className="text-gray-800">L'</span>
              <span className="bg-gradient-to-r from-green-600 via-green-500 to-green-400 bg-clip-text text-transparent">
                Excellence
              </span>
              <br />
              <span className="text-gray-800">qui fait la</span>{' '}
              <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Différence
              </span>
            </motion.h2>
          </motion.div>

          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full px-6 py-3 mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
            />
            <span className="text-sm font-semibold text-green-700 tracking-wide">
              PACKEDIN® - Votre Partenaire Innovation
            </span>
          </motion.div>

          <motion.p
            className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Explorez nos solutions d'emballage révolutionnaires qui transforment vos idées en
            <span className="text-green-600 font-semibold"> succès commercial</span>.
            Chaque détail compte dans votre réussite.
          </motion.p>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            {[
              { number: "50+", label: "Unités minimum", icon: "📦" },
              { number: "24h", label: "Délai express", icon: "⚡" },
              { number: "100%", label: "En ligne", icon: "💻" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-green-100"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-green-600">{stat.number}</div>
                <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Mobile Layout - Grid */}
        <div className="lg:hidden">

          {/* Features Grid - Mobile - Fixed height to prevent CLS */}
          <div className="grid grid-cols-2 gap-4 min-h-[600px]">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.03
                }}
                className="hover:scale-[1.01] transition-transform duration-200 will-change-transform"
              >
                <Card className={`h-full bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} border border-white/30 hover:border-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-200 group`}>
                  <CardContent className="p-4">
                    {/* Optimized Icon */}
                    <div className="mb-3 group-hover:scale-[1.03] transition-transform duration-200">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center shadow-md border border-white/20`}>
                        <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                      </div>
                    </div>

                    {/* Optimized Title */}
                    <h3 className="text-sm font-bold text-black mb-2 leading-tight">
                      {feature.title}
                    </h3>

                    {/* Optimized Description */}
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Optimized Highlight */}
                    <div className="mb-3">
                      <p className="text-xs font-bold text-green-500 bg-white/90 rounded-lg px-2 py-1.5 border border-green-200/50 shadow-sm">
                        {feature.highlight}
                      </p>
                    </div>

                    {/* Optimized Button */}
                    <Button
                      variant={feature.buttonVariant}
                      size="sm"
                      className={`w-full font-semibold text-xs transition-colors duration-150 ${feature.buttonVariant === 'default'
                          ? 'bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 hover:to-[#77db19] text-white border-0'
                          : 'border-green-500/30 text-green-500 hover:bg-green-500/10'
                        }`}
                    >
                      {feature.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Layout - Features Grid */}
        <div className="hidden lg:block">
          {/* 6 Cards in 3x2 Grid */}
          <div className="w-full">
            <div className="grid grid-cols-3 gap-4 min-h-[500px]">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.03
                  }}
                  className="hover:scale-[1.01] transition-transform duration-200 will-change-transform"
                >
                  <Card className={`h-full bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} border border-white/30 hover:border-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-200 group`}>
                    <CardContent className="p-6">
                      {/* Optimized Icon - Desktop */}
                      <div className="mb-4 group-hover:scale-[1.03] transition-transform duration-200">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30`}>
                          <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                        </div>
                      </div>

                      {/* Optimized Title */}
                      <h3 className="text-base font-bold text-black mb-3 leading-tight">
                        {feature.title}
                      </h3>

                      {/* Optimized Description */}
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Optimized Highlight */}
                      <div className="mb-4">
                        <p className="text-sm font-bold text-green-500 bg-white/90 rounded-lg px-3 py-2 border border-green-200/50 shadow-sm">
                          {feature.highlight}
                        </p>
                      </div>

                      {/* Optimized Button */}
                      <Button
                        variant={feature.buttonVariant}
                        size="sm"
                        className={`w-full font-semibold text-xs transition-colors duration-150 ${feature.buttonVariant === 'default'
                            ? 'bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 hover:to-[#77db19] text-white border-0'
                            : 'border-green-500/30 text-green-500 hover:bg-green-500/10'
                          }`}
                      >
                        {feature.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}