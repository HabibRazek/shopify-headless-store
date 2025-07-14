'use client';

import { useEffect, useState } from 'react';
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

  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FullScreenLoader } from '@/components/ui/loader';

export default function ProductsClient() {
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
    setCurrentPage(1);
  }, [displayedProducts, searchQuery, sortOption]);

  // Apply pagination to filtered products
  useEffect(() => {
    if (!filteredProducts.length) return;

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    setPaginatedProducts(currentProducts);
  }, [filteredProducts, currentPage, productsPerPage]);

  // Handle page change
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: document.getElementById('product-grid-top')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isError) {
    return <div className="text-center py-10">Error loading products</div>;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Search and Filter Bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200/50">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          <div className="flex-grow">
            <SearchInput
              onSearch={handleSearch}
              placeholder="Rechercher des produits..."
            />
          </div>
          <div className="flex-shrink-0 w-full lg:w-64">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="bg-white/90 border-gray-300 shadow-sm text-sm sm:text-base">
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

      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Filters */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <ProductFilters
            products={allProducts}
            onFilterChange={(filtered) => {
              setDisplayedProducts(filtered);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Products */}
        <div id="product-grid-top" className="lg:col-span-3 order-1 lg:order-2">
          {/* Results Header */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm font-semibold text-gray-700">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'produit trouvé' : 'produits trouvés'}
                </span>
              </div>

              {filteredProducts.length > productsPerPage && (
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
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

                      {/* Pagination logic continues... */}
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          isActive
                          onClick={(e) => e.preventDefault()}
                        >
                          {currentPage}
                        </PaginationLink>
                      </PaginationItem>

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
