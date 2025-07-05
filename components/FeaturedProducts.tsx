'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShopifyProduct } from '@/types/shopify';
import ProductGrid from '@/components/ProductGrid';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './ui/button';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Fetch specific featured products instead of all products
        const response = await fetch('/api/products/featured');
        const data = await response.json();

        if (data.products?.edges) {
          setProducts(data.products.edges);
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="bg-transparent ">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="mb-6 md:mb-0 animate-pulse">
              <div className="h-10 w-64 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 w-96 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-10 w-48 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          {/* Products Grid Skeleton - 4 products */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                {/* Image area */}
                <div className="aspect-square w-full bg-gray-200"></div>

                {/* Price tag */}
                <div className="relative">
                  <div className="absolute top-[-12px] right-3 h-6 w-16 bg-gray-200 rounded-full"></div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

                  {/* Stock indicator */}
                  <div className="flex items-center mt-2">
                    <div className="h-2 w-2 rounded-full bg-gray-200 mr-2"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>

                {/* Button */}
                <div className="px-4 pb-4 mt-4">
                  <div className="h-10 bg-gray-200 rounded-full w-full"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Skeleton */}
          <div className="mt-12 flex justify-center animate-pulse">
            <div className="h-10 w-64 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <div className="py-16 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-10 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-red-600 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-4">We couldn't load the featured products. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use the fetched featured products (already exactly 4 specific products)
  const featuredProducts = products;

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
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
          className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-green-100/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
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
          className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-green-200/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-6 sm:mb-8 lg:mb-0 text-center lg:text-left"
          >
            {/* Enhanced Badge */}
            <motion.div
              className="inline-flex items-center mb-4 sm:mb-6 bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg border border-green-200/50"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-2 h-2 bg-green-500 rounded-full mr-3"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-bold text-green-500 tracking-wide">SÉLECTION PREMIUM</span>
            </motion.div>
            {/* Title */}
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="block text-black">Nos Produits</span>
              <span className="block text-green-500">Populaire</span>
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-black max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Découvrez notre sélection d'emballages premium, conçus pour sublimer vos produits et séduire vos clients.
            </motion.p>
          </motion.div>

          {/* Enhanced Button */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="w-full lg:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/products">
              <Button size="lg" className="group w-full lg:w-auto text-sm sm:text-base bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 hover:to-[#77db19] text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                {/* Animated background shine */}
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
                <span className="relative z-10">Voir tous les produits</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Product Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-4 sm:mt-6"
        >
          <ProductGrid
            products={featuredProducts}
            className="grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
          />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 sm:mt-12 md:mt-16 text-center"
        >
          <Link href="/products">
            <Button size="lg" className="text-base sm:text-lg px-8 sm:px-12 w-full sm:w-auto mb-6">
              Explorer notre catalogue complet
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}