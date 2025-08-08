"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Award,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi')
      }

      toast.success("Message envoyé avec succès!", {
        description: "Nous vous répondrons dans les plus brefs délais."
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: ""
      })
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message", {
        description: error instanceof Error ? error.message : "Veuillez réessayer ou nous contacter directement."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-white py-16 pt-44">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-black">Contactez nos </span>
              <span className="text-green-600">Experts</span>
            </h1>
            <p className="text-xl md:text-2xl text-black mb-8 leading-relaxed">
              Solutions d'emballage <span className="text-green-600 font-semibold">professionnelles</span> sur mesure pour votre entreprise
            </p>
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <Award className="w-6 h-6 text-white" />
                <span className="text-white font-semibold text-lg">Expertise depuis 2015</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-12 max-w-7xl mx-auto">

          {/* Top Section - Contact Info and Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
            {/* Google Maps */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Notre Localisation</h3>
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.8!2d10.7197611!3d36.4454991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x130299f0bbd2f331:0xe9b917fa9d5e8a57!2sPackedin!5e0!3m2!1sfr!2stn!4v1640000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation Packedin - Nabeul"
                ></iframe>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">Packedin</p>
                  <p className="text-gray-600">Avenue Darghouth, Nabeul 8000</p>
                </div>
                <Link
                  href="https://www.google.com/maps/place/Packedin/@36.4454991,10.7197611,17z/data=!3m1!4b1!4m6!3m5!1s0x130299f0bbd2f331:0xe9b917fa9d5e8a57!8m2!3d36.4454991!4d10.7197611!16s%2Fg%2F11qpz0lc1p"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ouvrir dans Maps
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">
                <span className="text-black">Informations </span>
                <span className="text-green-600">Professionnelles</span>
              </h2>
              <p className="text-black text-lg mb-8 leading-relaxed">
                Notre équipe d'<span className="text-green-600 font-semibold">experts</span> vous accompagne dans la conception et la réalisation
                de vos solutions d'emballage. Contactez-nous pour une <span className="text-green-600 font-semibold">consultation professionnelle gratuite</span>.
              </p>
            </div>

            {/* Contact Information - 4 In Same Line Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-black mb-1 text-sm">Adresse</h3>
                  <p className="text-black text-xs leading-tight">
                    <span className="text-green-600 font-semibold">Packedin</span><br />
                    Avenue Darghouth<br />
                    Nabeul 8000, Tunisie
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-black mb-1 text-sm">Téléphone</h3>
                  <div className="text-black text-xs space-y-0.5 leading-tight">
                    <p>+216 29 362 224</p>
                    <p>+216 50 095 115</p>
                    <p>+216 20 387 333</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-black mb-1 text-sm">Email</h3>
                  <div className="text-black text-xs space-y-0.5 leading-tight">
                    <p className="text-green-600">contact@packedin.tn</p>
                    <p className="text-green-600">packedin.tn@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-black mb-1 text-sm">Horaires</h3>
                  <div className="text-black text-xs space-y-0.5 leading-tight">
                    <p>Lundi - Samedi: <span className="text-green-600 font-semibold">8h00 - 17h00</span></p>
                    <p>Dimanche: Fermé</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Actions <span className="text-green-600">Rapides</span></h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="https://wa.me/21629362224?text=Bonjour%2C%20je%20souhaite%20obtenir%20des%20informations%20sur%20vos%20emballages."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </Link>
                <Link
                  href="tel:+21629362224"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler
                  </Button>
                </Link>
              </div>
            </div>

            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">
                <span className="text-black">Demande de </span>
                <span className="text-green-600">Consultation</span>
              </h2>
              <p className="text-black leading-relaxed">
                Décrivez votre <span className="text-green-600 font-semibold">projet d'emballage</span> et recevez une réponse personnalisée de nos <span className="text-green-600 font-semibold">experts sous 24h</span>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Votre nom"
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+216 XX XXX XXX"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Entreprise
                  </label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Nom de votre entreprise"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Sujet de votre message"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Décrivez vos besoins en détail..."
                  rows={6}
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 hover:to-green-500 text-white py-3 text-lg font-semibold"
              >
                {isSubmitting ? (
                  "Envoi en cours..."
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Envoyer le message
                  </>
                )}
              </Button>
            </form>
            </div>
          </div>


        </div>
      </div>
    </div>
  )
}
