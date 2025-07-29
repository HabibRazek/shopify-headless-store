'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Package } from 'lucide-react';
import Image from 'next/image';

export default function ProductCategories() {
    // Parallax scroll effects
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);

    const categories = [
        {
            id: 1,
            title: "Café",
            image: "/cafe.jpg", // You'll need to add these images
            alt: "Coffee beans"
        },
        {
            id: 2,
            title: "Chocolat",
            image: "/chocolat.webp",
            alt: "Chocolate products"
        },
        {
            id: 3,
            title: "Aliments & snacks",
            image: "/snacks.webp",
            alt: "Food and snacks"
        },
        {
            id: 4,
            title: "Nourriture pour animaux",
            image: "/croquette.webp",
            alt: "Pet food"
        },
        {
            id: 5,
            title: "Santé & beauté",
            image: "/beaute.jpg",
            alt: "Health and beauty products"
        },
        {
            id: 6,
            title: "Thé & Tisanes",
            image: "/tisane.jpg",
            alt: "Tea and herbal teas"
        },
        {
            id: 7,
            title: "Épices",
            image: "/epices.webp",
            alt: "Spices"
        }
    ];

    return (
        <section className="relative py-16 md:py-24 overflow-hidden">
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
                style={{ y, scale }}
            >
                {/* Enhanced Header Section */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
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
                                <Package className="w-8 h-8 text-white" />
                            </motion.div>
                        </motion.div>

                        <motion.h2
                            className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-8 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <span className="text-green-500">Quel que soit votre produit,</span><br />
                            <span className="text-black">nous avons la pochette qu'il vous faut.</span>
                        </motion.h2>

                        <motion.p
                            className="text-xl md:text-2xl text-black leading-relaxed max-w-5xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Avec notre expérience dans des secteurs variés – des biscuits aux produits ménagers – nous vous garantissons un emballage
                            qui ne se contente pas d'être beau : il préserve aussi toute la fraîcheur de vos produits.
                        </motion.p>
                    </motion.div>
                </div>

                {/* Enhanced Categories Grid */}
                <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    {/* Mobile: Custom layout to handle 7 items nicely */}
                    <div className="block sm:hidden max-w-sm mx-auto">
                        {/* First row: 3 items */}
                        <div className="grid grid-cols-3 gap-6 mb-8 justify-items-center">
                            {categories.slice(0, 3).map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                    whileHover={{
                                        scale: 1.1,
                                        y: -10,
                                        transition: { duration: 0.3 }
                                    }}
                                    className="flex flex-col items-center group cursor-pointer"
                                >
                                    {/* Enhanced Circular Image Container */}
                                    <motion.div
                                        className="relative w-20 h-20 mb-3"
                                        whileHover={{ rotate: 5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Glowing background */}
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                opacity: [0.3, 0.6, 0.3],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: index * 0.2
                                            }}
                                            className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-lg"
                                        />

                                        {/* Main image container */}
                                        <div className="relative w-full h-full rounded-full overflow-hidden border-3 border-white shadow-xl bg-white group-hover:border-green-200 transition-colors duration-300">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.3 }}
                                                className="w-full h-full"
                                            >
                                                <Image
                                                    src={category.image}
                                                    alt={category.alt}
                                                    fill
                                                    className="object-cover rounded-full"
                                                    sizes="80px"
                                                />
                                            </motion.div>
                                        </div>

                                        {/* Animated hover overlay */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileHover={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm"
                                        />
                                    </motion.div>

                                    {/* Enhanced Category Title */}
                                    <motion.h3
                                        className="text-xs font-bold text-green-500 text-center leading-tight max-w-20 group-hover:text-green-600 transition-colors duration-300"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {category.title}
                                    </motion.h3>
                                </motion.div>
                            ))}
                        </div>

                        {/* Second row: 2 items */}
                        <div className="grid grid-cols-2 gap-8 mb-8 justify-items-center">
                            {categories.slice(3, 5).map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.6,
                                        delay: (index + 3) * 0.1,
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                    whileHover={{
                                        scale: 1.1,
                                        y: -10,
                                        transition: { duration: 0.3 }
                                    }}
                                    className="flex flex-col items-center group cursor-pointer"
                                >
                                    {/* Enhanced Circular Image Container */}
                                    <motion.div
                                        className="relative w-24 h-24 mb-4"
                                        whileHover={{ rotate: 5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Glowing background */}
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                opacity: [0.3, 0.6, 0.3],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: (index + 3) * 0.2
                                            }}
                                            className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-lg"
                                        />

                                        {/* Main image container */}
                                        <div className="relative w-full h-full rounded-full overflow-hidden border-3 border-white shadow-xl bg-white group-hover:border-green-200 transition-colors duration-300">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.3 }}
                                                className="w-full h-full"
                                            >
                                                <Image
                                                    src={category.image}
                                                    alt={category.alt}
                                                    fill
                                                    className="object-cover rounded-full"
                                                    sizes="96px"
                                                />
                                            </motion.div>
                                        </div>

                                        {/* Animated hover overlay */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileHover={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm"
                                        />
                                    </motion.div>

                                    {/* Enhanced Category Title */}
                                    <motion.h3
                                        className="text-sm font-bold text-green-500 text-center leading-tight max-w-24 group-hover:text-green-600 transition-colors duration-300"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {category.title}
                                    </motion.h3>
                                </motion.div>
                            ))}
                        </div>

                        {/* Third row: 2 items centered */}
                        <div className="flex justify-center gap-8">
                            {categories.slice(5, 7).map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.6,
                                        delay: (index + 5) * 0.1,
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                    whileHover={{
                                        scale: 1.1,
                                        y: -10,
                                        transition: { duration: 0.3 }
                                    }}
                                    className="flex flex-col items-center group cursor-pointer"
                                >
                                    {/* Enhanced Circular Image Container */}
                                    <motion.div
                                        className="relative w-24 h-24 mb-4"
                                        whileHover={{ rotate: 5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Glowing background */}
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                opacity: [0.3, 0.6, 0.3],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: (index + 5) * 0.2
                                            }}
                                            className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-lg"
                                        />

                                        {/* Main image container */}
                                        <div className="relative w-full h-full rounded-full overflow-hidden border-3 border-white shadow-xl bg-white group-hover:border-green-200 transition-colors duration-300">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.3 }}
                                                className="w-full h-full"
                                            >
                                                <Image
                                                    src={category.image}
                                                    alt={category.alt}
                                                    fill
                                                    className="object-cover rounded-full"
                                                    sizes="96px"
                                                />
                                            </motion.div>
                                        </div>

                                        {/* Animated hover overlay */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileHover={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm"
                                        />
                                    </motion.div>

                                    {/* Enhanced Category Title */}
                                    <motion.h3
                                        className="text-sm font-bold text-green-500 text-center leading-tight max-w-24 group-hover:text-green-600 transition-colors duration-300"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {category.title}
                                    </motion.h3>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Tablet and Desktop: Original grid layout */}
                    <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-8 lg:gap-12 max-w-7xl">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                whileHover={{
                                    scale: 1.1,
                                    y: -10,
                                    transition: { duration: 0.3 }
                                }}
                                className="flex flex-col items-center group cursor-pointer"
                            >
                                {/* Enhanced Circular Image Container */}
                                <motion.div
                                    className="relative w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 mb-6"
                                    whileHover={{ rotate: 5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Glowing background */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            opacity: [0.3, 0.6, 0.3],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: index * 0.2
                                        }}
                                        className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-lg"
                                    />

                                    {/* Main image container */}
                                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white group-hover:border-green-200 transition-colors duration-300">
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full h-full"
                                        >
                                            <Image
                                                src={category.image}
                                                alt={category.alt}
                                                fill
                                                className="object-cover rounded-full"
                                                sizes="(max-width: 768px) 112px, (max-width: 1024px) 128px, 144px"
                                            />
                                        </motion.div>
                                    </div>

                                    {/* Animated hover overlay */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm"
                                    />

                                    {/* Floating sparkles */}
                                    {[...Array(3)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                y: [0, -15, 0],
                                                opacity: [0, 1, 0],
                                                scale: [0.5, 1, 0.5],
                                            }}
                                            transition={{
                                                duration: 2 + i * 0.5,
                                                repeat: Infinity,
                                                delay: i * 0.3 + index * 0.1,
                                            }}
                                            className={`absolute w-2 h-2 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full opacity-0 group-hover:opacity-100`}
                                            style={{
                                                left: `${20 + i * 25}%`,
                                                top: `${10 + (i % 2) * 70}%`,
                                            }}
                                        />
                                    ))}
                                </motion.div>

                                {/* Enhanced Category Title */}
                                <motion.h3
                                    className="text-sm md:text-base lg:text-lg font-bold text-green-500 text-center leading-tight max-w-28 md:max-w-32 lg:max-w-36 group-hover:text-green-600 transition-colors duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {category.title}
                                </motion.h3>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

            </motion.div>
        </section>
    );
}