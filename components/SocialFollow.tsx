'use client';

import { motion } from 'framer-motion';
import { Instagram, Youtube, Facebook, Linkedin } from 'lucide-react';

export default function SocialFollow() {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/packedin.tn',
      bgColor: 'bg-gradient-to-br from-green-400 via-green-500 to-green-600',
      hoverColor: 'hover:from-green-500 hover:via-green-600 hover:to-green-700',
      shadowColor: 'shadow-green-500/30'
    },
    {
      name: 'TikTok',
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-.1z" />
        </svg>
      ),
      url: 'https://tiktok.com/@packedin.tn',
      bgColor: 'bg-gradient-to-br from-green-400 via-green-500 to-emerald-600',
      hoverColor: 'hover:from-green-500 hover:via-green-600 hover:to-emerald-700',
      shadowColor: 'shadow-green-500/30'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com/@packedin.tn',
      bgColor: 'bg-gradient-to-br from-green-500 via-green-600 to-green-700',
      hoverColor: 'hover:from-green-600 hover:via-green-700 hover:to-green-800',
      shadowColor: 'shadow-green-600/30'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/packedin.tn',
      bgColor: 'bg-gradient-to-br from-green-400 via-emerald-500 to-green-600',
      hoverColor: 'hover:from-green-500 hover:via-emerald-600 hover:to-green-700',
      shadowColor: 'shadow-emerald-500/30'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/company/packedin-tn',
      bgColor: 'bg-gradient-to-br from-emerald-400 via-green-500 to-green-600',
      hoverColor: 'hover:from-emerald-500 hover:via-green-600 hover:to-green-700',
      shadowColor: 'shadow-green-500/30'
    }
  ];

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Enhanced Styling */}
        <div className="relative mb-12">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="w-96 h-96 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-3xl"></div>
          </div>

          {/* Main Title with Enhanced Typography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center relative z-10"
          >
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight"
            >
              <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">
                Suivez-nous sur les
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                réseaux sociaux !
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto mb-8"
            >
              Restez connectés avec <span className="text-green-600 font-semibold">Packedin</span> et découvrez nos dernières innovations en emballage
            </motion.p>

            {/* Decorative Line */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-32 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full mx-auto"
            />
          </motion.div>
        </div>

        {/* Enhanced Social Media Icons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-6 md:gap-8"
        >
          {socialLinks.map((social, index) => {
            const IconComponent = social.icon;
            return (
              <motion.div
                key={social.name}
                initial={{ opacity: 0, y: 50, scale: 0.5 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: 1 + index * 0.15,
                  type: "spring",
                  stiffness: 120,
                  damping: 10
                }}
                className="relative group"
              >
                {/* Glow Effect Background */}
                <div className={`absolute inset-0 ${social.bgColor} rounded-lg md:rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 scale-110`}></div>

                {/* Main Icon Container */}
                <motion.a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    scale: 1.15,
                    y: -8,
                    rotateY: 15,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileTap={{
                    scale: 0.9,
                    transition: { duration: 0.1 }
                  }}
                  className={`
                    relative w-18 h-18 md:w-24 md:h-24
                    ${social.bgColor} ${social.hoverColor}
                    rounded-lg md:rounded-3xl
                    flex items-center justify-center
                    text-white
                    shadow-2xl ${social.shadowColor} hover:shadow-3xl
                    transition-all duration-500
                    cursor-pointer
                    group
                    border border-white/20
                    backdrop-blur-sm
                    overflow-hidden
                    p-3 md:p-0
                  `}
                  aria-label={`Suivez-nous sur ${social.name}`}
                >
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Icon */}
                  <IconComponent className="w-9 h-9 md:w-12 md:h-12 relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 drop-shadow-lg" />

                  {/* Ripple Effect */}
                  <div className="absolute inset-0 rounded-lg md:rounded-3xl bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
                </motion.a>


              </motion.div>
            );
          })}
        </motion.div>

        {/* Enhanced Decorative Elements */}
        <div className="absolute top-1/2 left-4 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-60 animate-pulse shadow-lg"></div>
        <div className="absolute top-1/3 right-8 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full opacity-40 animate-pulse shadow-lg" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full opacity-50 animate-pulse shadow-lg" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-30 animate-pulse shadow-lg" style={{ animationDelay: '3s' }}></div>

        {/* Floating Gradient Orbs */}
        <div className="absolute top-10 left-1/3 w-20 h-20 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-10 right-1/3 w-16 h-16 bg-gradient-to-r from-emerald-200/20 to-green-200/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2.5s' }}></div>
      </div>
    </section>
  );
}
