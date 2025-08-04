'use client';

import { motion, useAnimationFrame } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState } from 'react';

export default function AutoCarousel() {
  // Generate array of 21 images
  const images = Array.from({ length: 21 }, (_, i) => ({
    src: `/images/hero/${i + 1}.jpg`,
    alt: `PackedIn Product ${i + 1}`,
    id: i + 1
  }));

  // Create multiple copies for smooth infinite scroll
  const extendedImages = [...images, ...images, ...images];

  const [baseX, setBaseX] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Smooth continuous animation with slower speed
  useAnimationFrame((time, delta) => {
    const speed = typeof window !== 'undefined' && window.innerWidth >= 768 ? 0.04 : 0.02;
    setBaseX(baseX => baseX - speed);
  });

  // Reset position for infinite loop
  const x = baseX % (100 / 3);

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 via-white to-green-50/30 overflow-hidden">
      <div className="w-full">
        <div className="flex flex-col items-center relative">{/* Clean professional carousel */}

          {/* Full Width Infinite Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-full mt-4"
          >

            {/* Infinite Carousel for All Devices */}
            <div className="relative overflow-hidden">
              <motion.div
                ref={ref}
                className="flex gap-2 md:gap-4"
                style={{
                  x: `${x}%`,
                  width: `${extendedImages.length * 150}px`
                }}
              >
                {extendedImages.map((image, index) => (
                  <motion.div
                    key={`${image.id}-${Math.floor(index / images.length)}`}
                    className="flex-shrink-0 relative group w-[140px] h-[180px] md:w-[280px] md:h-[220px]"
                    whileHover={{
                      scale: 1.02,
                      zIndex: 10,
                      transition: { duration: 0.3 }
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      duration: 0.6,
                      delay: (index % images.length) * 0.05
                    }}
                  >
                    {/* Image Only - No Card Background */}
                    <div className="relative w-full h-full overflow-hidden rounded-lg md:rounded-xl transition-all duration-300">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover object-center select-none pointer-events-none transition-transform duration-500 group-hover:scale-110"
                        draggable={false}
                        sizes="(max-width: 768px) 140px, 280px"
                      />

                      {/* Subtle Shine Effect Only - Desktop Only */}
                      <motion.div
                        className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                        initial={{ x: '-100%' }}
                        whileHover={{
                          x: '200%',
                          transition: { duration: 0.8, ease: "easeInOut" }
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Gradient Fade Edges */}
              <div className="absolute left-0 top-0 w-8 md:w-16 h-full bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 w-8 md:w-16 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10" />
            </div>
          </motion.div>

        </div>




      </div>
    </div>
  );
}
