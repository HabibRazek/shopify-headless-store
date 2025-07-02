"use client"

import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { MultiProductQuoteDialog } from "@/components/quote/MultiProductQuoteDialog"

const heroData = {
    title: "Le packaging flexible qui",
    subtitle: "valorise votre marque",
    cta1: "Découvrir Nos Produits",
    cta2: "Demander Un Devis",
    ctaLink: "/products",
    images: [
        { src: "/Doypacks.png", alt: "Large kraft doypack", size: "large" },
        { src: "/Doypacks.png", alt: "Medium kraft doypack", size: "medium" },
        { src: "/doypack-Tunisie-ecologique-e-commerce.png", alt: "Silver doypack with window", size: "small" }
    ]
}

export default function HeroSection() {
    return (
        <section className="relative min-h-[80vh] overflow-hidden sm:lg:mt-[-100px]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* Left Content - Text */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-600 leading-tight">
                            {heroData.title}
                            <br />
                            {heroData.subtitle}
                        </h1>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href={heroData.ctaLink}>
                                <Button className=" bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd]  text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
                                    {heroData.cta1}
                                </Button>
                            </Link>

                            <MultiProductQuoteDialog
                                trigger={
                                    <Button className=" bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] text-white px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 w-full sm:w-auto">
                                        {heroData.cta2}
                                    </Button>
                                }
                            />
                        </div>
                    </div>

                    {/* Right Content - Product Images */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative flex justify-center items-center min-h-[400px]">
                            {/* Large kraft doypack - leftmost */}
                            <div className="relative z-20">
                                <Image
                                    src={heroData.images[0].src}
                                    alt={heroData.images[0].alt}
                                    className="object-contain drop-shadow-2xl"
                                    priority
                                    width={5000}
                                    height={5000}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom decorative line */}
        </section>
    )
}