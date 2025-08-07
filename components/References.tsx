'use client';

import Image from "next/image";
import { Star, Users, Award, TrendingUp, Shield } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function References() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -30]);

    // Updated brand logos with correct image paths
    const brands = [
        {
            id: 1,
            name: "Kartago Dattes",
            logo: "/images/nos-references/logo_kartago.png",
            website: "https://kartagodattes.com/",
            category: "Alimentaire"
        },
        {
            id: 2,
            name: "Le Panier",
            logo: "/images/nos-references/LOGO-LE-PANIER-3.png",
            website: "https://lepanier.net/product/mais-grille-au-fromage-laperitivo/",
            category: "Snacks"
        },
        {
            id: 3,
            name: "Masmoudi",
            logo: "/images/nos-references/logo-circle-small.webp",
            website: "https://masmoudi.com/",
            category: "Pâtisserie"
        },
        {
            id: 4,
            name: "My Oya",
            logo: "/images/nos-references/cropped-Capture-removebg-preview-1.png",
            website: "https://my-oya.com/",
            category: "Cosmétique"
        },
        {
            id: 5,
            name: "Karina",
            logo: "/images/nos-references/karina.webp",
            website: "https://karina.tn/?_ga=2.200218669.249647480.1750010777-185105044.1750010777",
            category: "Mode"
        },
        {
            id: 6,
            name: "La Maison Caroube",
            logo: "/images/nos-references/LaMaisonCaroube.webp",
            website: "https://www.facebook.com/maisonkharoub/photos?locale=fr_FR&_ga=2.192755881.249647480.1750010777-185105044.1750010777",
            category: "Bio"
        },
        {
            id: 7,
            name: "Mon Sapo",
            logo: "/images/nos-references/monsapo.webp",
            website: "https://monsapo.tn/",
            category: "Cosmétique"
        },
        {
            id: 8,
            name: "Purnat",
            logo: "/images/nos-references/purnat.webp",
            website: "https://www.instagram.com/purnat_purnat/?hl=fr&_ga=2.191705257.249647480.1750010777-185105044.1750010777#",
            category: "Naturel"
        },
    ];

    return (
        <section className="relative py-16 md:py-24 overflow-hidden">
            {/* Enhanced Animated Background - Desktop only */}
            <div className="absolute inset-0 overflow-hidden hidden md:block">
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
                        scale: [1.1, 1, 1.1],
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

            {/* Mobile Version - No Animations */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 md:hidden">
                {/* Enhanced Header */}
                <div className="text-center mb-20">
                    {/* Static Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] rounded-full mb-8 shadow-xl">
                        <Shield className="w-8 h-8 text-white" />
                    </div>

                    {/* Static Stats Row */}
                    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-12">
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-200/50">
                            <Users className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-bold text-black">50+ Clients</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-200/50">
                            <Award className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-bold text-black">98% Satisfaction</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-200/50">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-bold text-black">5+ Années</span>
                        </div>
                    </div>

                    {/* Static Main Title */}
                    <div className="relative">
                        {/* Static Decorative Stars */}
                        <div className="flex items-center justify-center mb-6">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i}>
                                        <Star className="w-6 h-6 text-green-400 fill-current" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 relative">
                            <span className="block text-black mb-2">Ils nous font</span>
                            <span className="block text-green-500">
                                CONFIANCE
                            </span>
                        </h2>
                    </div>

                    <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
                        Découvrez les marques prestigieuses qui nous font confiance et témoignent de notre excellence
                    </p>
                </div>

                {/* Static Logo Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 lg:gap-12 max-w-6xl mx-auto">
                    {brands.map((brand) => (
                        <div
                            key={brand.id}
                            className="group relative flex items-center justify-center"
                        >
                            <a
                                href={brand.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full"
                                aria-label={`Visiter le site de ${brand.name}`}
                            >
                                {/* Clean Logo Container */}
                                <div className="relative h-20 md:h-24 lg:h-28 w-full p-4">
                                    <div className="relative h-full w-full">
                                        <Image
                                            src={brand.logo}
                                            alt={brand.name}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 150px, (max-width: 1024px) 200px, 250px"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop Version - With Animations */}
            <motion.div
                className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 hidden md:block"
                style={{ y }}
            >
                {/* Enhanced Header */}
                <div className="text-center mb-20">
                    {/* Animated Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
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
                            <Shield className="w-8 h-8 text-white" />
                        </motion.div>
                    </motion.div>

                    {/* Enhanced Stats Row */}
                    <motion.div
                        className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <motion.div
                            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-200/50"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Users className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-bold text-black">50+ Clients</span>
                        </motion.div>
                        <motion.div
                            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-200/50"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Award className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-bold text-black">98% Satisfaction</span>
                        </motion.div>
                        <motion.div
                            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-200/50"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-bold text-black">5+ Années</span>
                        </motion.div>
                    </motion.div>

                    {/* Enhanced Main Title */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        {/* Enhanced Decorative Stars */}
                        <motion.div
                            className="flex items-center justify-center mb-6"
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 10, 0]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.1
                                        }}
                                    >
                                        <Star className="w-6 h-6 text-green-400 fill-current" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.h2
                            className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 relative"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <span className="block text-black mb-2">Ils nous font</span>
                            <span className="block text-green-500">
                                CONFIANCE
                            </span>
                        </motion.h2>
                    </motion.div>

                    <motion.p
                        className="text-xl text-black max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        Découvrez les marques prestigieuses qui nous font confiance et témoignent de notre excellence
                    </motion.p>
                </div>

                {/* Professional Logo Grid */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 lg:gap-12 max-w-6xl mx-auto"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    {brands.map((brand, index) => (
                        <motion.div
                            key={brand.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 100
                            }}
                            whileHover={{
                                scale: 1.1,
                                transition: { duration: 0.3 }
                            }}
                            className="group relative flex items-center justify-center"
                        >
                            <a
                                href={brand.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full"
                                aria-label={`Visiter le site de ${brand.name}`}
                            >
                                {/* Clean Logo Container */}
                                <div className="relative h-20 md:h-24 lg:h-28 w-full p-4 transition-all duration-300">
                                    <div className="relative h-full w-full">
                                        <Image
                                            src={brand.logo}
                                            alt={brand.name}
                                            fill
                                            className="object-contain transition-all duration-300 group-hover:scale-105"
                                            sizes="(max-width: 768px) 150px, (max-width: 1024px) 200px, 250px"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            </a>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}