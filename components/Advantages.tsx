'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Recycle, Lock, TrendingUp, DollarSign, ThumbsUp, Package } from 'lucide-react';

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

  // Card variants for dramatic opening animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateY: 180,
      transformOrigin: "center"
    },
    show: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15,
        duration: 0.8
      }
    }
  };

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-green-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20 relative">
          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.15 } : { opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-green-300 filter blur-3xl -z-10"
          />

          <div className="inline-block mb-4 relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-2 rounded-full text-white text-sm font-medium shadow-md"
            >
              Pourquoi choisir ZIPBAGS®
            </motion.div>
          </div>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 50 }}
            className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 relative"
          >
            Les Avantages <span className="text-green-600 relative">
              ZIPBAGS®
              <motion.span
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : { width: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute bottom-1 left-0 h-1 bg-green-400 rounded-full"
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Nos pochettes offrent de nombreuses fonctionnalités et avantages pour améliorer votre gamme de produits.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {shuffledCards.map((card, index) => (
              <motion.div
                key={card.id}
                custom={index}
                layout
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                  y: -5
                }}
                style={{ perspective: "1000px" }}
                className="relative bg-white rounded-2xl shadow-lg overflow-hidden group"
              >
                {/* Card content */}
                <div className="h-full flex flex-col">
                  {/* Card header with icon */}
                  <div className="p-6 relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-12 -mt-12 z-0"></div>
                    <div className="flex items-center relative z-10">
                      <div className="mr-4 bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-xl text-white shadow-md">
                        {card.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-6 pb-6 flex-grow">
                    <p className="text-gray-600 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Card footer with decorative elements */}
                  <div className="relative h-2">
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-green-500 to-green-400"></div>
                    <div className="absolute bottom-0 left-0 w-0 h-2 bg-gradient-to-r from-green-600 to-green-400 group-hover:w-full transition-all duration-700"></div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-0 left-0 w-16 h-16 bg-green-100 rounded-full -ml-8 -mt-8 opacity-50"></div>
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mb-10 opacity-50"></div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
