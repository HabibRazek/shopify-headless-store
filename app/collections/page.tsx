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
  Loader2,
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
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes={viewMode === 'list' ? '192px' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-100 via-emerald-50 to-green-100 flex items-center justify-center">
                <Package className="h-16 w-16 text-green-400" />
              </div>
            )}

            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Enhanced Product Count Badge */}
            <div className="absolute top-4 right-4">
              <Badge className={`${hasProducts ? 'bg-green-600 text-white' : 'bg-gray-500 text-white'} shadow-lg backdrop-blur-sm`}>
                <ShoppingBag className="h-3 w-3 mr-1" />
                {productCount} {productCount === 1 ? 'produit' : 'produits'}
              </Badge>
            </div>

            {/* Enhanced Trending Badge */}
            {productCount > 10 && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Populaire
                </Badge>
              </div>
            )}

            {/* Quick View Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <Button
                size="sm"
                className="bg-white/95 text-green-700 hover:bg-white border border-green-300 shadow-xl backdrop-blur-sm"
              >
                <Eye className="mr-2 h-4 w-4" />
                Explorer
              </Button>
            </div>
          </div>

          {/* Enhanced Content */}
          <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300 leading-tight">
                {collection.title}
              </h3>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" />
            </div>

            {collection.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-4" style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {collection.description.replace(/<[^>]*>/g, '')}
              </p>
            )}

            {/* Enhanced Features */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  <div className="h-2 w-2 rounded-full bg-green-300"></div>
                </div>
                <span className="text-sm text-gray-600 font-medium">Collection Premium</span>
              </div>

              {hasProducts && (
                <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 text-green-600 fill-current" />
                  <span className="text-sm font-semibold text-green-700">Disponible</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function ModernCollections() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'products' | 'recent'>('products');

  // Fetch collections with products for better UX
  const { collections, isLoading, isError } = useCollections(true, 20, 10);

  // Filter and sort collections using utility functions
  const filteredCollections = sortCollections(
    filterCollections(collections, searchTerm),
    sortBy
  );

  // Get sort options dynamically
  const sortOptions = getCollectionSortOptions();

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

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Erreur de chargement
              </h3>
              <p className="text-gray-500 mb-4">
                Impossible de charger les collections
              </p>
              <Button onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Explorer nos Collections</h2>
          <p className="text-gray-600">Trouvez la collection parfaite pour vos besoins</p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher une collection par nom ou type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-base border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Results count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-700">
              {filteredCollections.length} collection{filteredCollections.length !== 1 ? 's' : ''}
              {searchTerm ? ` trouvée${filteredCollections.length !== 1 ? 's' : ''} pour "${searchTerm}"` : ' disponible' + (filteredCollections.length !== 1 ? 's' : '')}
            </span>
          </div>

          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="text-gray-500 hover:text-gray-700"
            >
              Effacer la recherche
            </Button>
          )}
        </div>
      </motion.div>

      {/* Collections Grid/List */}
      <AnimatePresence mode="wait">
        {filteredCollections.length === 0 ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune collection trouvée
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos critères de recherche
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`${viewMode}-${sortBy}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredCollections.map((collection: any) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                viewMode={viewMode}
                variants={itemVariants}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CollectionsPage() {
  const { collections, total } = useCollections(true, 20, 10);

  return (
    <div className="min-h-screen relative">
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
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-purple-400/10 to-green-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Innovative Hero Section */}
      <div className="relative z-10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full shadow-lg border border-green-200/50 mb-8">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-sm font-bold text-green-800 tracking-wider uppercase">
                Collections Premium • Innovation • Excellence
              </span>
              <Package className="w-5 h-5 text-green-600" />
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              <span className="block text-gray-900 mb-2">Nos</span>
              <span className="block bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                COLLECTIONS
              </span>
            </h1>

            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full mx-auto mb-8" />

            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
              Découvrez notre gamme exclusive de pochettes ZIPBAGS® innovantes, conçues pour révolutionner
              vos solutions d'emballage avec style et performance
            </p>

            {/* Enhanced Stats */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
              <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-gray-200/50">
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-green-600" />
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-900">{total || 0}</div>
                    <div className="text-sm text-gray-600">Collections</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-gray-200/50">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-900">
                      {collections.reduce((acc: number, col: any) => acc + (col.productCount || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Produits</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-gray-200/50">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-sm text-gray-600">Qualité</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Eye className="mr-2 h-5 w-5" />
                Explorer les Collections
              </Button>
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Voir tous les Produits
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Collections Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <ModernCollections />
      </div>
    </div>
  );
}
