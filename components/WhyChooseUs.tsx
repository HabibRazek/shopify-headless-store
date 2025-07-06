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
    <section className="relative py-12 md:py-16 mt-[-200px] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/10 to-emerald-200/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-3xl"
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
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] rounded-full mb-6 shadow-xl"
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
              <Settings className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Pourquoi choisir les services
          </motion.h2>

          <motion.h3
            className="text-3xl md:text-4xl lg:text-5xl font-black text-green-500 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            de <span className="text-green-500">PACKEDIN</span>® ?
          </motion.h3>

          <motion.p
            className="text-lg md:text-xl text-black max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Découvrez les avantages qui font de PackedIn votre partenaire idéal pour tous vos besoins d'emballage personnalisé.
          </motion.p>
        </motion.div>

        {/* Mobile Layout - Grid */}
        <div className="lg:hidden">

          {/* Features Grid - Mobile - Fixed height to prevent CLS */}
          <div className="grid grid-cols-2 gap-4 min-h-[600px]">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05
                }}
                className="hover:scale-[1.02] hover:-translate-y-1 transition-transform duration-150"
              >
                <Card className={`h-full bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} border border-white/30 hover:border-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-200 group`}>
                  <CardContent className="p-4">
                    {/* Optimized Icon */}
                    <div className="mb-3 group-hover:scale-105 transition-transform duration-150">
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05
                  }}
                  className="hover:scale-[1.02] hover:-translate-y-1 transition-transform duration-150"
                >
                  <Card className={`h-full bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} border border-white/30 hover:border-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-200 group`}>
                    <CardContent className="p-6">
                      {/* Optimized Icon - Desktop */}
                      <div className="mb-4 group-hover:scale-105 transition-transform duration-150">
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