"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MultiProductQuoteDialog } from "@/components/quote/MultiProductQuoteDialog";
import { ArrowRight, Sparkles, Calculator } from "lucide-react";

const heroData = {
    title: "Le packaging flexible",
    subtitle: " qui valorise votre marque",
    description: "Solutions d'emballage premium pour e-commerce et retail. Personnalisez vos doypacks avec notre expertise tunisienne.",
    cta1: "Découvrir Nos Produits",
    cta2: "Demander Un Devis",
    ctaLink: "/products",
    heroImage: {
        src: "/hero.png",
        alt: "PackedIn - Solutions d'emballage premium"
    }
};

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

    return (
        <div ref={containerRef} className="relative h-[120vh] w-full -mt-28 overflow-hidden">
            {/* Professional Hero Background - Desktop */}
            <div className="absolute inset-0 w-full h-full hidden md:block">
                <Image
                    src={heroData.heroImage.src}
                    alt={heroData.heroImage.alt}
                    fill
                    className="object-cover object-center select-none pointer-events-none w-full h-full"
                    draggable={false}
                    priority
                    sizes="100vw"
                    style={{ objectPosition: 'center center', objectFit: 'cover' }}
                />
                {/* Enhanced dark overlay effects */}
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-black/25" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />
                {/* Enhanced vignette effect */}
                <div className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.35) 100%)'
                    }} />
                {/* Professional shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent" />
            </div>

            {/* Professional Mobile Background */}
            <div className="absolute inset-0 w-full h-full md:hidden">
                <Image
                    src="/hero.png"
                    alt="PackedIn - Solutions d'emballage premium"
                    fill
                    className="object-cover object-center select-none pointer-events-none w-full h-full"
                    draggable={false}
                    priority
                    sizes="100vw"
                    style={{ objectPosition: 'center center', objectFit: 'cover' }}
                />
                {/* Lighter mobile overlay */}
                <div className="absolute inset-0 bg-black/15" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/5 to-black/20" />
                {/* Lighter mobile vignette */}
                <div className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.25) 100%)'
                    }} />
            </div>

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
                    className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/10 to-emerald-200/10 rounded-full blur-3xl"
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
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-3xl"
                />
            </div>

            {/* Desktop with animations - Centered */}
            <motion.div
                className="hidden md:flex container mx-auto px-6 sm:px-8 lg:px-12 relative z-20 w-full h-full min-h-[120vh] items-center justify-center"
                style={{ y, opacity }}
            >
                <div className="flex flex-col items-center justify-center w-full h-full text-center">
                    <motion.div
                        className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg hidden md:block"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-gray-800">Premium Quality</span>
                        </div>
                    </motion.div>

                    <div className="w-full text-center space-y-10 lg:space-y-12 max-w-5xl mx-auto">
                        <div
                            className="inline-flex items-center gap-2 bg-white backdrop-blur-md px-6 py-3 rounded-full border border-white/30 shadow-2xl relative overflow-hidden"
                            style={{
                                boxShadow: '0 0 30px rgba(255,255,255,0.3), 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse"></div>
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="relative z-10"
                            >
                                <Sparkles className="h-5 w-5 text-green-600 drop-shadow-sm" />
                            </motion.div>
                            <span
                                className="text-sm font-bold text-green-700 tracking-wide relative z-10"
                                style={{
                                    textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                                    filter: 'contrast(1.2)'
                                }}
                            >
                                PACKAGING PREMIUM TUNISIE
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight">
                            <span
                                className="block text-white mb-2 drop-shadow-2xl"
                                style={{
                                    textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                                    filter: 'contrast(1.1)'
                                }}
                            >
                                {heroData.title}
                            </span>
                            <span
                                className="block text-white drop-shadow-2xl"
                                style={{
                                    textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                                    filter: 'contrast(1.1)'
                                }}
                            >
                                {heroData.subtitle}
                            </span>
                        </h1>

                        <p
                            className="text-xl md:text-2xl text-white leading-relaxed max-w-3xl mx-auto px-4 lg:px-0"
                            style={{
                                textShadow: '0 4px 12px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.7)',
                                filter: 'contrast(1.1)'
                            }}
                        >
                            {heroData.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 pt-8 justify-center px-4 lg:px-0">
                            <Link href={heroData.ctaLink}>
                                <Button size="lg" className="group text-sm sm:text-base bg-gradient-to-r from-green-700 via-green-500 to-[#77db19] hover:from-green-800 hover:via-green-600 hover:to-[#77db19] text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden px-8 py-3 w-full sm:w-64">
                                    <span className="relative z-10">{heroData.cta1}</span>
                                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10 ml-2" />
                                </Button>
                            </Link>
                            <MultiProductQuoteDialog
                                trigger={
                                    <Button size="lg" className="text-sm sm:text-base px-8 py-3 w-full sm:w-64 group">
                                        {heroData.cta2}
                                        <Calculator className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Mobile without animations - Centered */}
            <div className="md:hidden container mx-auto px-6 sm:px-8 lg:px-12 relative z-20 w-full h-full min-h-[120vh] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center w-full h-full text-center">
                    <div className="w-full text-center space-y-8 lg:space-y-10 max-w-4xl mx-auto">
                        <div
                            className="inline-flex items-center gap-2 bg-white backdrop-blur-md px-6 py-3 rounded-full border border-white/30 shadow-2xl relative overflow-hidden"
                            style={{
                                boxShadow: '0 0 30px rgba(255,255,255,0.3), 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse"></div>
                            <Sparkles className="h-5 w-5 text-green-600 drop-shadow-sm relative z-10" />
                            <span
                                className="text-sm font-bold text-green-700 tracking-wide relative z-10"
                                style={{
                                    textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                                    filter: 'contrast(1.2)'
                                }}
                            >
                                PACKAGING PREMIUM TUNISIE
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight">
                            <span
                                className="block text-white mb-2 drop-shadow-2xl"
                                style={{
                                    textShadow: '0 4px 8px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.7)',
                                    filter: 'contrast(1.1)'
                                }}
                            >
                                {heroData.title}
                            </span>
                            <span
                                className="block text-white drop-shadow-2xl"
                                style={{
                                    textShadow: '0 4px 8px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.7)',
                                    filter: 'contrast(1.1)'
                                }}
                            >
                                {heroData.subtitle}
                            </span>
                        </h1>

                        <p
                            className="text-xl md:text-2xl text-white leading-relaxed max-w-3xl mx-auto px-4"
                            style={{
                                textShadow: '0 4px 12px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.8)',
                                filter: 'contrast(1.1)'
                            }}
                        >
                            {heroData.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 pt-8 justify-center px-4">
                            <Link href={heroData.ctaLink}>
                                <Button size="lg" className="group text-sm sm:text-base bg-gradient-to-r from-green-700 via-green-500 to-[#77db19] hover:from-green-800 hover:via-green-600 hover:to-[#77db19] text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden px-8 py-3 w-full sm:w-64">
                                    <span className="relative z-10">{heroData.cta1}</span>
                                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10 ml-2" />
                                </Button>
                            </Link>
                            <MultiProductQuoteDialog
                                trigger={
                                    <Button size="lg" className="text-sm sm:text-base px-8 py-3 w-full sm:w-64 group">
                                        {heroData.cta2}
                                        <Calculator className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
