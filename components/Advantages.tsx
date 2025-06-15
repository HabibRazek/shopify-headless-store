'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Recycle, Lock, TrendingUp, DollarSign, ThumbsUp, Package, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface AdvantageCard {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function Advantages() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  const advantageCards: AdvantageCard[] = [
    {
      id: 1,
      title: "Réutilisable et refermable",
      description: "Les pochettes ZIPBAGS® sont réutilisables et refermables pour de multiples utilisations gardant le contenu frais et exempt d'odeurs, d'humidité et d'oxygène dans un environnement hermétique.",
      icon: <Recycle className="h-6 w-6" />,
    },
    {
      id: 2,
      title: "Thermoscellable",
      description: "Les sacs thermoscellés offrent une finition inviolable à laquelle les clients s'attendent. Le thermoscellage prolonge la durée de conservation du produit, maintient la fraîcheur et garantit la sécurité alimentaire.",
      icon: <Lock className="h-6 w-6" />,
    },
    {
      id: 3,
      title: "Impact d'étagère",
      description: "Les sachets ZIPBAGS® sont réutilisables et refermables pour de multiples utilisations gardant le contenu frais et exempt d'odeurs, d'humidité et d'oxygène dans un environnement hermétique.",
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      id: 4,
      title: "Économies de coûts",
      description: "Les pochettes ZIPBAGS® offrent une solution d'emballage tout-en-un; aucun bouchon, couvercle ou insert requis. L'emballage flexible coûte généralement trois à six fois moins cher par unité qu'un emballage rigide",
      icon: <DollarSign className="h-6 w-6" />,
    },
    {
      id: 5,
      title: "Commodité client",
      description: "Les consommateurs apprécient la commodité. Nos sachets debout sont conçus avec des encoches de déchirure faciles à ouvrir, des fermetures à glissière hermétiques refermables et prennent moins de place sur les étagères que les bouteilles, canettes et pots rigides traditionnels.",
      icon: <ThumbsUp className="h-6 w-6" />,
    },
    {
      id: 6,
      title: "Frais d'entreposage et d'expédition",
      description: "Nos pochettes ZIPBAGS® sont expédiés et stockés à plat, ce qui nécessite beaucoup moins d'espace d'entrepôt. De plus, la légèreté des sacs debout réduit considérablement les coûts d'expédition par rapport aux bouteilles, bocaux et autres contenants rigides.",
      icon: <Package className="h-6 w-6" />,
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-12 sm:py-16 ">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="inline-flex items-center gap-2 bg-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-sm border border-green-100 mb-4 sm:mb-6"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <span className="text-xs sm:text-sm font-medium text-green-800 tracking-wider uppercase">
              Innovation • Excellence • Performance
            </span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
            Les Avantages <span className="text-green-600">ZIPBAGS®</span>
          </h2>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Découvrez pourquoi nos solutions d'emballage révolutionnent l'industrie avec des avantages inégalés
          </p>
        </motion.div>

        {/* Card Grid - Strict 2 columns on mobile */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advantageCards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: card.id * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -4,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
              }}
              className="relative col-span-1"
            >
              <div className="h-full bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md overflow-hidden border border-gray-100 transition-all duration-300 group">
                {/* Card Content */}
                <div className="p-4 sm:p-6 h-full flex flex-col">
                  {/* Icon */}
                  <div className="mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors duration-300">
                    {card.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-600 flex-grow">
                    {card.description}
                  </p>
                </div>

                {/* Active indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2 sm:px-8 sm:py-3 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Link href="/products">
              Découvrir toute la gamme
            </Link>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}