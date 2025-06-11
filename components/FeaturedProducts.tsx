'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShopifyProduct } from '@/types/shopify';
import ProductGrid from '@/components/ProductGrid';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();

        if (data.products?.edges) {
          setProducts(data.products.edges);
        } else {
          setIsError(true);
        }
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
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

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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

  // Show first 8 products on homepage
  const featuredProducts = products.slice(0, 8);

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
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-white via-green-50/30 to-white relative overflow-hidden">
      {/* Soft Decorative Background Elements - Mobile Responsive */}
      <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-green-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-green-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 sm:mb-8 lg:mb-0 text-center lg:text-left"
          >
            {/* Badge - Mobile Responsive */}
            <div className="inline-flex items-center mb-3 sm:mb-4 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg border border-green-200/50">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-2 sm:mr-3 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold text-green-700 tracking-wide">SÉLECTION PREMIUM</span>
            </div>
            {/* Title - Mobile Responsive Typography */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-3 sm:mb-4 leading-tight">
              Produits <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Populaires</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-green-700/80 max-w-2xl leading-relaxed">
              Découvrez notre sélection exclusive de produits les plus appréciés par nos clients professionnels
            </p>
          </motion.div>

          {/* Button - Mobile Responsive */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-auto"
          >
            <Link href="/products">
              <Button size="lg" className="group w-full lg:w-auto text-sm sm:text-base">
                <span>Voir tous les produits</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Product Grid - Mobile Responsive */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-4 sm:mt-6"
        >
          <ProductGrid products={featuredProducts} className="lg:grid-cols-4 xl:grid-cols-4" />
        </motion.div>

        {/* Bottom CTA - Mobile Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 sm:mt-12 md:mt-16 text-center"
        >
          <Link href="/products">
            <Button size="lg" className="text-base sm:text-lg px-8 sm:px-12 w-full sm:w-auto">
              Explorer notre catalogue complet
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
