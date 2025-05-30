'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Recycle, Lock, TrendingUp, DollarSign, ThumbsUp, Package, Sparkles, Star, Zap } from 'lucide-react';

interface AdvantageCard {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function Advantages() {
  const [shuffledCards, setShuffledCards] = useState<AdvantageCard[]>([]);
  const [hasShuffled, setHasShuffled] = useState(false);
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

  // Initialize shuffled cards
  useEffect(() => {
    setShuffledCards([...advantageCards]);
  }, []);

  // Shuffle cards when section comes into view
  useEffect(() => {
    if (isInView && !hasShuffled) {
      const timer = setTimeout(() => {
        shuffleCards();
        setHasShuffled(true);
      }, 300);

      return () => clearTimeout(timer);
    } else if (!isInView) {
      // Reset shuffle state when out of view
      setHasShuffled(false);
    }
  }, [isInView, hasShuffled]);

  // Function to shuffle the cards
  const shuffleCards = () => {
    // Create a copy of the current cards
    const currentCards = [...advantageCards];

    // Fisher-Yates shuffle algorithm
    for (let i = currentCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [currentCards[i], currentCards[j]] = [currentCards[j], currentCards[i]];
    }

    setShuffledCards(currentCards);
  };



  return (
    <section ref={sectionRef} className="relative py-16 overflow-hidden sm:mt-[-120px]">
      {/* Innovative Background Design */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-green-50/30" />

        {/* Geometric Patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #10b981 2px, transparent 2px), radial-gradient(circle at 75% 75%, #059669 1px, transparent 1px)`,
            backgroundSize: '60px 60px, 40px 40px'
          }} />
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Chic Header Design */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl px-8 py-4 rounded-full shadow-lg border border-green-200/50 mb-6">
            <Sparkles className="w-5 h-5 text-green-600" />
            <span className="text-sm font-bold text-green-800 tracking-wider uppercase">
              Innovation • Excellence • Performance
            </span>
            <Star className="w-5 h-5 text-green-600" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 relative">
            <span className="block text-gray-900 mb-2">Les Avantages</span>
            <span className="block bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
              ZIPBAGS®
            </span>

            {/* Decorative Elements */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full" />
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Découvrez pourquoi nos solutions d'emballage révolutionnent l'industrie avec des avantages inégalés
          </p>
        </div>

        {/* Innovative Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {shuffledCards.map((card) => (
            <div
              key={card.id}
              className="relative group hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300"
            >
                {/* Chic Card Design */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl overflow-hidden h-full">
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Card Content */}
                  <div className="relative z-10 p-8 h-full flex flex-col">
                    {/* Icon Section */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl blur-xl scale-110" />
                      <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <div className="relative z-10">
                          {card.icon}
                        </div>
                        {/* Icon Glow Effect */}
                        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Floating Accent */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-60" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed flex-grow font-light">
                      {card.description}
                    </p>

                    {/* Bottom Accent */}
                    <div className="mt-6 pt-4 border-t border-gray-200/50">
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full" />
                          <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full" />
                          <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full" />
                        </div>
                        <Zap className="w-5 h-5 text-green-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-100/30 to-transparent rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full -ml-12 -mb-12" />

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
