"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MultiProductQuoteDialog } from "@/components/quote/MultiProductQuoteDialog"
import { ArrowRight, Sparkles } from "lucide-react"
import { useRef } from "react"

const heroData = {
    title: "Le packaging flexible qui",
    subtitle: "valorise votre marque",
    description: "Solutions d'emballage premium pour e-commerce et retail. Personnalisez vos doypacks avec notre expertise tunisienne.",
    cta1: "Découvrir Nos Produits",
    cta2: "Demander Un Devis",
    ctaLink: "/products",

    images: [
        { src: "/Doypacks.png", alt: "Large kraft doypack", size: "large" },
        { src: "/doypack-Tunisie-ecologique-e-commerce.png", alt: "Silver doypack with window", size: "small" }
    ]
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

                    {/* Right Content - Images with CSS-based mobile optimization */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative flex justify-center items-center min-h-[400px] md:min-h-[650px] mt-[-50px] md:mt-[-100px] py-2 md:py-4">
                            {/* Background Kraft Doypack */}
                            <div className="absolute z-10 left-[-90px]">
                                <div className="md:hidden">
                                    {/* Static for Mobile */}
                                    <Image
                                        src="/doypacks-kraft-view-personalisée.png"
                                        alt="Kraft View Doypack"
                                        className="object-contain drop-shadow-2xl select-none pointer-events-none w-[250px] h-[300px] opacity-50"
                                        width={480}
                                        height={580}
                                        draggable={false}
                                    />
                                </div>
                                <div className="hidden md:block">
                                    {/* Animated for Desktop */}
                                    <motion.div
                                        animate={{
                                            y: [0, -15, 0],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <Image
                                            src="/doypacks-kraft-view-personalisée.png"
                                            alt="Kraft View Doypack"
                                            className="object-contain drop-shadow-2xl select-none pointer-events-none w-[480px] h-[580px] opacity-50"
                                            width={480}
                                            height={580}
                                            draggable={false}
                                        />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Right Zip Doypack */}
                            <div className="absolute z-20 right-[-30px]">
                                <div className="md:hidden">
                                    {/* Static for Mobile */}
                                    <Image
                                        src="/Doypacks-Zip.png"
                                        alt="Zip Doypack"
                                        className="object-contain drop-shadow-2xl select-none pointer-events-none w-[270px] h-[320px] opacity-60"
                                        width={520}
                                        height={620}
                                        draggable={false}
                                    />
                                </div>
                                <div className="hidden md:block">
                                    {/* Animated for Desktop */}
                                    <motion.div
                                        animate={{
                                            y: [0, -18, 0],
                                        }}
                                        transition={{
                                            duration: 3.5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: 0.5
                                        }}
                                    >
                                        <Image
                                            src="/Doypacks-Zip.png"
                                            alt="Zip Doypack"
                                            className="object-contain drop-shadow-2xl select-none pointer-events-none w-[520px] h-[620px] opacity-60"
                                            width={520}
                                            height={620}
                                            draggable={false}
                                        />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Main Center Doypack */}
                            <div className="relative z-30">
                                <div className="md:hidden">
                                    {/* Static for Mobile */}
                                    <Image
                                        src={heroData.images[0].src}
                                        alt={heroData.images[0].alt}
                                        className="object-contain drop-shadow-2xl select-none pointer-events-none w-[350px] h-[420px]"
                                        priority
                                        width={650}
                                        height={780}
                                        draggable={false}
                                    />
                                </div>
                                <div className="hidden md:block">
                                    {/* Animated for Desktop */}
                                    <motion.div
                                        animate={{
                                            y: [0, -20, 0],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <Image
                                            src={heroData.images[0].src}
                                            alt={heroData.images[0].alt}
                                            className="object-contain drop-shadow-2xl select-none pointer-events-none w-[650px] h-[780px]"
                                            priority
                                            width={650}
                                            height={780}
                                            draggable={false}
                                        />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Green Splash Effects - Desktop Only */}
                            <div className="hidden md:block">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.3, 0.6, 0.3],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Enhanced Bottom Decorative Elements - Desktop Only */}
            <div className="hidden md:block">
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2 }}
                />
            </div>
        </section>
    )
}
