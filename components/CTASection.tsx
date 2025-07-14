'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calculator, Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { MultiProductQuoteDialog } from '@/components/quote/MultiProductQuoteDialog';

export default function CTASection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200/15 to-purple-200/15 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-h-[600px] sm:min-h-[500px] lg:min-h-[400px]"
        style={{ y }}
      >
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center relative"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
              <div className="h-full w-full" style={{
                backgroundImage: `
                  linear-gradient(90deg, #10b981 1px, transparent 1px),
                  linear-gradient(180deg, #10b981 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }} />
            </div>

            {/* Innovative Big Calculator Icon - Right Side */}
            <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
              <MultiProductQuoteDialog
                trigger={
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 10 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3, type: "spring", bounce: 0.4 }}
                    whileHover={{
                      scale: 1.05,
                      rotate: 15,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.98, rotate: 8 }}
                    className="relative cursor-pointer group"
                  >
                {/* Soft Glow Background */}
                <motion.div
                  animate={{
                    scale: [1.1, 1.2, 1.1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-green-200/30 rounded-3xl blur-2xl"
                />

                {/* Main Calculator Container */}
                <div className="relative bg-gradient-to-br from-green-100/80 to-green-200/60 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-green-200/50">
                  {/* Calculator Icon */}
                  <Calculator className="h-16 w-16 text-green-600" />

                  {/* Floating Elements */}
                  <motion.div
                    animate={{
                      y: [-5, 5, -5],
                      rotate: [0, 5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -top-3 -right-3 bg-white/80 p-2 rounded-full shadow-lg"
                  >
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                  </motion.div>

                  <motion.div
                    animate={{
                      y: [5, -5, 5],
                      rotate: [0, -5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                    className="absolute -bottom-2 -left-2 bg-white/80 p-1.5 rounded-full shadow-lg"
                  >
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </motion.div>

                  {/* Price Symbol */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="absolute top-2 left-2 text-green-500 font-bold text-lg"
                  >
                    €
                  </motion.div>
                </div>

                    {/* Innovative Tooltip */}
                    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-4 py-2 rounded-xl shadow-lg whitespace-nowrap">
                        <div className="relative">
                          🧮 Calculateur de prix
                          {/* Tooltip Arrow */}
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-green-500"></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                }
              />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-green-200/50 shadow-lg"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="animate-pulse">
                    <Sparkles className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-sm font-bold text-green-500 tracking-wide">
                    SUPPORT EXPERT
                  </span>
                </motion.div>
              </motion.div>

              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
              >
                Besoin d'aide pour choisir ?
              </motion.h3>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg leading-relaxed"
              >
                Notre équipe d'experts est là pour vous accompagner dans le choix 
                de la solution d'emballage parfaite pour vos produits.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <MultiProductQuoteDialog
                  trigger={
                    <div className="hover:scale-[1.02] transition-transform duration-150">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 hover:to-[#77db19] text-white shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                      >
                        {/* Optimized background shine */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                        <Calculator className="mr-2 h-4 w-4 relative z-10" />
                        <span className="relative z-10">Demander un devis</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
                      </Button>
                    </div>
                  }
                />

                <Link
                  href="https://wa.me/21629362224?text=Bonjour%2C%20je%20souhaite%20contacter%20un%20expert%20pour%20mes%20besoins%20d%27emballage."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="hover:scale-[1.02] transition-transform duration-150">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-green-500/30 text-green-500 hover:bg-green-500/10 shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contacter un expert
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                </Link>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-6 text-sm text-gray-500"
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <span className="inline-flex items-center gap-1">
                    <Calculator className="h-4 w-4" />
                    Devis gratuit • Réponse sous 24h
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp: +216 29 362 224
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
