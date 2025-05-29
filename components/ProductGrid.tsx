'use client';

import ProductCard from './ProductCard';
import { ShopifyProduct } from '@/types/shopify';
import { motion } from 'framer-motion';

type ProductGridProps = {
  products: any[]; // Using any[] to handle different product structures
  className?: string;
};

export default function ProductGrid({ products, className = '' }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500">Aucun produit trouvé</p>
      </div>
    );
  }

  // Animation variants for staggered animations
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className={`grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 ${className}`}>
      {products.map((product, index) => (
        <motion.div
          key={product.node?.id || product.id || index}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: Math.min(index * 0.1, 0.7) }} /* Cap the delay at 0.7s */
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="group"
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
