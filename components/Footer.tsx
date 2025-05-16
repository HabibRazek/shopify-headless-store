"use client"

import { Phone, Mail, MapPin, Clock, HelpCircle, ArrowRight, Send } from "lucide-react"
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
        <footer className="relative text-white pt-16 pb-8 overflow-hidden">
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
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {/* Contact Information */}
                    <motion.div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg" variants={itemVariants}>
                        {/* Logo */}
                        <div className="flex items-center justify-start mb-8">
                            <Image
                                src="/logo-white.svg"
                                alt="Packedin.tn Logo"
                                width={80}
                                height={80}
                                className="opacity-90"
                            />
                            <div className="ml-4">
                                <h2 className="text-3xl font-bold text-white">Packedin.tn</h2>
                                <p className="text-green-300 text-sm">Solutions d'emballage éco-responsables</p>
                            </div>
                        </div>

                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4">
                                <HelpCircle className="h-6 w-6 text-green-300" />
                            </div>
                            <h3 className="text-2xl font-bold">Nous Contacter</h3>
                        </div>

                        <p className="text-gray-100 mb-6 leading-relaxed">
                            Vous avez besoin d&apos;aide ? Gagnez du temps en trouvant une réponse en quelques clics !
                        </p>

                        <p className="text-gray-100 mb-8 leading-relaxed">
                            Chez Packedin.tn, notre équipe motivée et passionnée travaille avec enthousiasme chaque jour
                            pour vous offrir les meilleures solutions d&apos;emballage éco-responsable. Vous avez des questions
                            ou besoin de conseils ? N&apos;hésitez pas à nous contacter !
                        </p>

                        <div className="space-y-5">
                            <div className="flex items-start group">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 group-hover:bg-white/20 transition-colors">
                                    <MapPin className="h-5 w-5 text-green-300" />
                                </div>
                                <span className="text-gray-100 mt-2">Jasmin 8000 Nabeul, Tunisie</span>
                            </div>

                            <div className="flex items-start group">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 group-hover:bg-white/20 transition-colors">
                                    <Phone className="h-5 w-5 text-green-300" />
                                </div>
                                <div className="space-y-1 mt-1">
                                    <a href="tel:+21650095115" className="block text-gray-100 hover:text-white transition-colors">
                                        +216 50 095 115
                                    </a>
                                    <a href="tel:+21620387333" className="block text-gray-100 hover:text-white transition-colors">
                                        +216 20 387 333
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start group">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 group-hover:bg-white/20 transition-colors">
                                    <Mail className="h-5 w-5 text-green-300" />
                                </div>
                                <a href="mailto:contact@packedin.tn" className="text-gray-100 hover:text-white transition-colors mt-2">
                                    contact@packedin.tn
                                </a>
                            </div>

                            <div className="flex items-start group">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 group-hover:bg-white/20 transition-colors">
                                    <Clock className="h-5 w-5 text-green-300" />
                                </div>
                                <span className="text-gray-100 mt-2">Lun-Ven: 8h00 - 17h00</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg" variants={itemVariants}>
                        <h3 className="text-xl font-bold mb-8 pb-2 border-b border-green-600/30">Liens Rapides</h3>
                        <ul className="space-y-4">
                            {[
                                { href: "/products", label: "Nos Produits" },
                                { href: "/collections", label: "Collections" },
                                { href: "/about", label: "À Propos de Nous" },
                                { href: "/blog", label: "Blog & Actualités" },
                                { href: "/faq", label: "FAQ" },
                                { href: "/contact", label: "Contact" }
                            ].map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-100 hover:text-white transition-colors flex items-center group"
                                    >
                                        <ArrowRight className="h-4 w-0 mr-0 opacity-0 group-hover:w-4 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300 text-green-300" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Social Media & Newsletter */}
                    <motion.div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg" variants={itemVariants}>
                        <h3 className="text-xl font-bold mb-8 pb-2 border-b border-green-600/30">Suivez-Nous</h3>
                        <div className="flex space-x-4 mb-8">
                            {[
                                { icon: <FacebookIcon className="h-5 w-5" />, label: "Facebook", href: "#" },
                                { icon: <InstagramIcon className="h-5 w-5" />, label: "Instagram", href: "#" },
                                { icon: <LinkedinIcon className="h-5 w-5" />, label: "LinkedIn", href: "#" }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="bg-white/10 hover:bg-white/20 h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                                    aria-label={social.label}
                                >
                                    <span className="sr-only">{social.label}</span>
                                    {social.icon}
                                </a>
                            ))}
                        </div>

                        <div className="mt-8">
                            <h4 className="text-lg font-semibold mb-4 flex items-center">
                                <Send className="h-5 w-5 mr-2 text-green-300" />
                                Newsletter
                            </h4>
                            <p className="text-gray-100 mb-4 text-sm">
                                Abonnez-vous pour recevoir nos dernières actualités et offres spéciales.
                            </p>
                            <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                                <Input
                                    type="email"
                                    placeholder="Votre email"
                                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-green-400"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-400 text-white font-medium transition-colors w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Inscription..." : "S'inscrire"}
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent my-12"></div>

                {/* Copyright */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-6 md:mb-0">
                        <div className="mr-4">
                            <Image
                                src="/logo-white.svg"
                                alt="Packedin.tn Logo"
                                width={50}
                                height={50}
                                className="opacity-90"
                            />
                        </div>
                        <p className="text-gray-300 text-sm">
                            © {currentYear} Packedin.tn. Tous droits réservés.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        {[
                            { href: "/mentions-legales", label: "Mentions Légales" },
                            { href: "/privacy", label: "Politique de Confidentialité" },
                            { href: "/terms", label: "Conditions Générales" }
                        ].map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="text-gray-300 hover:text-white text-sm transition-colors"
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
