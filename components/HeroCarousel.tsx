"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Package, Truck, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Enhanced hero slides with ZIPBAGS® content
const heroSlides = [
    {
        id: 1,
        badge: "INNOVATION • QUALITÉ • EXCELLENCE",
        title: "Nos",
        highlight: "ZIPBAGS®",
        subtitle: "Vous recherchez une option d'emballage hermétique, refermable et thermoscellable?",
        description: "Nos pochettes Zip sont le choix d'emballage pour les marques qui cherchent à sortir des emballages rigides traditionnels.",
        image: "/packedinPrintableDoypacks.png",
        cta: "Découvrir nos ZIPBAGS®",
        ctaLink: "/products",
        features: [
            { icon: <Shield className="h-6 w-6" />, title: "Hermétique", subtitle: "Protection optimale" },
            { icon: <Package className="h-6 w-6" />, title: "Refermable", subtitle: "Praticité maximale" },
            { icon: <Truck className="h-6 w-6" />, title: "Thermoscellable", subtitle: "Technologie avancée" }
        ]
    },
    {
        id: 2,
        badge: "EMBALLAGES PREMIUM • QUALITÉ SUPÉRIEURE",
        title: "Solutions",
        highlight: "PROFESSIONNELLES",
        subtitle: "Des emballages haut de gamme conçus pour valoriser vos produits avec élégance.",
        description: "Notre gamme complète d'emballages professionnels offre des solutions innovantes pour tous vos besoins de conditionnement.",
        image: "/packedinPrintableDoypacks.png",
        cta: "Voir nos solutions",
        ctaLink: "/collections",
        features: [
            { icon: <Package className="h-6 w-6" />, title: "Stock immédiat", subtitle: "Disponibilité garantie" },
            { icon: <Truck className="h-6 w-6" />, title: "Livraison rapide", subtitle: "Expédition express" },
            { icon: <Shield className="h-6 w-6" />, title: "Qualité premium", subtitle: "Matériaux supérieurs" }
        ]
    },
    {
        id: 3,
        badge: "INNOVATION • DESIGN • PERFORMANCE",
        title: "Emballages",
        highlight: "INNOVANTS",
        subtitle: "Révolutionnez votre packaging avec nos solutions d'emballage de nouvelle génération.",
        description: "Découvrez notre technologie avancée qui combine esthétique moderne et performance exceptionnelle pour vos produits.",
        image: "/packedinPrintableDoypacks3.png",
        cta: "Explorer l'innovation",
        ctaLink: "/about",
        features: [
            { icon: <Shield className="h-6 w-6" />, title: "Technologie avancée", subtitle: "Innovation continue" },
            { icon: <Package className="h-6 w-6" />, title: "Design moderne", subtitle: "Esthétique premium" },
            { icon: <Truck className="h-6 w-6" />, title: "Performance", subtitle: "Résultats garantis" }
        ]
    }
]

export default function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [direction, setDirection] = useState<'next' | 'prev' | null>(null)
    const [isHovering, setIsHovering] = useState(false)

    // Enhanced slide transition with direction awareness
    const goToSlide = useCallback((index: number, dir: 'next' | 'prev' = 'next') => {
        if (isTransitioning || index === currentIndex) return

        setIsTransitioning(true)
        setDirection(dir)
        setCurrentIndex(index)

        const timer = setTimeout(() => {
            setIsTransitioning(false)
            setDirection(null)
        }, 700)

        return () => clearTimeout(timer)
    }, [currentIndex, isTransitioning])

    const nextSlide = useCallback(() => {
        goToSlide((currentIndex + 1) % heroSlides.length, 'next')
    }, [currentIndex, goToSlide])

    const prevSlide = useCallback(() => {
        goToSlide((currentIndex - 1 + heroSlides.length) % heroSlides.length, 'prev')
    }, [currentIndex, goToSlide])

    // Auto-play with pause on hover
    useEffect(() => {
        if (isHovering) return

        const interval = setInterval(nextSlide, 6000)
        return () => clearInterval(interval)
    }, [nextSlide, isHovering])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prevSlide()
            if (e.key === 'ArrowRight') nextSlide()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [nextSlide, prevSlide])

    return (
        <section
            className="relative min-h-screen w-full overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Background Slides with Full Images */}
            <div className="absolute inset-0">
                {heroSlides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={cn(
                            "absolute inset-0 transition-all duration-700 ease-out",
                            index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                        )}
                    >
                        {/* Light Background with Product Images */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-white">
                            <Image
                                src={slide.image}
                                alt={`${slide.highlight} - Background`}
                                fill
                                className="object-cover object-center opacity-90"
                                priority={index === 0}
                            />
                            {/* Light overlay for better text contrast */}
                            <div className="absolute inset-0 bg-white/10" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 min-h-screen flex items-center pt-32 lg:pt-40">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="max-w-2xl">

                        {/* Content Section */}
                        <div className="space-y-6">
                            {/* Premium Brand Badge */}
                            <div className="inline-flex items-center bg-white/95 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-gray-200/50">
                                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-2 animate-pulse shadow-lg" />
                                <span className="text-xs font-bold text-green-800 tracking-wider uppercase">
                                    {heroSlides[currentIndex].badge}
                                </span>
                            </div>

                            {/* Hero Title */}
                            <div className="space-y-3">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                    {heroSlides[currentIndex].title}
                                </h1>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-none tracking-tight">
                                    {heroSlides[currentIndex].highlight}
                                </h1>
                            </div>

                            {/* Value Proposition */}
                            <div className="space-y-4">
                                <p className="text-base lg:text-lg text-gray-700 leading-relaxed max-w-xl">
                                    {heroSlides[currentIndex].description}
                                </p>
                            </div>

                            {/* CTA Button */}
                            <div className="pt-4">
                                <Link href={heroSlides[currentIndex].ctaLink}>
                                    <Button
                                        size="lg"
                                        className="group text-sm font-semibold px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <span className="flex items-center gap-2">
                                            {heroSlides[currentIndex].cta}
                                        </span>
                                    </Button>
                                </Link>
                            </div>

                            {/* Key Features */}
                            <div className="flex flex-wrap gap-4 pt-6">
                                {heroSlides[currentIndex].features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50">
                                        <div className="w-5 h-5 text-gray-600">
                                            {feature.icon}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{feature.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            index === currentIndex
                                ? 'w-8 bg-green-600'
                                : 'w-2 bg-gray-400 hover:bg-gray-500'
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <Button
                onClick={prevSlide}
                variant="secondary"
                size="icon"
                className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:shadow-lg transition-all duration-300 w-10 h-10"
                aria-label="Previous slide"
            >
                <ChevronLeft size={20} className="text-gray-700" />
            </Button>

            <Button
                onClick={nextSlide}
                variant="secondary"
                size="icon"
                className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:shadow-lg transition-all duration-300 w-10 h-10"
                aria-label="Next slide"
            >
                <ChevronRight size={20} className="text-gray-700" />
            </Button>
        </section>
    )
}
