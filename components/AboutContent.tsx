'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutContent() {
  const [activeTab, setActiveTab] = useState('about');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  // Features data
  const features = [
    {
      id: 1,
      title: "INVENTAIRE DE STOCK PRÊT À EXPÉDIER",
      description: "Nous stockons de grandes quantités de sacs de stock. L'inventaire est disponible et prêt à être expédié.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    },
    {
      id: 2,
      title: "EXPÉDITION LE JOUR MÊME",
      description: "Passez votre commande avant 16 h et elle sera expédiée le même jour ouvrable.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "LIVRAISON GRATUITE",
      description: "Commandez 300 DT ou plus et la livraison est à nos frais!",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    {
      id: 4,
      title: "PRIX EN GROS ET REMISES",
      description: "Des réductions de prix substantielles offertes à 1k et 20k + pièces (par style et taille).",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 5,
      title: "RECONNU ET CERTIFIÉ",
      description: "Les produits de Packedin® sont certifiés et reconnus par des organisations internationales.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 6,
      title: "EMBALLAGE ÉCOLOGIQUE",
      description: "Packedin® disribue des doypack réutilisables, refermables et recyclés de la plus haute qualité.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      id: 7,
      title: "COMMANDE FACILE EN LIGNE",
      description: "De notre gamme de produits à notre processus de commande, tous est conçu pour vous faciliter la tâche. Les commandes peuvent être passées 24 heures sur 24, 7 jours sur 7.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white sm:mt-[-64px]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-10rem] right-[5rem] h-[30rem] w-[70rem] bg-gradient-to-b from-[#bdffad] to-transparent rounded-full blur-[9rem] opacity-70" />
          <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-5" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-block mb-4"
            >
              <div className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full text-green-700 text-sm font-medium shadow-sm">
                Notre histoire
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl lg:text-6xl"
            >
              À propos de la marque <span className="block text-green-700">PackedIn®</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-6 max-w-2xl text-xl text-gray-700"
            >
              Poussé par la conviction que Packedin® peut – et devrait – avoir un impact positif sur les petites entreprises que nous servons et sur le monde qui nous entoure.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center space-x-1 p-2" aria-label="Tabs">
            <motion.button
              onClick={() => setActiveTab('about')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`${
                activeTab === 'about'
                  ? 'bg-green-50 text-green-700 shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-700'
              } rounded-lg py-3 px-6 font-medium text-sm transition-all duration-200 flex items-center space-x-2`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Notre Histoire</span>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('mission')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`${
                activeTab === 'mission'
                  ? 'bg-green-50 text-green-700 shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-700'
              } rounded-lg py-3 px-6 font-medium text-sm transition-all duration-200 flex items-center space-x-2`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Notre Mission</span>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('features')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`${
                activeTab === 'features'
                  ? 'bg-green-50 text-green-700 shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-700'
              } rounded-lg py-3 px-6 font-medium text-sm transition-all duration-200 flex items-center space-x-2`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Pourquoi Nous Choisir</span>
            </motion.button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {activeTab === 'about' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Comment nous avons commencé</h2>
              <p className="text-lg text-gray-600">
                Packedin® a été fondée en 2020 par deux entrepreneurs et consultants export, Wahiba Ben Ali, expert marketing et Kacem Berkhais, ingénieur en électronique. Tout en recherchant des options d'emballage pour une nouvelle idée d'entreprise, nous sommes devenus très frustrés, dépassés et mal desservis par les grands fournisseurs d'emballages d'entreprise.
              </p>
              <p className="text-lg text-gray-600">
                C'est alors que nous nous sommes demandé : pourquoi pas nous ? Alors, sans arrière-pensée, nous avons décidé de plonger – nous avons décidé de créer l'entreprise que nous souhaitions exister – une marque d'emballage avec un point de vue, une entreprise qui soutenait les petites entreprises, simplifiait le processus d'achat et fournissait une collection sélectionnée de pochettes stand-up exceptionnels.
              </p>
              <p className="text-lg text-gray-600">
                Notre objectif depuis le début était de fournir des solutions d'emballages innovantes mais simples magnifiquement construits pour une protection ultime du produit. De plus, nous étions déterminés à produire des emballages qui aidaient les marques à raconter leur histoire. Depuis ce temps, les petites entreprises, les artisans et les artisans du monde entier ont trouvé leur chemin vers notre site, pour lequel nous sommes très reconnaissants.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="relative h-96 rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/packedinPrintableDoypacks.png"
                alt="PackedIn Zipbag Kraft Tunisie"
                fill
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'mission' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants} className="order-2 lg:order-1 relative h-96 rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/packedinPrintableDoypacks3.png"
                alt="Doypack Tunisie Écologique E-commerce"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Où nous allons</h2>
              <p className="text-lg text-gray-600">
                Notre engagement pour l'avenir commence par l'amélioration de nos normes de fourniture de matériaux d'emballage respectueux de l'environnement et l'élargissement de notre offre de produits. Packedin® promet de faire notre part pour garantir que nous proposons des choix plus durables.
              </p>
              <p className="text-lg text-gray-600">
                Nos objectifs sont élevés et ils ne se réaliseront pas du jour au lendemain ; nous évoluons. Alors rejoignez-nous, avec d'autres visionnaires partageant les mêmes idées.
              </p>
              <div className="pt-4">
                <h3 className="text-2xl font-bold text-gray-900">Pourquoi PackedIn® ?</h3>
                <p className="mt-2 text-lg text-gray-600">
                  Packedin® fournis fièrement de magnifiques pochettes zip stand-up fabriqués avec des matériaux de la plus haute qualité et respectueux de l'environnement.
                </p>
                <p className="mt-2 text-lg text-gray-600">
                  Nous adoptons une approche moderne de l'expérience d'emballage flexible. En conséquence, les consommateurs et les marques bénéficient des nombreux avantages offerts par nos produits, notamment : la commodité, la réutilisation et la fonctionnalité.
                </p>
                <p className="mt-2 text-lg text-gray-600">
                  Packedin® est une filiale de la société « Kings Worldwide Distribution ». Nous sommes des commerçants, des créatifs et des croyants. Tout ce que nous faisons est d'élever l'ordinaire et de confondre le sage.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'features' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900">Pourquoi Choisir PackedIn®</h2>
              <p className="mt-4 text-lg text-gray-600">
                Nous ne sommes pas une entreprise – nous sommes une équipe de vraies personnes passionnées par ce que nous faisons. Ayant une profonde compréhension que cette entreprise est un cadeau, nous avons la grande responsabilité de servir les autres avec intégrité et excellence.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <motion.div
                  key={feature.id}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 group"
                >
                  <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-50 p-3 rounded-xl text-green-600 mr-4 group-hover:bg-green-100 transition-colors duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-6 pl-16">{feature.description}</p>
                    <div className="pl-16">
                      <Link
                        href="/products"
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors duration-300 text-sm font-medium"
                      >
                        Commandez chez PackedIn
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
