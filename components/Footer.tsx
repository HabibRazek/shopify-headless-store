"use client"

import { Phone, Mail, MapPin, Clock, ArrowRight, Send, Star, Award, Shield, Truck, Heart, Globe } from "lucide-react"
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

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 pb-8">

                {/* Simple Header */}
                <motion.div
                    className="text-center mb-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    <motion.div variants={itemVariants}>
                        <div className="flex items-center justify-center mb-6">
                            <Image
                                src="/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp"
                                alt="Packedin Logo"
                                width={100}
                                height={32}
                                className="opacity-80"
                            />
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-green-800 mb-4">
                            Solutions d'Emballage Éco-Responsables
                        </h2>
                        <p className="text-lg text-green-700 max-w-2xl mx-auto leading-relaxed">
                            Des solutions durables pour votre entreprise
                        </p>
                    </motion.div>
                </motion.div>

                {/* Main Content Grid */}
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {/* Contact Information */}
                    <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 hover:border-green-300 transition-all duration-300 shadow-lg hover:shadow-xl" variants={itemVariants}>
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-green-800">Nous Contacter</h3>
                                <p className="text-green-600 text-sm">Restons en contact</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-green-800 font-medium">Jasmin 8000 Nabeul</p>
                                    <p className="text-green-600 text-sm">Tunisie</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <Phone className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <a href="tel:+21650095115" className="text-green-800 font-medium hover:text-green-600 transition-colors">
                                        +216 50 095 115
                                    </a>
                                    <p className="text-green-600 text-sm">Lun-Ven: 8h00 - 17h00</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <Mail className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <a href="mailto:contact@packedin.com" className="text-green-800 font-medium hover:text-green-600 transition-colors">
                                        contact@packedin.com
                                    </a>
                                    <p className="text-green-600 text-sm">Réponse sous 24h</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 hover:border-green-300 transition-all duration-300 shadow-lg hover:shadow-xl" variants={itemVariants}>
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                <ArrowRight className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-green-800">Navigation</h3>
                                <p className="text-green-600 text-sm">Explorez nos services</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[
                                { href: "/products", label: "Nos Produits" },
                                { href: "/collections", label: "Collections" },
                                { href: "/about", label: "À Propos" },
                                { href: "/contact", label: "Contact" }
                            ].map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="flex items-center text-green-700 hover:text-green-500 transition-colors group"
                                >
                                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Newsletter & Social */}
                    <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 hover:border-green-300 transition-all duration-300 shadow-lg hover:shadow-xl" variants={itemVariants}>
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                <Send className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-green-800">Newsletter</h3>
                                <p className="text-green-600 text-sm">Restez informé</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="mb-6">
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Votre email"
                                    className="bg-white/70 border-green-200 text-green-800 placeholder:text-green-600 focus:border-green-500 transition-all duration-300"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-green-500 hover:bg-green-600 text-white border-0 px-6"
                                >
                                    {isSubmitting ? "..." : "OK"}
                                </Button>
                            </div>
                        </form>

                        <div>
                            <h4 className="text-green-800 font-semibold mb-4">Suivez-nous</h4>
                            <div className="flex space-x-3">
                                {[
                                    { icon: <FacebookIcon className="h-4 w-4" />, label: "Facebook", href: "#" },
                                    { icon: <InstagramIcon className="h-4 w-4" />, label: "Instagram", href: "#" },
                                    { icon: <LinkedinIcon className="h-4 w-4" />, label: "LinkedIn", href: "#" }
                                ].map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center text-green-600 hover:text-green-700 transition-all duration-300 hover:scale-110"
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
