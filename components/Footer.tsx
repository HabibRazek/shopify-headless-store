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

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-lg font-bold mb-4 text-white">NOUS CONTACTER</h4>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="font-semibold text-green-100 mb-1">📍 Adresse</p>
                                    <p className="text-white">Megrine Business Center</p>
                                    <p className="text-white">Megrine, Ben Arous, Tunisie</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-green-100 mb-1">📞 Téléphone</p>
                                    <a href="tel:+21629362224" className="text-white hover:text-green-200 transition-colors">
                                        +216 29 362 224
                                    </a>
                                </div>
                                <div>
                                    <p className="font-semibold text-green-100 mb-1">📱 WhatsApp</p>
                                    <a href="https://wa.me/21620387333" className="text-white hover:text-green-200 transition-colors">
                                        +216 20 387 333
                                    </a>
                                </div>
                                <div>
                                    <p className="font-semibold text-green-100 mb-1">✉️ Email</p>
                                    <a href="mailto:packedin.tn@gmail.com" className="text-white hover:text-green-200 transition-colors">
                                        packedin.tn@gmail.com
                                    </a>
                                </div>
                                <div>
                                    <p className="font-semibold text-green-100 mb-1">🕒 Horaires</p>
                                    <p className="text-white">Lun-Ven: 8h-17h</p>
                                    <p className="text-white">Sam: 8h-12h</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="bg-green-800 text-white py-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col md:flex-row items-center gap-2">
                            <div className="flex items-center">
                                <Image
                                    src="/packedin.ico"
                                    alt="Packedin Logo"
                                    width={20}
                                    height={20}
                                    className="mr-3"
                                />
                                <div className="text-sm">
                                    <p>© {currentYear} Packedin (Kings Worldwide Distribution)</p>
                                    <p className="text-green-200 text-xs">Leader en emballages flexibles en Tunisie depuis 2021</p>
                                </div>
                            </div>
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
