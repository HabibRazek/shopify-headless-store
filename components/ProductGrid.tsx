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
    <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 ${className}`}>
      {products.map((product, index) => (
        <motion.div
          key={product.node?.id || product.id || index}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: Math.min(index * 0.05, 0.5) }}
          className="group h-full"
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
