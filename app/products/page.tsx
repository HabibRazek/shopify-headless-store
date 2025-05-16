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
  const [allProducts, setAllProducts] = useState<ShopifyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [displayedProducts, setDisplayedProducts] = useState<ShopifyProduct[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [paginatedProducts, setPaginatedProducts] = useState<ShopifyProduct[]>([]);

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

  // Apply search filter
  useEffect(() => {
    if (!allProducts.length) return;

    let result = [...allProducts];

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
          return parseFloat(nodeA.priceRange.minVariantPrice.amount) - parseFloat(nodeB.priceRange.minVariantPrice.amount);
        } else if (sortOption === 'price-desc') {
          return parseFloat(nodeB.priceRange.minVariantPrice.amount) - parseFloat(nodeA.priceRange.minVariantPrice.amount);
        } else if (sortOption === 'name-asc') {
          return nodeA.title.localeCompare(nodeB.title);
        } else if (sortOption === 'name-desc') {
          return nodeB.title.localeCompare(nodeA.title);
        }
        return 0;
      });
    }

    setFilteredProducts(result);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [allProducts, searchQuery, sortOption]);

  // Apply pagination to filtered products
  useEffect(() => {
    if (!displayedProducts.length) return;

    // Calculate pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = displayedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    setPaginatedProducts(currentProducts);

    // Log for debugging
    console.log(`Pagination: Showing products ${indexOfFirstProduct+1}-${Math.min(indexOfLastProduct, displayedProducts.length)} of ${displayedProducts.length}`);
  }, [displayedProducts, currentPage, productsPerPage]);

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
  const totalPages = Math.ceil(displayedProducts.length / productsPerPage);

  if (isLoading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  if (isError) {
    return <div className="text-center py-10">Error loading products</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search Input */}
        <div className="flex-grow">
          <SearchInput
            onSearch={handleSearch}
            placeholder="Rechercher des produits..."
          />
        </div>

        {/* Sort Options */}
        <div className="flex-shrink-0 w-full md:w-48">
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Prix: croissant</SelectItem>
              <SelectItem value="price-desc">Prix: décroissant</SelectItem>
              <SelectItem value="name-asc">Nom: A-Z</SelectItem>
              <SelectItem value="name-desc">Nom: Z-A</SelectItem>
            </SelectContent>
          </Select>
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
          {/* Results Count */}
          <div className="text-sm text-gray-500 mb-4">
            {displayedProducts.length} {displayedProducts.length === 1 ? 'produit trouvé' : 'produits trouvés'}
            {displayedProducts.length > productsPerPage && (
              <span className="ml-2">
                (Page {currentPage} sur {Math.ceil(displayedProducts.length / productsPerPage)})
              </span>
            )}
          </div>

          {/* Product Grid */}
          {displayedProducts.length > 0 ? (
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
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucun produit ne correspond à vos critères de recherche</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="pb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Tous les produits
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Parcourez notre collection de produits
        </p>
      </div>
      <Suspense fallback={<div className="text-center py-10">Loading products...</div>}>
        <Products />
      </Suspense>
    </div>
  );
}
