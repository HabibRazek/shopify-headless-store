"use client"

import { Phone, Mail, MapPin, Clock, ArrowRight, Send } from "lucide-react"
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
        <footer className="relative text-white pt-10 pb-6 overflow-hidden">
            {/* Innovative Background */}
            <div className="absolute inset-0 -z-10">
                {/* Main gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-700 to-green-900"></div>

                {/* Animated gradient overlay */}
                <div className="absolute inset-0 opacity-30 bg-[linear-gradient(40deg,transparent_25%,rgba(68,64,60,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-gradient-shift"></div>

                {/* Mesh gradient effect */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-green-400/20 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-radial from-emerald-500/20 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
                    <div className="absolute top-1/2 left-1/3 w-1/2 h-1/2 bg-gradient-radial from-teal-400/20 to-transparent rounded-full blur-3xl transform -translate-y-1/2"></div>
                </div>

                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 bg-[url('/footer-pattern.svg')] bg-repeat opacity-5"></div>

                {/* Glass highlight at the top */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-green-300/50 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {/* Contact Information */}
                    <motion.div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl p-4 shadow-lg" variants={itemVariants}>
                        {/* Logo */}
                        <div className="flex items-center justify-start mb-4">
                            <Image
                                src="/logo-white.svg"
                                alt="Packedin.tn Logo"
                                width={60}
                                height={60}
                                className="opacity-90"
                            />
                            <div className="ml-3">
                                <h2 className="text-2xl font-bold text-white">Packedin.tn</h2>
                                <p className="text-green-300 text-xs">Solutions d'emballage éco-responsables</p>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-3 border-b border-green-600/30 pb-2">Nous Contacter</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center group">
                                <div className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center mr-2 group-hover:bg-white/10 transition-colors">
                                    <MapPin className="h-3 w-3 text-green-300" />
                                </div>
                                <span className="text-gray-100 group-hover:text-white transition-colors">Jasmin 8000 Nabeul, Tunisie</span>
                            </div>

                            <div className="flex items-center group">
                                <div className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center mr-2 group-hover:bg-white/10 transition-colors">
                                    <Phone className="h-3 w-3 text-green-300" />
                                </div>
                                <div>
                                    <a href="tel:+21650095115" className="text-gray-100 group-hover:text-white transition-colors">
                                        +216 50 095 115
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center group">
                                <div className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center mr-2 group-hover:bg-white/10 transition-colors">
                                    <Mail className="h-3 w-3 text-green-300" />
                                </div>
                                <a href="mailto:contact@packedin.tn" className="text-gray-100 group-hover:text-white transition-colors">
                                    contact@packedin.tn
                                </a>
                            </div>

                            <div className="flex items-center group">
                                <div className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center mr-2 group-hover:bg-white/10 transition-colors">
                                    <Clock className="h-3 w-3 text-green-300" />
                                </div>
                                <span className="text-gray-100 group-hover:text-white transition-colors">Lun-Ven: 8h00 - 17h00</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 shadow-lg" variants={itemVariants}>
                        <h3 className="text-xl font-bold mb-3 pb-2 border-b border-green-600/30">Liens Rapides</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {[
                                { href: "/products", label: "Nos Produits" },
                                { href: "/collections", label: "Collections" },
                                { href: "/about", label: "À Propos" },
                                { href: "/blog", label: "Blog" },
                                { href: "/faq", label: "FAQ" },
                                { href: "/contact", label: "Contact" }
                            ].map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="text-gray-100 hover:text-white transition-colors flex items-center group"
                                >
                                    <ArrowRight className="h-3 w-3 mr-0 opacity-0 group-hover:mr-1 group-hover:opacity-100 transition-all duration-300 text-green-300" />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Social Media & Newsletter */}
                    <motion.div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 shadow-lg" variants={itemVariants}>
                        <h3 className="text-xl font-bold mb-3 pb-2 border-b border-green-600/30">Suivez-Nous</h3>
                        <div className="flex space-x-3 mb-4">
                            {[
                                { icon: <FacebookIcon className="h-4 w-4" />, label: "Facebook", href: "#" },
                                { icon: <InstagramIcon className="h-4 w-4" />, label: "Instagram", href: "#" },
                                { icon: <LinkedinIcon className="h-4 w-4" />, label: "LinkedIn", href: "#" }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="bg-white/10 hover:bg-green-500/30 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-green-500/20"
                                    aria-label={social.label}
                                >
                                    <span className="sr-only">{social.label}</span>
                                    {social.icon}
                                </a>
                            ))}
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center">
                                <Send className="h-4 w-4 mr-1 text-green-300" />
                                Newsletter
                            </h4>
                            <form onSubmit={handleSubmit} className="flex space-x-2">
                                <Input
                                    type="email"
                                    placeholder="Votre email"
                                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-green-400 h-8 text-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-400 text-white font-medium transition-all h-8 px-3 text-xs hover:shadow-md hover:shadow-green-500/20 hover:translate-y-[-1px]"
                                    disabled={isSubmitting}
                                >
                                    OK
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Divider */}
                <div className="text-center my-6">
                    <p className="text-sm text-gray-300/80 italic max-w-2xl mx-auto">
                        "Chez Packedin.tn, nous nous engageons à fournir des solutions d'emballage éco-responsables qui respectent l'environnement tout en répondant aux besoins de votre entreprise."
                    </p>
                    <div className="h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent mt-6"></div>
                </div>

                {/* Copyright */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 shadow-lg flex flex-col md:flex-row justify-between items-center text-xs">
                    <div className="flex items-center mb-3 md:mb-0">
                        <div className="mr-2">
                            <Image
                                src="/logo-white.svg"
                                alt="Packedin.tn Logo"
                                width={30}
                                height={30}
                                className="opacity-90"
                            />
                        </div>
                        <p className="text-gray-300">
                            © {currentYear} Packedin.tn. Tous droits réservés.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                        {[
                            { href: "/mentions-legales", label: "Mentions Légales" },
                            { href: "/privacy", label: "Confidentialité" },
                            { href: "/terms", label: "CGV" }
                        ].map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="text-gray-300 hover:text-white transition-colors hover:underline decoration-green-400 underline-offset-2"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
