'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShopifyProduct } from '@/types/shopify';
import ProductGrid from '@/components/ProductGrid';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
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
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-0"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Produits Populaires
            </h2>
            <p className="text-gray-600 max-w-xl">
              Découvrez notre sélection de produits les plus appréciés par nos clients
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-green-600 font-medium hover:border-green-600 hover:shadow-md transition-all duration-300"
            >
              <span>Voir tous les produits</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-6"
        >
          <ProductGrid products={featuredProducts} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            href="/products"
            className="inline-block rounded-full border border-transparent bg-gradient-to-r from-green-600 to-green-700 px-8 py-3 text-center font-medium text-white hover:shadow-lg transition-all hover:scale-105 duration-300"
          >
            Explorer notre catalogue complet
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
