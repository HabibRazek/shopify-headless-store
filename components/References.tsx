'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function References() {
    // Updated brand logos based on the files in the public folder with proper website links
    const brands = [
        {
            id: 1,
            name: "Kartago",
            logo: "/logo_kartago.png",
            website: "https://kartagodattes.tn/"
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
            website: "https://masmoudi.tn/"
        },
        {
            id: 4,
            name: "My Oya",
            logo: "/cropped-Capture-removebg-preview-1.png",
            website: "https://my-oya.com/"
        },
        {
            id: 5,
            name: "PackedIn",
            logo: "/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp",
            website: "/"
        }
    ];

    // Triple the array for smoother looping
    const triplicatedBrands = [...brands, ...brands, ...brands];

    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const scrollSpeed = 1; // pixels per frame
    const [isInView, setIsInView] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Check if section is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    // Automatic scrolling effect
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let animationId: number;
        let lastTimestamp: number | null = null;
        const direction = 1; // 1 for forward, -1 for backward if you want alternating

        const animate = (timestamp: number) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const deltaTime = timestamp - lastTimestamp;
            lastTimestamp = timestamp;

            if (!isHovered && container) {
                const maxScroll = container.scrollWidth - container.clientWidth;
                const currentScroll = container.scrollLeft;

                // Calculate new scroll position
                let newScroll = currentScroll + (scrollSpeed * direction * deltaTime / 16);

                // Seamlessly loop back when reaching the end
                if (newScroll >= maxScroll) {
                    newScroll = 0;
                } else if (newScroll <= 0) {
                    newScroll = maxScroll;
                }

                container.scrollLeft = newScroll;
            }

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [isHovered]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    return (
        <section ref={sectionRef} className="py-24 bg-gradient-to-b from-white to-green-50 overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-green-100 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-100 rounded-full opacity-10 blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.7, type: "spring" }}
                >
                    <div className="bg-gradient-to-r w-2/12 mx-auto mb-4 from-green-500 to-green-600 px-6 py-2 rounded-full text-white text-sm font-medium shadow-md">
                            Ils nous font confiance
                        </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 relative inline-block">
                        Nos <span className="text-green-600 relative">
                            Références
                            <motion.span
                                initial={{ width: 0 }}
                                animate={isInView ? { width: "100%" } : { width: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="absolute bottom-1 left-0 h-1 bg-green-400 rounded-full"
                            />
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Découvrez quelques-unes des marques prestigieuses qui nous font confiance pour leurs solutions d'emballage.
                    </p>
                </motion.div>

                {/* Auto-scrolling Brands */}
                <motion.div
                    className="relative overflow-hidden py-8 mb-16"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div
                        ref={containerRef}
                        className="flex overflow-x-auto scrollbar-hide"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{
                            scrollBehavior: isHovered ? 'smooth' : 'auto',
                        }}
                    >
                        {triplicatedBrands.map((brand, index) => (
                            <div
                                key={`${brand.id}-${index}`}
                                className="flex-shrink-0 px-12 flex items-center"
                            >
                                <a
                                    href={brand.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="focus:outline-none"
                                    aria-label={`Visiter le site de ${brand.name}`}
                                >
                                    <motion.div
                                        className="relative h-24 w-48 grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100 hover:scale-110"
                                        whileHover={{
                                            scale: 1.1,
                                            rotate: [0, -1, 1, -1, 0],
                                            transition: { duration: 0.5 }
                                        }}
                                    >
                                        <Image
                                            src={brand.logo}
                                            alt={brand.name}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 120px, 192px"
                                            loading="lazy"
                                        />
                                    </motion.div>
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* Gradient overlays */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/90 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/90 to-transparent z-10 pointer-events-none"></div>
                </motion.div>

                {/* Testimonials */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
                >
                    <motion.div
                        variants={itemVariants}
                        className="bg-white p-8 rounded-2xl shadow-lg border border-green-100 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 z-0 group-hover:bg-green-100 transition-colors duration-500"></div>
                        <div className="relative z-10">
                            <div className="text-green-500 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
                                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                                </svg>
                            </div>
                            <blockquote className="text-lg text-gray-700 italic mb-6">
                                PackedIn nous fournit des solutions d&apos;emballage innovantes depuis plus de 3 ans.
                                Leur professionnalisme et la qualité de leurs produits sont exceptionnels.
                            </blockquote>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl mr-4">
                                    LP
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Directeur Marketing</p>
                                    <a
                                        href="https://lepanier.net/product/mais-grille-au-fromage-laperitivo/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-700 hover:underline transition-colors focus:outline-none"
                                    >
                                        Le Panier
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="bg-white p-8 rounded-2xl shadow-lg border border-green-100 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 z-0 group-hover:bg-green-100 transition-colors duration-500"></div>
                        <div className="relative z-10">
                            <div className="text-green-500 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
                                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                                </svg>
                            </div>
                            <blockquote className="text-lg text-gray-700 italic mb-6">
                                La qualité des pochettes ZIPBAGS® est incomparable. Notre produit est parfaitement
                                présenté et protégé, ce qui a considérablement amélioré notre image de marque.
                            </blockquote>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl mr-4">
                                    KT
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Responsable Production</p>
                                    <a
                                        href="https://kartagodattes.tn/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-700 hover:underline transition-colors focus:outline-none"
                                    >
                                        Kartago
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
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
