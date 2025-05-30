'use client';

import { Suspense, useEffect, useState } from 'react';
import ProductGrid from '@/components/ProductGrid';
import { ShopifyProduct } from '@/types/shopify';
import SearchInput from '@/components/SearchInput';
import ProductFilters from '@/components/ProductFilters';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function Products() {
  // Define a type for the product with node structure
  type ProductWithNode = { node: ShopifyProduct };

  const [allProducts, setAllProducts] = useState<ProductWithNode[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [displayedProducts, setDisplayedProducts] = useState<ProductWithNode[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [paginatedProducts, setPaginatedProducts] = useState<ProductWithNode[]>([]);

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();

        if (data.products?.edges) {
          console.log('Fetched products:', data.products.edges.length);

          // Count BlackView products
          const blackViewProducts = data.products.edges.filter((product: any) =>
            product.node.title.toLowerCase().includes('blackview')
          );
          console.log('BlackView products:', blackViewProducts.length);

          setAllProducts(data.products.edges);
          setFilteredProducts(data.products.edges);
          setDisplayedProducts(data.products.edges);
        } else {
          setIsError(true);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Apply search and sorting to displayed products
  useEffect(() => {
    if (!displayedProducts.length) return;

    let result = [...displayedProducts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => {
        const node = product.node;
        return (
          node.title.toLowerCase().includes(query) ||
          (node.description && node.description.toLowerCase().includes(query))
        );
      });
    }

    // Apply sorting
    if (sortOption) {
      result.sort((a, b) => {
        const nodeA = a.node;
        const nodeB = b.node;

        if (sortOption === 'price-asc') {
          const priceA = parseFloat(nodeA.priceRange.minVariantPrice.amount);
          const priceB = parseFloat(nodeB.priceRange.minVariantPrice.amount);
          return priceA - priceB;
        } else if (sortOption === 'price-desc') {
          const priceA = parseFloat(nodeA.priceRange.minVariantPrice.amount);
          const priceB = parseFloat(nodeB.priceRange.minVariantPrice.amount);
          return priceB - priceA;
        } else if (sortOption === 'name-asc') {
          return nodeA.title.localeCompare(nodeB.title, 'fr', { sensitivity: 'base' });
        } else if (sortOption === 'name-desc') {
          return nodeB.title.localeCompare(nodeA.title, 'fr', { sensitivity: 'base' });
        }
        return 0;
      });
    }

    setFilteredProducts(result);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [displayedProducts, searchQuery, sortOption]);

  // Apply pagination to filtered products
  useEffect(() => {
    if (!filteredProducts.length) return;

    // Calculate pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    setPaginatedProducts(currentProducts);

    // Log for debugging
    console.log(`Pagination: Showing products ${indexOfFirstProduct+1}-${Math.min(indexOfLastProduct, filteredProducts.length)} of ${filteredProducts.length}`);
  }, [filteredProducts, currentPage, productsPerPage]);

  // Handle page change
  const paginate = (pageNumber: number) => {
    console.log(`Changing to page ${pageNumber}`);
    setCurrentPage(pageNumber);

    // Scroll to top of product grid for better UX
    window.scrollTo({
      top: document.getElementById('product-grid-top')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (isLoading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  if (isError) {
    return <div className="text-center py-10">Error loading products</div>;
  }

  return (
    <div className="space-y-8">
      {/* Innovative Search and Filter Bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-grow">
            <SearchInput
              onSearch={handleSearch}
              placeholder="Rechercher des produits..."
            />
          </div>

          {/* Sort Options */}
          <div className="flex-shrink-0 w-full lg:w-64">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="bg-white/90 border-gray-300 shadow-sm">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Prix: croissant ↗</SelectItem>
                <SelectItem value="price-desc">Prix: décroissant ↘</SelectItem>
                <SelectItem value="name-asc">Nom: A-Z</SelectItem>
                <SelectItem value="name-desc">Nom: Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="md:col-span-1">
          <ProductFilters
            products={allProducts} // Use allProducts instead of filteredProducts to ensure filters work on all products
            onFilterChange={(filtered) => {
              console.log(`Filter applied: ${filtered.length} products match the criteria`);
              setDisplayedProducts(filtered);
              // Reset to first page when filters change
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Products */}
        <div id="product-grid-top" className="md:col-span-3">
          {/* Innovative Results Header */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-gray-700">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'produit trouvé' : 'produits trouvés'}
                </span>
              </div>

              {filteredProducts.length > productsPerPage && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Page {currentPage} sur {totalPages}</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                  <span>{productsPerPage} par page</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <>
              <ProductGrid products={paginatedProducts} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              paginate(currentPage - 1);
                            }}
                          />
                        </PaginationItem>
                      )}

                      {/* First page */}
                      {currentPage > 2 && (
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              paginate(1);
                            }}
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      {/* Ellipsis */}
                      {currentPage > 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      {/* Previous page */}
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              paginate(currentPage - 1);
                            }}
                          >
                            {currentPage - 1}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      {/* Current page */}
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          isActive
                          onClick={(e) => e.preventDefault()}
                        >
                          {currentPage}
                        </PaginationLink>
                      </PaginationItem>

                      {/* Next page */}
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              paginate(currentPage + 1);
                            }}
                          >
                            {currentPage + 1}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      {/* Ellipsis */}
                      {currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      {/* Last page */}
                      {currentPage < totalPages - 1 && (
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              paginate(totalPages);
                            }}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              paginate(currentPage + 1);
                            }}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-500 mb-4">Aucun produit ne correspond à vos critères de recherche</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSortOption('');
                  }}
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Innovative Header */}
        <div className="text-center mb-12">
          {/* Stats Pills */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50">
              <span className="text-sm font-semibold text-gray-700">100+ Produits</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50">
              <span className="text-sm font-semibold text-gray-700">Livraison Rapide</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50">
              <span className="text-sm font-semibold text-gray-700">Qualité Premium</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            <span className="block text-gray-900 mb-2">Notre</span>
            <span className="block bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
              CATALOGUE
            </span>
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full mx-auto mb-4" />

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Découvrez notre gamme complète d'emballages innovants et durables
          </p>
        </div>

        <Suspense fallback={
          <div className="text-center py-20">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-700 font-medium">Chargement des produits...</span>
            </div>
          </div>
        }>
          <Products />
        </Suspense>
      </div>
    </div>
  );
}
