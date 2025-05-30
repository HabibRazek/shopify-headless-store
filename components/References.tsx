'use client';

import Image from "next/image";
import { Star, Quote, ExternalLink, Users, Award, TrendingUp } from "lucide-react";

export default function References() {
    // Updated brand logos based on the files in the public folder with proper website links
    const brands = [
        {
            id: 1,
            name: "Kartago",
            logo: "/logo_kartago.png",
            website: "https://kartagodattes.com/"
        },
        {
            id: 2,
            name: "Le Panier",
            logo: "/LOGO-LE-PANIER-3.png",
            website: "https://lepanier.net/product/mais-grille-au-fromage-laperitivo/"
        },
        {
            id: 3,
            name: "Masmoudi",
            logo: "/logo-circle-small.webp",
            website: "https://masmoudi.com/"
        },
        {
            id: 4,
            name: "My Oya",
            logo: "/cropped-Capture-removebg-preview-1.png",
            website: "https://my-oya.com/"
        }
    ];

    return (
        <section className="relative py-20 overflow-hidden">
            {/* Innovative Background Design */}
            <div className="absolute inset-0">
                {/* Modern Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-green-50/50" />

                {/* Geometric Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="h-full w-full" style={{
                        backgroundImage: `
                            linear-gradient(90deg, #10b981 1px, transparent 1px),
                            linear-gradient(180deg, #10b981 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-purple-400/10 to-green-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Innovative Header */}
                <div className="text-center mb-20">
                    {/* Stats Row */}
                    <div className="flex justify-center items-center gap-8 mb-8">
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50">
                            <Users className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-gray-700">50+ Clients</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50">
                            <Award className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-semibold text-gray-700">98% Satisfaction</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50">
                            <TrendingUp className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-gray-700">5+ Années</span>
                        </div>
                    </div>

                    {/* Main Title */}
                    <div className="relative">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 relative">
                            <span className="block text-gray-900 mb-2">Ils nous font</span>
                            <span className="block bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                                CONFIANCE
                            </span>
                        </h2>

                        {/* Decorative Elements */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="flex space-x-1">
                                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                            </div>
                        </div>

                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full" />
                    </div>

                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Découvrez les marques prestigieuses qui nous font confiance et témoignent de notre excellence
                    </p>
                </div>

                {/* Innovative Brand Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {brands.map((brand) => (
                        <div
                            key={brand.id}
                            className="group relative"
                        >
                            <a
                                href={brand.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                                aria-label={`Visiter le site de ${brand.name}`}
                            >
                                {/* Card Container */}
                                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group-hover:border-green-300/50">
                                    {/* Logo Container */}
                                    <div className="relative h-20 w-full mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">
                                        <Image
                                            src={brand.logo}
                                            alt={brand.name}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 150px, 200px"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Brand Name */}
                                    <div className="text-center">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                                            {brand.name}
                                        </h3>
                                        <div className="flex items-center justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <ExternalLink className="w-4 h-4 text-green-600" />
                                            <span className="text-sm text-green-600 ml-1">Visiter</span>
                                        </div>
                                    </div>

                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                                    {/* Corner Accent */}
                                    <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-green-400/20 to-transparent rounded-tr-2xl rounded-bl-full" />
                                </div>
                            </a>
                        </div>
                    ))}
                </div>

                {/* Innovative Testimonials */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Testimonial 1 */}
                    <div className="group relative">
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6">
                                <Quote className="w-8 h-8 text-green-500/30" />
                            </div>

                            {/* Rating Stars */}
                            <div className="flex space-x-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <blockquote className="text-lg text-gray-700 mb-8 leading-relaxed font-light">
                                "PackedIn nous fournit des solutions d'emballage innovantes depuis plus de 3 ans.
                                Leur professionnalisme et la qualité de leurs produits sont exceptionnels."
                            </blockquote>

                            {/* Author */}
                            <div className="flex items-center">
                                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                                    LP
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-lg">Directeur Marketing</p>
                                    <a
                                        href="https://lepanier.net/product/mais-grille-au-fromage-laperitivo/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-700 transition-colors font-medium flex items-center gap-1"
                                    >
                                        Le Panier
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-green-100/50 to-transparent rounded-tl-3xl rounded-br-full" />
                            <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-blue-100/50 to-transparent rounded-br-3xl rounded-tl-full" />

                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                        </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="group relative">
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6">
                                <Quote className="w-8 h-8 text-green-500/30" />
                            </div>

                            {/* Rating Stars */}
                            <div className="flex space-x-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <blockquote className="text-lg text-gray-700 mb-8 leading-relaxed font-light">
                                "La qualité des pochettes ZIPBAGS® est incomparable. Notre produit est parfaitement
                                présenté et protégé, ce qui a considérablement amélioré notre image de marque."
                            </blockquote>

                            {/* Author */}
                            <div className="flex items-center">
                                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                                    KT
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-lg">Responsable Production</p>
                                    <a
                                        href="https://kartagodattes.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-700 transition-colors font-medium flex items-center gap-1"
                                    >
                                        Kartago
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-100/50 to-transparent rounded-tl-3xl rounded-br-full" />
                            <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-green-100/50 to-transparent rounded-br-3xl rounded-tl-full" />

                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
