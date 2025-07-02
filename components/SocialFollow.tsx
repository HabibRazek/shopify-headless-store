'use client';

import { motion } from 'framer-motion';
import { Instagram, Youtube, Facebook, Linkedin } from 'lucide-react';
import Image from 'next/image';

export default function SocialFollow() {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/packedin.tn',
      bgColor: 'bg-gradient-to-br from-purple-400 to-pink-400',
      hoverColor: 'hover:from-purple-500 hover:to-pink-500'
    },
    {
      name: 'TikTok',
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-.1z"/>
        </svg>
      ),
      url: 'https://tiktok.com/@packedin.tn',
      bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-400',
      hoverColor: 'hover:from-yellow-500 hover:to-orange-500'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com/@packedin.tn',
      bgColor: 'bg-gradient-to-br from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/packedin.tn',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/company/packedin-tn',
      bgColor: 'bg-gradient-to-br from-green-400 to-green-500',
      hoverColor: 'hover:from-green-500 hover:to-green-600'
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Arrow */}
        <div className="relative mb-12">
          {/* Arrow pointing to "Suivez-nous!" */}
          <div className="hidden md:flex justify-end mb-4">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, rotate: -10 }}
                whileInView={{ opacity: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute -top-8 -right-4"
              >
                <svg 
                  width="80" 
                  height="60" 
                  viewBox="0 0 80 60" 
                  className="text-gray-600"
                  fill="none"
                >
                  <path 
                    d="M10 30 Q40 10 70 25" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none"
                    strokeDasharray="3,3"
                  />
                  <path 
                    d="M65 20 L70 25 L65 30" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none"
                  />
                </svg>
              </motion.div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg font-semibold text-gray-700 italic"
              >
                Suivez-nous!
              </motion.span>
            </div>
          </div>

          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8"
          >
            Suivez-nous sur les réseaux sociaux !
          </motion.h2>
        </div>

        {/* Social Media Icons */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {socialLinks.map((social, index) => {
            const IconComponent = social.icon;
            return (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                className={`
                  w-16 h-16 md:w-20 md:h-20 
                  ${social.bgColor} ${social.hoverColor}
                  rounded-2xl 
                  flex items-center justify-center 
                  text-white 
                  shadow-lg hover:shadow-xl 
                  transition-all duration-300
                  cursor-pointer
                  group
                `}
                aria-label={`Suivez-nous sur ${social.name}`}
              >
                <IconComponent className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform duration-200" />
              </motion.a>
            );
          })}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-4 w-2 h-2 bg-green-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-1/3 right-8 w-3 h-3 bg-blue-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  );
}
