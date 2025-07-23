'use client';

import { motion } from 'framer-motion';
import { Edit3, Sparkles, Zap, Star, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MultiProductQuoteDialog } from '@/components/quote/MultiProductQuoteDialog';
import Image from 'next/image';


export default function CustomPackaging() {

  const features = [
    {
      text: "Impression sur kraft naturel",
      icon: Star,
      color: "from-green-500 to-emerald-600"
    },
    {
      text: "À partir de 300 pochettes personnalisées",
      icon: Zap,
      color: "from-blue-500 to-cyan-600"
    },
    {
      text: "Livraison express",
      icon: Sparkles,
      color: "from-purple-500 to-pink-600"
    },
    {
      text: "Qualité premium – résultat garanti",
      icon: Star,
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <section className="py-16 md:py-24 relative">

      <div className="hidden md:flex justify-end mt-[-100px] ">
        <div className='z-30 sm:lg:mt-[-150px] animate-bounce '>
          <Image
            src="/Arrow.png"
            alt="Arrow pointing to products"
            width={180}
            height={160}
            className="object-contain z-30 w-[120px] h-[100px] sm:w-[180px] sm:h-[160px] mt-[15px] rotate-[-90deg]"
          />
          <h1 className='font-extrabold sm:text-3xl sm:mr-20 rotate-2 z-30'>
            Emballez le <br /> a votre facon
          </h1>
        </div>
      </div>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Printer Icon Background */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 right-1/4 opacity-5"
        >
          <Printer className="w-96 h-96 text-green-600" />
        </motion.div>

        {/* Additional floating printer */}
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 3, 0],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 left-1/4 opacity-3"
        >
          <Printer className="w-64 h-64 text-green-500" />
        </motion.div>

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
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Innovative Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] rounded-full mb-6 shadow-xl"
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Printer className="w-10 h-10 text-white" />
              </motion.div>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
              <span className="block">Vous n'avez qu'une seule</span>
              <span className="block bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] bg-clip-text text-transparent">
                chance de faire
              </span>
              <span className="block">bonne impression.</span>
            </h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto"
            >
              Votre emballage est le premier contact avec vos clients. Faites-le compter avec nos solutions d'impression personnalisées sur doypacks qui reflètent parfaitement votre marque.
            </motion.p>
          </motion.div>

          {/* Awesome Free-Floating Product Image */}
          <motion.div
            className="flex justify-center mb-12 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              className="relative hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Multiple glowing auras */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.5, 0.2],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-r from-green-700/20 via-green-500/30 to-[#77db19]/20 rounded-full blur-2xl scale-150"
              />

              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.1, 0.3, 0.1],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-3xl scale-125"
              />

              {/* Main free-floating image */}
              <motion.div
                whileHover={{
                  scale: 1.1,
                  rotate: -2,
                  transition: { duration: 0.3 }
                }}
                className="relative w-96 h-96"
              >
                <Image
                  src="/Doypacks-Zip.png"
                  alt="Doypacks Zip Personnalisés"
                  fill
                  className="object-contain drop-shadow-2xl filter brightness-105 contrast-105"
                  sizes="384px"
                />

                {/* Enhanced floating particles around the image */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -30 - i * 2, 0],
                      x: [0, Math.sin(i) * 15, 0],
                      opacity: [0, 0.8, 0],
                      scale: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 3 + i * 0.3,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                    className={`absolute w-3 h-3 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19] rounded-full shadow-lg`}
                    style={{
                      left: `${10 + i * 8}%`,
                      top: `${5 + (i % 4) * 25}%`,
                    }}
                  />
                ))}

                {/* Orbiting elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div className="absolute top-8 right-8 w-4 h-4 bg-gradient-to-r from-green-700 to-green-500 rounded-full opacity-60 shadow-lg" />
                </motion.div>

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div className="absolute bottom-8 left-8 w-3 h-3 bg-gradient-to-r from-green-500 to-[#77db19] rounded-full opacity-70 shadow-lg" />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Innovative Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="relative group"
                >
                  {/* Animated background */}
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                      duration: 3 + index * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-sm`}
                  />

                  {/* Main card */}
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </motion.div>
                      <span className="text-gray-800 font-semibold text-sm leading-tight flex-1">
                        {feature.text}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Special Note with Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50 shadow-lg"
            >
              <p className="text-green-700 font-bold text-lg mb-2">
                ✨ Demandez votre devis personnalisé
              </p>
              <p className="text-green-600 text-sm">
                dès maintenant et donnez vie à votre marque
              </p>
            </motion.div>
          </motion.div>

          {/* Innovative CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <MultiProductQuoteDialog
              trigger={
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Button className="relative bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 hover:to-[#77db19] text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-green-500/25 transition-all duration-300 overflow-hidden group">
                    {/* Animated background */}
                    <motion.div
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                    <Edit3 className="w-6 h-6 mr-3 relative z-10" />
                    <span className="relative z-10">Demandez un Devis</span>
                  </Button>
                </motion.div>
              }
            />
          </motion.div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:gap-16 lg:items-center">
          {/* Left Side - Text Content */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Innovative Header */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] rounded-full mb-8 shadow-xl"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Printer className="w-12 h-12 text-white" />
                </motion.div>
              </motion.div>

              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-8 leading-tight">
                <span className="block">Vous n'avez qu'une seule</span>
                <span className="block bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] bg-clip-text text-transparent">
                  chance de faire
                </span>
                <span className="block">bonne impression.</span>
              </h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-gray-600 mb-10 leading-relaxed"
              >
                Votre emballage est le premier contact avec vos clients. Faites-le compter avec nos solutions d'impression personnalisées sur doypacks qui reflètent parfaitement votre marque.
              </motion.p>

              {/* Innovative Features List */}
              <div className="space-y-6 mb-10">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ x: 10, transition: { duration: 0.2 } }}
                      className="flex items-center group cursor-pointer"
                    >
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </motion.div>
                      <span className="text-gray-800 font-semibold text-lg group-hover:text-green-600 transition-colors duration-300">
                        {feature.text}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Special Note with Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mb-10"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50 shadow-lg"
                >
                  <p className="text-green-700 font-bold text-xl mb-2">
                    ✨ Demandez votre devis personnalisé
                  </p>
                  <p className="text-green-600">
                    dès maintenant et donnez vie à votre marque
                  </p>
                </motion.div>
              </motion.div>

              {/* Innovative CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <MultiProductQuoteDialog
                  trigger={
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block"
                    >
                      <Button className="relative bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 hover:to-[#77db19] text-white px-12 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 overflow-hidden group">
                        {/* Animated background */}
                        <motion.div
                          animate={{
                            x: ['-100%', '100%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                        <Edit3 className="w-6 h-6 mr-3 relative z-10" />
                        <span className="relative z-10">Demandez un Devis</span>
                      </Button>
                    </motion.div>
                  }
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side - Awesome Free-Floating Product Image */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex justify-center"
            >
              <motion.div
                className="relative hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Enhanced multiple glowing auras */}
                <motion.div
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.6, 0.3],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-green-700/30 via-green-500/40 to-[#77db19]/30 rounded-full blur-3xl scale-150"
                />

                <motion.div
                  animate={{
                    scale: [1.3, 1, 1.3],
                    opacity: [0.2, 0.4, 0.2],
                    rotate: [360, 180, 0],
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-2xl scale-125"
                />

                {/* Main free-floating image - larger for desktop */}
                <motion.div
                  whileHover={{
                    scale: 1.15,
                    rotate: 2,
                    transition: { duration: 0.3 }
                  }}
                  className="relative w-[500px] h-[500px]"
                >
                  <Image
                    src="/Doypacks-Zip.png"
                    alt="Doypacks Zip Personnalisés"
                    fill
                    className="object-contain drop-shadow-2xl filter brightness-110 contrast-110"
                    sizes="500px"
                  />

                  {/* Enhanced floating particles around the image */}
                  {[...Array(16)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -40 - i * 2, 0],
                        x: [0, Math.sin(i) * 20, 0],
                        opacity: [0, 0.9, 0],
                        scale: [0.2, 1.2, 0.2],
                      }}
                      transition={{
                        duration: 4 + i * 0.3,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut"
                      }}
                      className={`absolute w-4 h-4 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19] rounded-full shadow-xl`}
                      style={{
                        left: `${5 + i * 6}%`,
                        top: `${5 + (i % 5) * 20}%`,
                      }}
                    />
                  ))}

                  {/* Enhanced orbiting elements */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <div className="absolute top-12 right-12 w-6 h-6 bg-gradient-to-r from-green-700 to-green-500 rounded-full opacity-70 shadow-xl" />
                  </motion.div>

                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <div className="absolute bottom-12 left-12 w-5 h-5 bg-gradient-to-r from-green-500 to-[#77db19] rounded-full opacity-80 shadow-xl" />
                  </motion.div>

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <div className="absolute top-1/2 right-8 w-3 h-3 bg-gradient-to-r from-[#77db19] to-green-600 rounded-full opacity-60 shadow-lg" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
