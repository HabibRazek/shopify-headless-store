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
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
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
                    <motion.div
                        className="w-full lg:w-1/2 space-y-8"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {/* Premium Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full border border-green-200/50 shadow-lg"
                        >
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="h-5 w-5 text-green-600" />
                            </motion.div>
                            <span className="text-sm font-bold text-green-700 tracking-wide">
                                PACKAGING PREMIUM TUNISIE
                            </span>
                        </motion.div>

                        {/* Main Title with Animation */}
                        <motion.h1
                            className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <span className="block text-black mb-2">
                                {heroData.title}
                            </span>
                            <span className="block bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 bg-clip-text text-transparent">
                                {heroData.subtitle}
                            </span>
                        </motion.h1>

                        {/* Enhanced Description */}
                        <motion.p
                            className="text-xl text-gray-600 leading-relaxed max-w-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            {heroData.description}
                        </motion.p>



                        {/* Enhanced CTA Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.2 }}
                        >
                            <Link href={heroData.ctaLink}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button className="bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 hover:to-[#77db19] text-white px-8 py-6 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto group relative overflow-hidden">
                                        <motion.div
                                            animate={{ x: ['-100%', '100%'] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        />
                                        <span className="relative z-10">{heroData.cta1}</span>
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
                                    </Button>

                                </motion.div>
                            </Link>

                            <MultiProductQuoteDialog
                                trigger={
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button variant="outline" className="border-green-500/30 text-green-500 hover:bg-green-500/10 px-8 py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto group">
                                            {heroData.cta2}
                                            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                        </Button>
                                    </motion.div>
                                }
                            />
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Wonderful Floating 3D Animation */}
                    <motion.div
                        className="w-full lg:w-1/2 relative"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="relative flex justify-center items-center min-h-[500px] md:min-h-[650px] mt-[-100px] py-2 md:py-4">


                            {/* Fixed Images with Simple Bounce Animation */}

                            {/* Background Kraft Doypack - Fixed Position */}
                            <motion.div
                                className="absolute z-10 left-[-90px]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
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
                                        className="object-contain drop-shadow-2xl select-none pointer-events-none w-[300px] h-[360px] md:w-[480px] md:h-[580px]"
                                        width={480}
                                        height={580}
                                        draggable={false}
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Right Zip Doypack - Fixed Position */}
                            <motion.div
                                className="absolute z-20 right-[-30px]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
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
                                        className="object-contain drop-shadow-2xl select-none pointer-events-none w-[320px] h-[380px] md:w-[520px] md:h-[620px]"
                                        width={520}
                                        height={620}
                                        draggable={false}
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Main Center Doypack - Fixed Position */}
                            <motion.div
                                className="relative z-30"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
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
                                        className="object-contain drop-shadow-2xl select-none pointer-events-none w-[400px] h-[480px] md:w-[650px] md:h-[780px]"
                                        priority
                                        width={650}
                                        height={780}
                                        draggable={false}
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Green Splash Effects */}
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

                            {/* Green Splash Circles */}
                            {[...Array(4)].map((_, i) => (
                                <motion.div
                                    key={`green-splash-${i}`}
                                    className="absolute rounded-full"
                                    style={{
                                        width: `${80 + i * 30}px`,
                                        height: `${80 + i * 30}px`,
                                        left: `${20 + i * 20}%`,
                                        top: `${30 + (i % 2) * 40}%`,
                                        background: `radial-gradient(circle, rgba(16, 185, 129, ${0.15 - i * 0.03}), transparent 70%)`,
                                        zIndex: 5
                                    }}
                                    animate={{
                                        scale: [0, 1.2, 0],
                                        opacity: [0, 0.8, 0],
                                    }}
                                    transition={{
                                        duration: 3 + i * 0.5,
                                        repeat: Infinity,
                                        delay: i * 0.8,
                                        ease: "easeOut"
                                    }}
                                />
                            ))}

                            {/* Simple Premium Quality Badge */}
                            <motion.div
                                className="absolute top-6 right-6 z-40"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 1.0 }}
                            >
                               
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Enhanced Bottom Decorative Elements */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
            />
        </section>
    )
}