'use client';

import { motion } from 'framer-motion';

interface SectionSeparatorProps {
  variant?: 'simple' | 'decorative' | 'gradient';
  className?: string;
}

export default function SectionSeparator({ 
  variant = 'simple', 
  className = '' 
}: SectionSeparatorProps) {
  
  if (variant === 'simple') {
    return (
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`w-32 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full mx-auto ${className}`}
      />
    );
  }

  if (variant === 'decorative') {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-4"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-0.5 bg-gradient-to-r from-green-400 to-green-600"
          />
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-24 h-0.5 bg-gradient-to-r from-green-600 to-green-400"
          />
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  // gradient variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative py-12 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-50 to-transparent"></div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative w-48 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full mx-auto"
      />
    </motion.div>
  );
}
