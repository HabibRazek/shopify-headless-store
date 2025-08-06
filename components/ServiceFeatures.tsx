'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Clock, Package, Recycle, Settings, Headphones, Star, Award, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ServiceFeatures() {

  const features = [
    {
      icon: ShoppingCart,
      title: "Petites quantités dès le départ",
      description: "Commandez à partir de 50 unités pour tester le marché sans risque. Idéal pour les artisans, PME et startups.",
      highlight: "🎯 Flexibilité sans frais de démarrage",
      buttonText: "Demandez un devis !",
      buttonVariant: "default" as const,
      iconColor: "text-white",
      bgGradient: "from-green-500 to-emerald-600",
      delay: 0.1
    },
    {
      icon: Clock,
      title: "Délais ultra rapides",
      description: "Production rapide et fiable, avec des délais actualisés chaque semaine.",
      highlight: "⏰ Ne perdez plus de temps pour lancer votre produit",
      buttonText: "En Savoir plus",
      buttonVariant: "outline" as const,
      iconColor: "text-white",
      bgGradient: "from-blue-500 to-cyan-600",
      delay: 0.2
    },
    {
      icon: Package,
      title: "Commande facile & 100% en ligne",
      description: "Configurez votre pochette, envoyez votre design, validez votre BAT et suivez la production directement en ligne.",
      highlight: "💻 Simplicité, transparence et autonomie",
      buttonText: "Commandez en ligne",
      buttonVariant: "default" as const,
      iconColor: "text-white",
      bgGradient: "from-purple-500 to-pink-600",
      delay: 0.3
    },
    {
      icon: Settings,
      title: "Options sur mesure",
      description: "Choisissez vos formats, matériaux, effets spéciaux, fenêtres, zip, vernis...",
      highlight: "🎨 Un packaging parfaitement adapté à votre image",
      buttonText: "En Savoir plus",
      buttonVariant: "outline" as const,
      iconColor: "text-white",
      bgGradient: "from-orange-500 to-red-600",
      delay: 0.4
    },
    {
      icon: Recycle,
      title: "Matériaux éco-responsables",
      description: "Emballages recyclables et biodégradables pour un impact environnemental réduit.",
      highlight: "🌱 Respectueux de l'environnement",
      buttonText: "En Savoir plus",
      buttonVariant: "outline" as const,
      iconColor: "text-white",
      bgGradient: "from-green-600 to-teal-600",
      delay: 0.5
    },
    {
      icon: Headphones,
      title: "Support client dédié",
      description: "Une équipe d'experts à votre écoute pour vous accompagner dans votre projet.",
      highlight: "🤝 Accompagnement personnalisé",
      buttonText: "Nous contacter",
      buttonVariant: "default" as const,
      iconColor: "text-white",
      bgGradient: "from-indigo-500 to-purple-600",
      delay: 0.6
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-green-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          className="absolute top-20 right-20 w-32 h-32 bg-green-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 0.8, 1]
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
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Decorative badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center mb-8"
          >
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 rounded-full shadow-2xl flex items-center justify-center border-2 border-white/20">
                <div className="text-white text-2xl font-bold">✨</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight">
              <span className="block text-black">Nos Services</span>
              <span className="block text-green-500">Exceptionnels</span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-black max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8">
              Des solutions d'emballage qui répondent à toutes vos questions
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: feature.delay,
                  type: "spring",
                  stiffness: 100
                }}
                className="group"
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <CardContent className="p-8">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={`w-16 h-16 bg-gradient-to-r ${feature.bgGradient} rounded-2xl shadow-lg flex items-center justify-center mb-6 group-hover:shadow-xl transition-shadow duration-300`}
                    >
                      <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Highlight */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 mb-6 border border-green-200/50">
                      <p className="text-sm font-medium text-green-700">
                        {feature.highlight}
                      </p>
                    </div>

                    {/* Button */}
                    <Button
                      variant={feature.buttonVariant}
                      className="w-full group-hover:scale-105 transition-transform duration-300"
                    >
                      {feature.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
