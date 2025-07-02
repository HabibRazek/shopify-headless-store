'use client';

import { motion } from 'framer-motion';
import { Check, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MultiProductQuoteDialog } from '@/components/quote/MultiProductQuoteDialog';
import Image from 'next/image';

export default function CustomPackaging() {
  const features = [
    {
      text: "Impression sur kraft naturel",
      icon: Check
    },
    {
      text: "À partir de 300 pochettes personnalisées",
      icon: Check
    },
    {
      text: "Livraison express",
      icon: Check
    },
    {
      text: "Qualité premium – résultat garanti",
      icon: Check
    }
  ];

  return (
    <section className="py-12 md:py-16 relative">
      {/* Decorative Elements */}
      

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-start justify-center mb-4">
              <span className="text-3xl mr-2">✋</span>
              <h2 className="text-2xl md:text-3xl font-black text-black leading-tight">
                Vous n'avez qu'une seule chance de faire<br />
                bonne impression.
              </h2>
            </div>
          </motion.div>

          {/* Product Image */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md h-80 relative">
              <Image
                src="/doypacks-kraft-view-personalisée.png"
                alt="Doypacks Kraft Personnalisés"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 448px"
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <p className="text-gray-700 mb-6 leading-relaxed">
              Votre packaging, votre image.<br />
              Faites-la avec PackedIn – rapide, simple et sur mesure.<br />
              Donnez vie à votre marque avec un packaging personnalisé sur pochette kraft, imprimé à votre image – même en petites quantités.
            </p>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-center"
                >
                  <div className="w-5 h-5 bg-green-500 rounded-sm flex items-center justify-center mr-3 flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <MultiProductQuoteDialog
                trigger={
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    <Edit3 className="w-5 h-5 mr-2" />
                    Demandez un Devis
                  </Button>
                }
              />
            </motion.div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:gap-12 lg:items-center">
          {/* Left Side - Text Content */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="flex items-start mb-6">
                <span className="text-4xl mr-3 flex-shrink-0">✋</span>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-black text-black mb-4 leading-tight">
                    Vous n'avez qu'une seule chance de faire<br />
                    bonne impression.
                  </h2>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Votre packaging, votre image.<br />
                Faites-la avec PackedIn – rapide, simple et sur mesure.<br />
                Donnez vie à votre marque avec un packaging personnalisé sur pochette kraft, imprimé à votre image – même en petites quantités.
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <div className="w-6 h-6 bg-green-500 rounded-sm flex items-center justify-center mr-4 flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Special Note */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center mb-8"
              >
                <Edit3 className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                <span className="text-gray-600 font-medium">Demandez votre devis personnalisé dès maintenant</span>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <MultiProductQuoteDialog
                  trigger={
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <Edit3 className="w-5 h-5 mr-2" />
                      Demandez un Devis
                    </Button>
                  }
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side - Product Image */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <div className="w-full h-[500px] relative">
                <Image
                  src="/doypacks-kraft-view-personalisée.png"
                  alt="Doypacks Kraft Personnalisés"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
