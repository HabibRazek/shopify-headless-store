'use client';

import Image from "next/image";
import { Star, ExternalLink, Users, Award, TrendingUp, Shield } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function References() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -30]);

    // Updated brand logos based on the files in the public folder with proper website links
    const brands = [
        {
            id: 1,
            name: "",
            logo: "/nos-references/logo_kartago.png",
            website: "https://kartagodattes.com/"
        },
        {
            id: 2,
            name: "",
            logo: "/nos-references/LOGO-LE-PANIER-3.png",
            website: "https://lepanier.net/product/mais-grille-au-fromage-laperitivo/"
        },
        {
            id: 3,
            name: "",
            logo: "/nos-references/logo-circle-small.webp",
            website: "https://masmoudi.com/"
        },
        {
            id: 4,
            name: "",
            logo: "/nos-references/cropped-Capture-removebg-preview-1.png",
            website: "https://my-oya.com/"
        },
        {
            id: 5,
            name: "",
            logo: "/nos-references/karina.webp",
            website: "https://karina.tn/?_ga=2.200218669.249647480.1750010777-185105044.1750010777"
        },
        {
            id: 6,
            name: "",
            logo: "/nos-references/LaMaisonCaroube.webp",
            website: "https://www.facebook.com/maisonkharoub/photos?locale=fr_FR&_ga=2.192755881.249647480.1750010777-185105044.1750010777"
        },
        {
            id: 7,
            name: "",
            logo: "/nos-references/monsapo.webp",
            website: "https://monsapo.tn/"
        },
        {
            id: 8,
            name: "",
            logo: "/nos-references/purnat.webp",
            website: "https://www.instagram.com/purnat_purnat/?hl=fr&_ga=2.191705257.249647480.1750010777-185105044.1750010777#"
        },
    ];

    return (
        <section className="relative py-16 md:py-24 overflow-hidden">
            {/* Enhanced Animated Background */}
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

            <motion.div
                className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
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
                            className=" -top-6 flex items-center justify-center -translate-x-1/2"
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <div className="mx-auto flex  ">
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
                                        <Star className="w-6 h-6 text-green-400 fill-current -mt-6" />
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

                {/* Moving Carousel */}
                <div className="relative overflow-hidden">
                    {/* Infinite Scrolling Container */}
                    <motion.div
                        className="flex gap-6"
                        animate={{
                            x: [0, -100 * brands.length]
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 20,
                                ease: "linear"
                            }
                        }}
                        style={{ width: `${200 * brands.length}%` }}
                    >
                        {/* First set of brands */}
                        {brands.map((brand) => (
                            <div
                                key={`first-${brand.id}`}
                                className="group relative flex-shrink-0 w-64"
                            >
                                <a
                                    href={brand.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                    aria-label={`Visiter le site de ${brand.name}`}
                                >
                                    {/* Card Container */}
                                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group-hover:border-green-300/50">
                                        {/* Logo Container */}
                                        <div className="relative h-20 w-full mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">
                                            <Image
                                                src={brand.logo}
                                                alt={brand.name}
                                                fill
                                                className="object-contain"
                                                sizes="200px"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Brand Name */}
                                        <div className="text-center">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                                                {brand.name}
                                            </h3>
                                            <div className="flex items-center justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <ExternalLink className="w-4 h-4 text-green-600" />
                                                <span className="text-sm text-green-600 ml-1">Visiter</span>
                                            </div>
                                        </div>

                                        {/* Hover Glow Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                                        {/* Corner Accent */}
                                        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-green-400/20 to-transparent rounded-tr-2xl rounded-bl-full" />
                                    </div>
                                </a>
                            </div>
                        ))}

                        {/* Second set of brands for seamless loop */}
                        {brands.map((brand) => (
                            <div
                                key={`second-${brand.id}`}
                                className="group relative flex-shrink-0 w-64"
                            >
                                <a
                                    href={brand.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                    aria-label={`Visiter le site de ${brand.name}`}
                                >
                                    {/* Card Container */}
                                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group-hover:border-green-300/50">
                                        {/* Logo Container */}
                                        <div className="relative h-20 w-full mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">
                                            <Image
                                                src={brand.logo}
                                                alt={brand.name}
                                                fill
                                                className="object-contain"
                                                sizes="200px"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Brand Name */}
                                        <div className="text-center">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                                                {brand.name}
                                            </h3>
                                            <div className="flex items-center justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <ExternalLink className="w-4 h-4 text-green-600" />
                                                <span className="text-sm text-green-600 ml-1">Visiter</span>
                                            </div>
                                        </div>

                                        {/* Hover Glow Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                                        {/* Corner Accent */}
                                        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-green-400/20 to-transparent rounded-tr-2xl rounded-bl-full" />
                                    </div>
                                </a>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}