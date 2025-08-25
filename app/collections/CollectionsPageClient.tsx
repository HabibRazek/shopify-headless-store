'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useCollections } from '@/lib/hooks';
import {
  getCollectionSortOptions,
  filterCollections,
  sortCollections
} from '@/lib/utils/collection';
import {
  Search,
  Grid3X3,
  List,
  Package,
  ArrowRight,
  AlertCircle,
  Eye,
  ShoppingBag,
  Star,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FullScreenLoader } from '@/components/ui/loader';

// Enhanced Collection Card Component
function CollectionCard({ collection, viewMode, variants }: any) {
  const productCount = collection.productCount || 0;
  const hasProducts = productCount > 0;

  return (
    <motion.div variants={variants}>
      <Link href={`/collections/${collection.handle}`}>
        <Card className={`group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-green-300/50 ${
          viewMode === 'list' ? 'flex' : ''
        }`}>
          {/* Enhanced Image Section */}
          <div className={`relative overflow-hidden ${
            viewMode === 'list' ? 'w-48 h-32' : 'h-72'
          }`}>
            {collection.image?.url ? (
              <Image
                src={collection.image.url}
                alt={collection.title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                sizes={viewMode === 'list' ? '192px' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <Package className="w-16 h-16 text-green-600/50" />
              </div>
            )}
            
            {/* Enhanced Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Enhanced Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {hasProducts && (
                <Badge className="bg-green-600/90 text-white border-0 shadow-lg backdrop-blur-sm">
                  <ShoppingBag className="w-3 h-3 mr-1" />
                  {productCount} produits
                </Badge>
              )}
              {collection.featured && (
                <Badge className="bg-amber-500/90 text-white border-0 shadow-lg backdrop-blur-sm">
                  <Star className="w-3 h-3 mr-1" />
                  Populaire
                </Badge>
              )}
            </div>

            {/* Enhanced Action Button */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
              <Button size="sm" className="bg-white/90 text-gray-900 hover:bg-white shadow-lg backdrop-blur-sm border-0">
                <Eye className="w-4 h-4 mr-1" />
                Voir
              </Button>
            </div>
          </div>

          {/* Enhanced Content Section */}
          <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                  {collection.title}
                </h3>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" />
              </div>
              
              {collection.description && (
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {collection.description}
                </p>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  {hasProducts ? (
                    <span className="text-sm font-medium text-green-600">
                      {productCount} produit{productCount > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">Bientôt disponible</span>
                  )}
                </div>
                
                {collection.trending && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">Tendance</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function CollectionsPageClient() {
  const { collections, isLoading, error } = useCollections();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">Impossible de charger les collections</p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  // Filter and sort collections
  const filteredCollections = filterCollections(collections, searchTerm);
  const sortedCollections = sortCollections(filteredCollections, sortBy);
  const sortOptions = getCollectionSortOptions();

  return (
    <div className="relative min-h-screen">
      {/* Innovative Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-green-50/30" />
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(90deg, #10b981 1px, transparent 1px),
              linear-gradient(180deg, #10b981 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      <div className="relative mt-32 z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* SEO Optimized Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          {/* Stats Pills */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm border border-gray-200/50">
              <span className="text-xs sm:text-sm font-semibold text-gray-700">{collections.length} Collections</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm border border-gray-200/50">
              <span className="text-xs sm:text-sm font-semibold text-gray-700">Spécialisées</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm border border-gray-200/50">
              <span className="text-xs sm:text-sm font-semibold text-gray-700">Personnalisables</span>
            </div>
          </div>

          {/* SEO Optimized Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4">
            <span className="block text-gray-900 mb-1 sm:mb-2">Nos</span>
            <span className="block bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
              COLLECTIONS
            </span>
          </h1>

          <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full mx-auto mb-3 sm:mb-4" />

          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Découvrez nos collections spécialisées d'emballages flexibles : doypacks kraft, sachets zip, solutions pour café, épices, beauté et bien plus
          </p>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="mb-8 sm:mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Rechercher une collection..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-gray-200/50 focus:border-green-300 focus:ring-green-200"
                />
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Trier par:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-white/50 border border-gray-200/50 rounded-lg focus:border-green-300 focus:ring-green-200 text-sm"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-1 bg-gray-100/50 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Collections Grid */}
        <AnimatePresence mode="wait">
          {sortedCollections.length > 0 ? (
            <motion.div
              key="collections-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}
            >
              {sortedCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  viewMode={viewMode}
                  variants={itemVariants}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune collection trouvée</h3>
              <p className="text-gray-600 mb-4">
                Essayez de modifier vos critères de recherche
              </p>
              <Button onClick={() => setSearchTerm('')} variant="outline">
                Réinitialiser la recherche
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
