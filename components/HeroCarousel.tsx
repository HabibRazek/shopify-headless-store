"use client"

import Image from "next/image"
import Link from "next/link"
import { Package, Truck, Shield, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

// Single hero data with awesome design
const heroData = {
    badge: "INNOVATION • QUALITÉ • EXCELLENCE",
    title: "Nos",
    highlight: "ZIPBAGS®",
    subtitle: "Vous recherchez une option d'emballage hermétique, refermable et thermoscellable?",
    description: "Nos pochettes Zip sont le choix d'emballage pour les marques qui cherchent à sortir des emballages rigides traditionnels.",
    image: "/packedinPrintableDoypacks3.png",
    cta: "Découvrir nos ZIPBAGS®",
    ctaLink: "/products",
    features: [
        { icon: <Shield className="h-5 w-5" />, title: "Hermétique", subtitle: "Protection optimale" },
        { icon: <Package className="h-5 w-5" />, title: "Refermable", subtitle: "Praticité maximale" },
        { icon: <Truck className="h-5 w-5" />, title: "Thermoscellable", subtitle: "Technologie avancée" }
    ]
}

export default function HeroSection() {

    return (
        <section className="relative min-h-screen w-full overflow-hidden">
            {/* Single Background Image */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-white">
                <Image
                    src={heroData.image}
                    alt={`${heroData.highlight} - Background`}
                    fill
                    className="object-cover object-center opacity-90"
                    priority
                />
                {/* Light overlay for better text contrast */}
                <div className="absolute inset-0 bg-white/10" />
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 min-h-screen flex items-center pt-32 lg:pt-40">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="max-w-4xl">

                        {/* Content Section */}
                        <div className="space-y-8">
                            {/* Premium Brand Badge */}
                            <div className="inline-flex items-center bg-white/95 backdrop-blur-xl px-6 py-3 rounded-full shadow-lg border border-gray-200/50">
                                <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-3 animate-pulse shadow-lg" />
                                <span className="text-sm font-bold text-green-800 tracking-wider uppercase">
                                    {heroData.badge}
                                </span>
                            </div>

                            {/* Hero Title with Awesome Typography */}
                            <div className="space-y-4">
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 leading-none tracking-tight">
                                    <span className="block">{heroData.title}</span>
                                    <span className="block bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 bg-clip-text text-transparent drop-shadow-sm">
                                        {heroData.highlight}
                                    </span>
                                </h1>
                                <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                            </div>

                            {/* Subtitle with Beautiful Typography */}
                            <div className="space-y-6">
                                <h2 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-800 leading-relaxed max-w-3xl">
                                    {heroData.subtitle}
                                </h2>

                                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl font-light">
                                    {heroData.description}
                                </p>
                            </div>

                            {/* CTA Button */}
                            <div className="pt-6">
                                <Link href={heroData.ctaLink}>
                                    <Button
                                        size="lg"
                                        className="group text-lg font-semibold px-8 py-4 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-lg"
                                    >
                                        <span className="flex items-center gap-3">
                                            <Sparkles className="w-5 h-5" />
                                            {heroData.cta}
                                        </span>
                                    </Button>
                                </Link>
                            </div>

                            {/* Key Features */}
                            <div className="flex flex-wrap gap-4 pt-8">
                                {heroData.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                                        <div className="w-6 h-6 text-green-600">
                                            {feature.icon}
                                        </div>
                                        <span className="text-base font-semibold text-gray-800">{feature.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>


        </section>
    )
}
