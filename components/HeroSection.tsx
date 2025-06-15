"use client"

import Image from "next/image"
import Link from "next/link"
import { Package, Truck, Shield, Sparkles, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MultiProductQuoteDialog } from "@/components/quote/MultiProductQuoteDialog"

const heroData = {
    badge: "INNOVATION • QUALITÉ • EXCELLENCE",
    title: "Nos",
    highlight: "ZIPBAGS®",
    subtitle: "Emballage hermétique, refermable et thermoscellable",
    description: "La solution d'emballage parfaite pour les marques qui veulent se démarquer des emballages rigides traditionnels.",
    image: "/Doypacks.png",
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
        <section className="py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* Image - Top on mobile, Right on desktop */}
                    <div className="w-full lg:w-1/2 order-first lg:order-last">
                        <div className="relative aspect-square rounded-xl overflow-hidden ">
                            <Image
                                src={heroData.image}
                                alt={heroData.highlight}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Text Content - Bottom on mobile, Left on desktop */}
                    <div className="w-full lg:w-1/2 space-y-6">
                        <div className="inline-flex items-center  px-4 py-2 rounded-full">
                            <span className="text-xs font-bold text-green-800 uppercase">
                                {heroData.badge}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                            {heroData.title} <span className="text-green-600">{heroData.highlight}</span>
                        </h1>

                        <h2 className="text-xl md:text-2xl text-gray-800 font-medium">
                            {heroData.subtitle}
                        </h2>

                        <p className="text-gray-600 text-lg">
                            {heroData.description}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {heroData.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
                                    <div className="text-green-600">
                                        {feature.icon}
                                    </div>
                                    <span className="text-sm font-medium text-gray-800">{feature.title}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-10">
                            <Link href={heroData.ctaLink}>
                                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg w-full sm:w-auto">
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    {heroData.cta}
                                </Button>
                            </Link>

                            <MultiProductQuoteDialog
                                trigger={
                                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg w-full sm:w-auto">
                                        <Calculator className="mr-2 h-5 w-5" />
                                        Demander devis
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}