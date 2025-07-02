'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Clock, Package, Recycle, Settings, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function WhyChooseUs() {
  const features = [
    {
      icon: ShoppingCart,
      title: "Petites quantités dès le départ",
      description: "Commandez à partir de 50 unités pour tester le marché sans risque. Idéal pour les artisans, PME et startups.",
      highlight: "🎯 Flexibilité sans frais de démarrage",
      buttonText: "Demandez un devis !",
      buttonVariant: "default" as const,
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: Clock,
      title: "Délais ultra rapides",
      description: "Production rapide et fiable, avec des délais actualisés chaque semaine.",
      highlight: "⏰ Ne perdez plus de temps pour lancer votre produit",
      buttonText: "En Savoir plus",
      buttonVariant: "outline" as const,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: Package,
      title: "Commande facile & 100% en ligne",
      description: "Configurez votre pochette, envoyez votre design, validez votre BAT et suivez la production directement en ligne.",
      highlight: "💻 Simplicité, transparence et autonomie",
      buttonText: "Commandez en ligne",
      buttonVariant: "default" as const,
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: Settings,
      title: "Options sur mesure",
      description: "Choisissez vos formats, matériaux, effets spéciaux, fenêtres, zip, vernis...",
      highlight: "🎨 Un packaging parfaitement adapté à votre image",
      buttonText: "En Savoir plus",
      buttonVariant: "outline" as const,
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200"
    },
    {
      icon: Recycle,
      title: "Packaging léger et écologique",
      description: "Réduction des coûts d'expédition, stockage à plat, moins de déchets.",
      highlight: "🌱 Gagnez de l'espace, économisez du poids, réduisez votre empreinte",
      buttonText: "En Savoir plus",
      buttonVariant: "outline" as const,
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: Headphones,
      title: "Support client réactif",
      description: "Notre équipe vous accompagne de la création à la livraison.",
      highlight: "🤝 Service client à taille humaine, conseil personnalisé",
      buttonText: "Nous contacter",
      buttonVariant: "outline" as const,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    }
  ];

  return (
    <section className="relative py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-600 via-green-500 to-green-400 transform skew-y-1"></div>
      <div className="absolute bottom-0 right-0 w-full h-2 bg-gradient-to-l from-green-600 via-green-500 to-green-400 transform skew-y-1"></div>

      {/* Curved Arrow Decorations */}
      <div className="hidden md:flex justify-start ring-offset-slate-200">
        <div className='z-30'>
          <Image
            src="/ArrowLeft.png"
            alt="Arrow pointing to products"
            width={180}
            height={160}
            className="object-contain z-30 w-[120px] h-[100px] sm:w-[180px] sm:h-[160px] sm:lg:ml-10 mt-[15px]"
          />
          <h1 className='font-extrabold mb-20 sm:text-3xl ml-[100px] mt-[-100px] lg:sm:ml-40 -rotate-12 z-30 sm:lg:mt-[-200px]'>
            On ne veut pas <br /> se vanter <br /> mais...
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mobile Layout - Header + Grid */}
        <div className="lg:hidden">
          {/* Header Section */}
          <div className="max-w-4xl mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Target Icon and Title */}
              <div className="flex items-start mb-6">
                <h1 className="flex-shrink-0 mr-4 mt-1 ">
                  🎯
                </h1>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-black mb-4 leading-tight">
                    Pourquoi choisir les pochettes<br />
                    de <span className="text-green-600">PACKEDIN</span>® ?
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl">
                    Optimisez vos produits avec un emballage intelligent, moderne et rentable.
                    Que vous lanciez une nouvelle gamme ou souhaitez upgrader votre packaging,
                    nous sommes là pour vous accompagner.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Grid - Mobile */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`h-full ${feature.bgColor} ${feature.borderColor} border-2 hover:shadow-lg transition-all duration-300 group`}>
                  <CardContent className="p-4">
                    {/* Icon */}
                    <div className="mb-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="w-5 h-5 text-green-600" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-black mb-2 leading-tight">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Highlight */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-green-700 bg-white/80 rounded-lg px-2 py-1 border border-green-200">
                        {feature.highlight}
                      </p>
                    </div>

                    {/* Button */}
                    <Button
                      variant={feature.buttonVariant}
                      size="sm"
                      className={`w-full font-semibold text-xs ${feature.buttonVariant === 'default'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
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

        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:flex lg:gap-12 lg:items-start">
          {/* Left Side - Text Content */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Target Icon and Title */}
              <div className="flex items-start mb-6">
                <h1 className="flex-shrink-0 mr-4 mt-1 text-4xl">
                  🎯
                </h1>
                <div>
                  <h2 className="text-4xl lg:text-5xl font-black text-black mb-4 leading-tight">
                    Pourquoi choisir les pochettes<br />
                    de <span className="text-green-600">PACKEDIN</span>® ?
                  </h2>
                  <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                    Optimisez vos produits avec un emballage intelligent, moderne et rentable.
                    Que vous lanciez une nouvelle gamme ou souhaitez upgrader votre packaging,
                    nous sommes là pour vous accompagner.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - 6 Cards in 3x2 Grid */}
          <div className="lg:w-1/2">
            <div className="grid grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className={`h-full ${feature.bgColor} ${feature.borderColor} border-2 hover:shadow-lg transition-all duration-300 group`}>
                    <CardContent className="p-4">
                      {/* Icon - Bigger for desktop */}
                      <div className="mb-3">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <feature.icon className="w-7 h-7 text-green-600" />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-bold text-black mb-2 leading-tight">
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Highlight */}
                      <div className="mb-4">
                        <p className="text-xs font-medium text-green-700 bg-white/80 rounded-lg px-2 py-1 border border-green-200">
                          {feature.highlight}
                        </p>
                      </div>

                      {/* Button */}
                      <Button
                        variant={feature.buttonVariant}
                        size="sm"
                        className={`w-full font-semibold text-xs ${feature.buttonVariant === 'default'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
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