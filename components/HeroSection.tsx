"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MultiProductQuoteDialog } from "@/components/quote/MultiProductQuoteDialog"
import { ArrowRight, Sparkles } from "lucide-react"
import React, { useRef } from "react"

const heroData = {
    title: "Le packaging flexible qui",
    subtitle: "valorise votre marque",
    description: "Solutions d'emballage premium pour e-commerce et retail. Personnalisez vos doypacks avec notre expertise tunisienne.",
    cta1: "Découvrir Nos Produits",
    cta2: "Demander Un Devis",
    ctaLink: "/products",

    // Generate array of 21 hero images
    carouselImages: Array.from({ length: 21 }, (_, i) => ({
        src: `/images/hero/${i + 1}.jpg`,
        alt: `Packaging solution ${i + 1}`,
        id: i + 1
    }))
}

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

    return (
        <section ref={containerRef} className="relative min-h-screen overflow-hidden">
            {/* Animated Background Elements - Desktop Only */}
            <div className="absolute inset-0 overflow-hidden hidden md:block">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.1, 1, 1.1],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200/15 to-purple-200/15 rounded-full blur-3xl"
                />
            </div>

            <motion.div
                className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10"
                style={{ y, opacity }}
            >
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 min-h-[80vh]">
                    {/* Left Content - Enhanced Text */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        {/* Premium Badge - Animated on Desktop, Static on Mobile */}
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full border border-green-200/50 shadow-lg">
                            <div className="hidden md:block">
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                >
                                    <Sparkles className="h-5 w-5 text-green-600" />
                                </motion.div>
                            </div>
                            <div className="md:hidden">
                                <Sparkles className="h-5 w-5 text-green-600" />
                            </div>
                            <span className="text-sm font-bold text-green-700 tracking-wide">
                                PACKAGING PREMIUM TUNISIE
                            </span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight">
                            <span className="block text-black mb-2">
                                {heroData.title}
                            </span>
                            <span className="block bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 bg-clip-text text-transparent">
                                {heroData.subtitle}
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                            {heroData.description}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href={heroData.ctaLink}>
                                <Button size="lg" className="bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 hover:to-[#77db19] text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto group relative overflow-hidden">
                                    {/* Animated background shine - Desktop only */}
                                    <div className="hidden md:block">
                                        <motion.div
                                            animate={{ x: ['-100%', '100%'] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        />
                                    </div>
                                    <span className="relative z-10">{heroData.cta1}</span>
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
                                </Button>
                            </Link>
                            <MultiProductQuoteDialog
                                trigger={
                                    <Button variant="outline" className="border-green-500/30 text-green-500 hover:bg-green-500/10 px-8 py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto group">
                                        {heroData.cta2}
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Button>
                                }
                            />
                        </div>
                    </div>

                    {/* Right Content - Vertical Carousel */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative overflow-hidden h-[600px] mt-[-50px] md:mt-[-100px] py-2 md:py-4">
                            {/* Top blur gradient */}
                            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
                            {/* Bottom blur gradient */}
                            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>

                            {/* Vertical Carousel Container */}
                            <div className="relative h-full flex justify-center overflow-hidden">
                                <div className="grid grid-cols-3 gap-4 md:gap-6">
                                    {/* Column 1 - Slides Up */}
                                    <motion.div
                                        className="flex flex-col gap-4"
                                        initial={{ y: 800 }}
                                        animate={{
                                            y: [800, -2000],
                                        }}
                                        transition={{
                                            duration: 25,
                                            repeat: Infinity,
                                            ease: "linear",
                                            repeatType: "loop"
                                        }}
                                    >
                                        {/* Multiple sets for truly infinite scroll */}
                                        {Array.from({ length: 6 }).map((_, setIndex) => (
                                            <React.Fragment key={`col1-set-${setIndex}`}>
                                                {heroData.carouselImages.filter((_, index) => index % 3 === 0).map((image, index) => (
                                                    <motion.div
                                                        key={`col1-${setIndex}-${image.id}`}
                                                        className="flex-shrink-0"
                                                        whileHover={{ scale: 1.1, rotate: 8 }}
                                                        initial={{ rotate: -3 }}
                                                        animate={{ rotate: [-3, 3, -3] }}
                                                        transition={{
                                                            rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                                                            hover: { duration: 0.3 }
                                                        }}
                                                    >
                                                        <Image
                                                            src={image.src}
                                                            alt={image.alt}
                                                            className="object-cover rounded-xl shadow-xl select-none pointer-events-none w-[140px] h-[180px] md:w-[180px] md:h-[240px]"
                                                            width={180}
                                                            height={240}
                                                            draggable={false}
                                                            priority={setIndex === 0 && index < 2}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </motion.div>

                                    {/* Column 2 - Slides Down */}
                                    <motion.div
                                        className="flex flex-col gap-4"
                                        style={{ marginTop: '40px' }}
                                        initial={{ y: -2000 }}
                                        animate={{
                                            y: [-2000, 800],
                                        }}
                                        transition={{
                                            duration: 30,
                                            repeat: Infinity,
                                            ease: "linear",
                                            repeatType: "loop"
                                        }}
                                    >
                                        {/* Multiple sets for truly infinite scroll */}
                                        {Array.from({ length: 6 }).map((_, setIndex) => (
                                            <React.Fragment key={`col2-set-${setIndex}`}>
                                                {heroData.carouselImages.filter((_, index) => index % 3 === 1).map((image, index) => (
                                                    <motion.div
                                                        key={`col2-${setIndex}-${image.id}`}
                                                        className="flex-shrink-0"
                                                        whileHover={{ scale: 1.1, rotate: -8 }}
                                                        initial={{ rotate: 2 }}
                                                        animate={{ rotate: [2, -2, 2] }}
                                                        transition={{
                                                            rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                                                            hover: { duration: 0.3 }
                                                        }}
                                                    >
                                                        <Image
                                                            src={image.src}
                                                            alt={image.alt}
                                                            className="object-cover rounded-xl shadow-xl select-none pointer-events-none w-[140px] h-[180px] md:w-[180px] md:h-[240px]"
                                                            width={180}
                                                            height={240}
                                                            draggable={false}
                                                            priority={setIndex === 0 && index < 2}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </motion.div>

                                    {/* Column 3 - Slides Up */}
                                    <motion.div
                                        className="flex flex-col gap-4"
                                        style={{ marginTop: '80px' }}
                                        initial={{ y: 600 }}
                                        animate={{
                                            y: [600, -2200],
                                        }}
                                        transition={{
                                            duration: 28,
                                            repeat: Infinity,
                                            ease: "linear",
                                            repeatType: "loop"
                                        }}
                                    >
                                        {/* Multiple sets for truly infinite scroll */}
                                        {Array.from({ length: 6 }).map((_, setIndex) => (
                                            <React.Fragment key={`col3-set-${setIndex}`}>
                                                {heroData.carouselImages.filter((_, index) => index % 3 === 2).map((image, index) => (
                                                    <motion.div
                                                        key={`col3-${setIndex}-${image.id}`}
                                                        className="flex-shrink-0"
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        initial={{ rotate: -1 }}
                                                        animate={{ rotate: [-1, 4, -1] }}
                                                        transition={{
                                                            rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                                                            hover: { duration: 0.3 }
                                                        }}
                                                    >
                                                        <Image
                                                            src={image.src}
                                                            alt={image.alt}
                                                            className="object-cover rounded-xl shadow-xl select-none pointer-events-none w-[140px] h-[180px] md:w-[180px] md:h-[240px]"
                                                            width={180}
                                                            height={240}
                                                            draggable={false}
                                                            priority={setIndex === 0 && index < 2}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
