"use client"

import { Phone, Mail, MapPin, ArrowRight, Send } from "lucide-react"
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "@/components/SocialIcons"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function Footer() {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast.error("Veuillez entrer votre adresse email")
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            toast.success("Merci pour votre inscription!", {
                description: "Vous recevrez bientôt nos dernières actualités."
            })
            setEmail("")
            setIsSubmitting(false)
        }, 1500)
    }

    const currentYear = new Date().getFullYear()

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
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    }

    return (
        <footer className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50">
            {/* Simple Background Elements */}
            <div className="absolute inset-0">
                {/* Subtle floating elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/30 rounded-full blur-3xl animate-float opacity-60" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-200/20 rounded-full blur-3xl animate-float opacity-40" style={{ animationDelay: '3s' }} />

                {/* Top border */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-8">

                {/* Simple Header - Mobile Optimized */}
                <motion.div
                    className="text-center mb-8 sm:mb-10 md:mb-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    <motion.div variants={itemVariants}>
                        <div className="flex items-center justify-center mb-4 sm:mb-6">
                            <Image
                                src="/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp"
                                alt="Packedin Logo"
                                width={80}
                                height={26}
                                className="opacity-80 sm:w-[100px] sm:h-[32px]"
                            />
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-800 mb-3 sm:mb-4 px-4">
                            Solutions d'Emballage Éco-Responsables
                        </h2>
                        <p className="text-base sm:text-lg text-green-700 max-w-2xl mx-auto leading-relaxed px-4">
                            Des solutions durables pour votre entreprise
                        </p>
                    </motion.div>
                </motion.div>

                {/* Main Content Grid - Mobile Responsive */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {/* Contact Information - Mobile Optimized */}
                    <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-green-200/50 hover:border-green-300 transition-all duration-300 shadow-lg hover:shadow-xl" variants={itemVariants}>
                        <div className="flex items-center mb-4 sm:mb-6">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-green-800">Nous Contacter</h3>
                                <p className="text-green-600 text-xs sm:text-sm">Restons en contact</p>
                            </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-start">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 mt-0.5">
                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-green-800 font-medium text-sm sm:text-base">Jasmin 8000 Nabeul</p>
                                    <p className="text-green-600 text-xs sm:text-sm">Tunisie</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 mt-0.5">
                                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                </div>
                                <div>
                                    <a href="tel:+21650095115" className="text-green-800 font-medium hover:text-green-600 transition-colors text-sm sm:text-base">
                                        +216 50 095 115
                                    </a>
                                    <p className="text-green-600 text-xs sm:text-sm">Lun-Ven: 8h00 - 17h00</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 mt-0.5">
                                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                </div>
                                <div>
                                    <a href="mailto:contact@packedin.com" className="text-green-800 font-medium hover:text-green-600 transition-colors text-sm sm:text-base break-all">
                                        contact@packedin.com
                                    </a>
                                    <p className="text-green-600 text-xs sm:text-sm">Réponse sous 24h</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Links - Mobile Optimized */}
                    <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-green-200/50 hover:border-green-300 transition-all duration-300 shadow-lg hover:shadow-xl" variants={itemVariants}>
                        <div className="flex items-center mb-4 sm:mb-6">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-green-800">Navigation</h3>
                                <p className="text-green-600 text-xs sm:text-sm">Explorez nos services</p>
                            </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            {[
                                { href: "/products", label: "Nos Produits" },
                                { href: "/collections", label: "Collections" },
                                { href: "/about", label: "À Propos" },
                                { href: "/contact", label: "Contact" }
                            ].map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="flex items-center text-green-700 hover:text-green-500 transition-colors group py-1"
                                >
                                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                    <span className="font-medium text-sm sm:text-base">{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Newsletter & Social - Mobile Optimized */}
                    <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-green-200/50 hover:border-green-300 transition-all duration-300 shadow-lg hover:shadow-xl md:col-span-2 lg:col-span-1" variants={itemVariants}>
                        <div className="flex items-center mb-4 sm:mb-6">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-green-800">Newsletter</h3>
                                <p className="text-green-600 text-xs sm:text-sm">Restez informé</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Input
                                    type="email"
                                    placeholder="Votre email"
                                    className="bg-white/70 border-green-200 text-green-800 placeholder:text-green-600 focus:border-green-500 transition-all duration-300 text-sm sm:text-base"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-green-500 hover:bg-green-600 text-white border-0 px-4 sm:px-6 text-sm sm:text-base"
                                >
                                    {isSubmitting ? "..." : "OK"}
                                </Button>
                            </div>
                        </form>

                        <div>
                            <h4 className="text-green-800 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Suivez-nous</h4>
                            <div className="flex space-x-2 sm:space-x-3">
                                {[
                                    { icon: <FacebookIcon className="h-3 w-3 sm:h-4 sm:w-4" />, label: "Facebook", href: "#" },
                                    { icon: <InstagramIcon className="h-3 w-3 sm:h-4 sm:w-4" />, label: "Instagram", href: "#" },
                                    { icon: <LinkedinIcon className="h-3 w-3 sm:h-4 sm:w-4" />, label: "LinkedIn", href: "#" }
                                ].map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center text-green-600 hover:text-green-700 transition-all duration-300 hover:scale-110"
                                        aria-label={social.label}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Bottom Section */}
                <motion.div
                    className="border-t border-green-200/50 pt-8"
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {/* Quote Section */}
                    <div className="text-center mb-8">
                        <blockquote className="text-base lg:text-lg text-green-700 italic max-w-3xl mx-auto leading-relaxed">
                            "Chez Packedin, nous nous engageons à fournir des solutions d'emballage éco-responsables qui respectent l'environnement tout en répondant aux besoins de votre entreprise."
                        </blockquote>
                        <div className="flex items-center justify-center mt-6">
                            <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent w-24" />
                            <div className="mx-4">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                            </div>
                            <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent w-24" />
                        </div>
                    </div>

                    {/* Copyright & Legal */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-green-200/50">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <Image
                                        src="/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp"
                                        alt="Packedin Logo"
                                        width={20}
                                        height={20}
                                        className="opacity-80"
                                    />
                                </div>
                                <div>
                                    <p className="text-green-800 font-semibold">
                                        © {currentYear} Packedin
                                    </p>
                                    <p className="text-green-600 text-sm">
                                        Tous droits réservés
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-6">
                                {[
                                    { href: "/mentions-legales", label: "Mentions Légales" },
                                    { href: "/privacy", label: "Confidentialité" },
                                    { href: "/terms", label: "CGV" }
                                ].map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        className="text-green-600 hover:text-green-500 transition-colors text-sm font-medium hover:underline decoration-green-500 underline-offset-4"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-6 pt-6 border-t border-green-200/50 text-center">
                            <p className="text-green-600 text-sm">
                                Développé avec ❤️ pour un avenir durable
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    )
}
