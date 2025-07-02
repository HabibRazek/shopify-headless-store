'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ProductCategories() {
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
        <section className="relative">
            {/* Decorative Elements */}
            <div className="absolute bottom-0 right-0 w-full h-2 bg-gradient-to-l from-green-600 via-green-500 to-green-400 transform skew-y-1"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-center mb-6 leading-tight">
                            <span className="text-green-600">Quel que soit votre produit,</span><br />
                            <span className="text-black">nous avons la pochette qu'il vous faut.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-5xl mx-auto">
                            Avec notre expérience dans des secteurs variés – des biscuits aux produits ménagers – nous vous garantissons un emballage
                            qui ne se contente pas d'être beau : il préserve aussi toute la fraîcheur de vos produits.
                        </p>
                    </motion.div>
                </div>

                {/* Categories Grid */}
                <div className="flex justify-center">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-8 lg:gap-12 max-w-7xl">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="flex flex-col items-center group cursor-pointer"
                            >
                                {/* Circular Image Container */}
                                <div className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                                        <Image
                                            src={category.image}
                                            alt={category.alt}
                                            fill
                                            className="object-cover rounded-full"
                                            sizes="(max-width: 768px) 96px, (max-width: 1024px) 112px, 128px"
                                        />
                                    </div>

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 rounded-full bg-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                {/* Category Title */}
                                <h3 className="text-sm md:text-base lg:text-lg font-bold text-green-600 text-center leading-tight max-w-24 md:max-w-28 lg:max-w-32">
                                    {category.title}
                                </h3>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom decorative line */}
                <div className="flex justify-center mt-16">
                    <div className="w-32 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full"></div>
                </div>
            </div>
        </section>
    );
}