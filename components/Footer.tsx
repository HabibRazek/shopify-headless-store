"use client"

import { ArrowRight, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function Footer() {
    const currentYear = new Date().getFullYear()
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
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

    return (
        <footer className="relative">

            {/* Main Green Footer */}
            <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
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

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-lg font-bold mb-4 text-white">NEWSLETTER</h4>
                            <p className="text-sm text-green-100 mb-4">
                                Recevez nos offres exclusives et actualités
                            </p>
                            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
                                    <Input
                                        type="email"
                                        placeholder="votre.email@exemple.com"
                                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-green-100 focus:border-white focus:ring-2 focus:ring-white/20 focus:bg-white/20 rounded-lg text-sm"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-white text-green-600 hover:bg-green-50 font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                                >
                                    {isSubmitting ? "..." : "S'INSCRIRE"}
                                </Button>
                            </form>
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
