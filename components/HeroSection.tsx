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
                    {/* Mobile Carousel - Above text content */}
                    <div className="w-full md:hidden mb-8">
                        <div className="relative overflow-hidden h-[300px] rounded-2xl">
                            {/* Mobile carousel with horizontal scroll - All 21 images repeated */}
                            <div className="flex gap-4 animate-scroll-horizontal">
                                {/* Repeat all 21 images multiple times for continuous scroll */}
                                {Array.from({ length: 5 }).map((_, repeatIndex) =>
                                    heroData.carouselImages.map((image, imageIndex) => (
                                        <div
                                            key={`mobile-${repeatIndex}-${image.id}-${imageIndex}`}
                                            className="flex-shrink-0"
                                        >
                                            <Image
                                                src={image.src}
                                                alt={`${image.alt} - Set ${repeatIndex + 1}`}
                                                className="object-cover rounded-lg shadow-lg select-none pointer-events-none w-[180px] h-[280px]"
                                                width={180}
                                                height={280}
                                                draggable={false}
                                                priority={repeatIndex === 0 && imageIndex < 5}
                                                loading={repeatIndex === 0 && imageIndex < 5 ? "eager" : "lazy"}
                                            />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

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
                        <div className="hidden md:block relative overflow-hidden h-[600px] mt-[-100px] py-4">
                            {/* Top blur gradient */}
                            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
                            {/* Bottom blur gradient */}
                            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>

                            {/* Simple 3-Column Carousel */}
                            <div className="hidden md:block relative w-full max-w-6xl mx-auto overflow-hidden h-[600px]">
                                <div className="flex gap-8 h-full justify-center">
                                    {/* Column 1 - All 21 images, scrolls up */}
                                    <div className="flex flex-col gap-6 animate-scroll-up">
                                        {Array.from({ length: 6 }).map((_, setIndex) => (
                                            <React.Fragment key={`col1-set-${setIndex}`}>
                                                {heroData.carouselImages.map((image, index) => (
                                                    <div
                                                        key={`col1-${setIndex}-${image.id}-${index}`}
                                                        className="flex-shrink-0"
                                                    >
                                                        <Image
                                                            src={image.src}
                                                            alt={image.alt}
                                                            className="object-cover rounded-lg shadow-lg select-none pointer-events-none w-[200px] h-[250px]"
                                                            width={200}
                                                            height={250}
                                                            draggable={false}
                                                            priority={setIndex === 0 && index < 3}
                                                        />
                                                    </div>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    {/* Column 2 - All 21 images reversed, scrolls down */}
                                    <div className="flex flex-col gap-6 animate-scroll-down">
                                        {Array.from({ length: 6 }).map((_, setIndex) => (
                                            <React.Fragment key={`col2-set-${setIndex}`}>
                                                {[...heroData.carouselImages].reverse().map((image, index) => (
                                                    <div
                                                        key={`col2-${setIndex}-${image.id}-${index}`}
                                                        className="flex-shrink-0"
                                                    >
                                                        <Image
                                                            src={image.src}
                                                            alt={image.alt}
                                                            className="object-cover rounded-lg shadow-lg select-none pointer-events-none w-[200px] h-[250px]"
                                                            width={200}
                                                            height={250}
                                                            draggable={false}
                                                            priority={setIndex === 0 && index < 3}
                                                        />
                                                    </div>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    {/* Column 3 - All 21 images shuffled, scrolls up slower */}
                                    <div className="flex flex-col gap-6 animate-scroll-up-slow">
                                        {Array.from({ length: 6 }).map((_, setIndex) => (
                                            <React.Fragment key={`col3-set-${setIndex}`}>
                                                {heroData.carouselImages
                                                    .slice()
                                                    .sort(() => 0.5 - Math.random())
                                                    .map((image, index) => (
                                                    <div
                                                        key={`col3-${setIndex}-${image.id}-${index}`}
                                                        className="flex-shrink-0"
                                                    >
                                                        <Image
                                                            src={image.src}
                                                            alt={image.alt}
                                                            className="object-cover rounded-lg shadow-lg select-none pointer-events-none w-[200px] h-[250px]"
                                                            width={200}
                                                            height={250}
                                                            draggable={false}
                                                            priority={setIndex === 0 && index < 3}
                                                        />
                                                    </div>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
