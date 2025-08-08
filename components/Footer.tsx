"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
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

    return (
        <footer className="relative">
            {/* Top Banner */}
            <div className="bg-green-600 text-white py-3 mb-6 lg:mb-0">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm font-medium">
                        5% OFFERTS À L'INSCRIPTION... <span className="text-white font-bold">PROFITEZ-EN !</span>
                    </p>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="relative overflow-hidden">
                

                <div className="container mx-auto px-4 pt-8 -mt-8">
                    <div className="flex flex-col lg:flex-row items-end justify-center gap-8 lg:gap-12 relative">
                        {/* Phone Image - Hidden on mobile, visible on desktop */}
                        <div className="relative flex-shrink-0 mb-[-40px] lg:mb-[-60px] hidden lg:block">
                            <div className="relative">
                                <Image
                                    src="/packedin-phone.png"
                                    alt="Packedin Mobile App"
                                    width={200}
                                    height={400}
                                    className="max-w-[150px] lg:max-w-[200px] h-auto transform -rotate-2"
                                />
                            </div>
                        </div>

                        {/* Newsletter Content - Centered with enhanced styling */}
                        <div className="flex-1 max-w-lg text-center lg:text-left mb-8">
                            <div className="mb-6">
                                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3 leading-tight">
                                    Inscrivez-vous à notre{" "}
                                    <span className="text-green-600 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                                        NEWSLETTER
                                    </span>
                                </h3>
                                <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                                    et recevez nos offres exclusives et nos actualités en avant-première
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
                                <Input
                                    type="email"
                                    placeholder="votre.email@exemple.com"
                                    className="flex-1 bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg px-4 py-3 text-base shadow-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 hover:to-green-500 text-white px-8 py-3 font-semibold border-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-base"
                                >
                                    {isSubmitting ? "..." : "JE M'INSCRIS"}
                                </Button>
                            </form>

                            <div className="text-sm text-gray-500 space-y-2">
                                <p className="flex items-center justify-center lg:justify-start gap-2">
                                    <span className="text-green-500">✓</span>
                                    Informations sur les nouveautés, les actualités et les offres personnalisées
                                </p>
                                <p className="flex items-center justify-center lg:justify-start gap-2">
                                    <span className="text-green-500">✓</span>
                                    J'accepte les conditions générales et la politique de confidentialité
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Main Green Footer */}
            <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
                        {/* Qui Sommes-Nous */}
                        <div>
                            <h4 className="text-lg font-bold mb-4 text-white">QUI SOMMES-NOUS ?</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/about" className="hover:text-green-200 transition-colors inline-flex items-center">
                                        <ArrowRight className="w-3 h-3 mr-2" />
                                        Pourquoi choisir Packedin
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/collections" className="hover:text-green-200 transition-colors inline-flex items-center">
                                        <ArrowRight className="w-3 h-3 mr-2" />
                                        Fabrication tunisienne
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="hover:text-green-200 transition-colors inline-flex items-center">
                                        <ArrowRight className="w-3 h-3 mr-2" />
                                        Packedin
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/legal" className="hover:text-green-200 transition-colors inline-flex items-center">
                                        <ArrowRight className="w-3 h-3 mr-2" />
                                        Mentions légales
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Service Client */}
                        <div>
                            <h4 className="text-lg font-bold mb-4 text-white">SERVICE CLIENT</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/contact" className="hover:text-green-200 transition-colors inline-flex items-center">
                                        <ArrowRight className="w-3 h-3 mr-2" />
                                        Besoin d'aide
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="hover:text-green-200 transition-colors inline-flex items-center">
                                        <ArrowRight className="w-3 h-3 mr-2" />
                                        Protection des données
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shipping" className="hover:text-green-200 transition-colors inline-flex items-center">
                                        <ArrowRight className="w-3 h-3 mr-2" />
                                        Préparation des colis
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/returns" className="hover:text-green-200 transition-colors inline-flex items-center">
                                        <ArrowRight className="w-3 h-3 mr-2" />
                                        Retours et échanges
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Vos Questions */}
                        <div>
                            <h4 className="text-lg font-bold mb-4 text-white">VOS QUESTIONS</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/contact" className="hover:text-green-200 transition-colors inline-flex items-center">
                                        <ArrowRight className="w-3 h-3 mr-2" />
                                        Assistance & Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/faq" className="hover:text-green-200 transition-colors inline-flex items-center">
                                        <ArrowRight className="w-3 h-3 mr-2" />
                                        Questions fréquentes
                                    </Link>
                                </li>
                            </ul>
                        </div>


                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="bg-green-800 text-white py-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center">
                            <Image
                                src="/packedin.ico"
                                alt="Packedin Logo"
                                width={20}
                                height={20}
                                className="mr-3"
                            />
                            <p className="text-sm">
                                © {currentYear} Packedin. Tous droits réservés.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <Link href="/mentions-legales" className="hover:text-green-200 transition-colors">
                                Mentions Légales
                            </Link>
                            <Link href="/politique-confidentialite" className="hover:text-green-200 transition-colors">
                                Confidentialité
                            </Link>
                            <Link href="/conditions-generales" className="hover:text-green-200 transition-colors">
                                CGV
                            </Link>
                            <Link href="/contact" className="hover:text-green-200 transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
