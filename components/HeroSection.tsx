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
    heroImage: {
        src: "/hero.png",
        alt: "PackedIn - Solutions d'emballage premium"
    }
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
        <section ref={containerRef} className="relative h-[120vh] w-full  -mt-28">
            {/* Full Cover Background Image */}
            <div className="absolute inset-0 w-full h-full">
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
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40" />
                {/* Gradient overlay for enhanced visual depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
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

            <motion.div
                className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full h-full min-h-[120vh] flex items-center"
                style={{ y, opacity }}
            >
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-start w-full h-full pt-72 lg:pt-80">
                    {/* Floating Premium Badge - Top Right */}
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

                    {/* Main Content - Left Aligned */}
                    <div className="w-full lg:w-2/3 xl:w-1/2 text-center lg:text-left space-y-8">
                        {/* Premium Badge - Animated on Desktop, Static on Mobile */}
                        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 shadow-lg">
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
                            <span className="block text-white mb-2 drop-shadow-lg">
                                {heroData.title}
                            </span>
                            <span className="block bg-gradient-to-r from-green-400 via-green-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
                                {heroData.subtitle}
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 drop-shadow-md">
                            {heroData.description}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
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
                                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm px-8 py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto group">
                                        {heroData.cta2}
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
