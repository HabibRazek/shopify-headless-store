'use client';

import { useState, useEffect } from 'react';
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

// Collection Card Component
function CollectionCard({ collection, viewMode, variants }: any) {
  const productCount = collection.productCount || 0;
  const hasProducts = productCount > 0;

  return (
    <motion.div variants={variants}>
      <Link href={`/collections/${collection.handle}`}>
        <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
          viewMode === 'list' ? 'flex' : ''
        }`}>
          {/* Image */}
          <div className={`relative overflow-hidden ${
            viewMode === 'list' ? 'w-48 h-32' : 'h-64'
          }`}>
            {collection.image?.url ? (
              <Image
                src={collection.image.url}
                alt={collection.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes={viewMode === 'list' ? '192px' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

            {/* Product Count Badge */}
            <div className="absolute top-3 right-3">
              <Badge variant={hasProducts ? "default" : "secondary"} className="bg-white/90 text-gray-900">
                {productCount} {productCount === 1 ? 'produit' : 'produits'}
              </Badge>
            </div>

            {/* Trending Badge */}
            {productCount > 10 && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-green-500 text-white">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Populaire
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                {collection.title}
              </h3>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" />
            </div>

            {collection.description && (
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {collection.description.replace(/<[^>]*>/g, '')}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Voir la collection</span>
              </div>

              {hasProducts && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">Disponible</span>
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chargement des collections...
              </h3>
              <p className="text-gray-500">
                Nous récupérons toutes nos collections pour vous
              </p>
            </div>
          </div>
        </div>
      </div>
    );
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
      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher une collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results count */}
        {searchTerm && (
          <div className="mt-4 text-sm text-gray-600">
            {filteredCollections.length} collection(s) trouvée(s) pour "{searchTerm}"
          </div>
        )}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0">
          <div className="absolute top-[-10rem] right-[5rem] h-[30rem] w-[70rem] bg-gradient-to-b from-[#bdffad] to-transparent rounded-full blur-[9rem] opacity-70" />
          <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-5" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 lg:py-32 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-block mb-4">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full text-green-700 text-sm font-medium shadow-sm">
                Nos collections
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl lg:text-6xl">
              Collections <span className="block text-green-700">ZIPBAGS®</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-gray-700">
              Découvrez notre gamme complète de pochettes zippées stand-up (Doypack) conçues pour divers usages alimentaires et non alimentaires.
            </p>

            {/* Stats */}
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                <span className="font-medium">{total || 0} collections</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-green-600" />
                <span className="font-medium">
                  {collections.reduce((acc: number, col: any) => acc + (col.productCount || 0), 0)} produits
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center space-x-1 p-2" aria-label="Tabs">
            <div className="bg-green-50 text-green-700 shadow-sm rounded-lg py-3 px-6 font-medium text-sm transition-all duration-200 flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Nos Collections</span>
            </div>
            <Link
              href="/products"
              className="bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-700 rounded-lg py-3 px-6 font-medium text-sm transition-all duration-200 flex items-center space-x-2"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Tous les Produits</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Collections Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <ModernCollections />
      </div>
    </div>
  );
}
