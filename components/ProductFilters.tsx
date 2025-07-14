'use client';

import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Define the filter options types
interface FilterOptions {
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
  categories: string[];
}

interface ProductFiltersProps {
  products: any[];
  onFilterChange: (filteredProducts: any[]) => void;
}

export default function ProductFilters({ products, onFilterChange }: ProductFiltersProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    colors: [],
    sizes: [],
    priceRange: [0, 0],
    categories: [],
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract filter options from products
  useEffect(() => {
    if (!products || products.length === 0) return;

    const colors = new Set<string>();
    const sizes = new Set<string>();
    const categories = new Set<string>();
    let minPrice = Infinity;
    let maxPrice = 0;

    products.forEach((product) => {
      const node = product.node || product;

      // Extract colors (simulated - in a real app, you'd get this from variants or tags)
      if (node.title.toLowerCase().includes('kraft brun')) colors.add('Kraft Brun');
      if (node.title.toLowerCase().includes('kraft blanc')) colors.add('Kraft Blanc');
      if (node.title.toLowerCase().includes('aluminium') || node.title.toLowerCase().includes('alu')) colors.add('Aluminium');
      if (node.title.toLowerCase().includes('noir') || node.title.toLowerCase().includes('black')) colors.add('Noir');
      // Add FullAlu products to Aluminium color
      if (node.title.toLowerCase().includes('fullalu')) colors.add('Aluminium');

      // Extract sizes from product titles using regex for different formats (x, ×, *)
      // First, normalize the title by replacing × and * with x
      const normalizedTitle = node.title.replace(/[×*]/g, 'x');

      // Then extract sizes using regex
      const sizeRegex = /(\d+)x(\d+)/g;
      const matches = [...normalizedTitle.matchAll(sizeRegex)];

      if (matches.length > 0) {
        matches.forEach(match => {
          const size = `${match[1]}x${match[2]}`;
          sizes.add(size);
        });
      }



      // Extract categories from collection handles or tags - Complete collection list
      if (node.title.toLowerCase().includes('kraftview')) categories.add('KraftView');
      if (node.title.toLowerCase().includes('whiteview')) categories.add('WhiteView');
      if (node.title.toLowerCase().includes('kraftalu')) categories.add('KraftAlu');
      if (node.title.toLowerCase().includes('fullviewkraft')) categories.add('FullViewKraft');
      if (node.title.toLowerCase().includes('blackview')) categories.add('BlackView');
      if (node.title.toLowerCase().includes('fullalu')) categories.add('FullAlu');

      // Additional collections
      if (node.title.toLowerCase().includes('zipbags')) categories.add('ZIPBAGS®');
      if (node.title.toLowerCase().includes('doypack')) categories.add('Doypack');
      if (node.title.toLowerCase().includes('stand up')) categories.add('Stand Up');
      if (node.title.toLowerCase().includes('transparent')) categories.add('Transparent');
      if (node.title.toLowerCase().includes('metallise') || node.title.toLowerCase().includes('métallisé')) categories.add('Métallisé');
      if (node.title.toLowerCase().includes('biodegradable') || node.title.toLowerCase().includes('biodégradable')) categories.add('Biodégradable');
      if (node.title.toLowerCase().includes('recyclable')) categories.add('Recyclable');
      if (node.title.toLowerCase().includes('premium')) categories.add('Premium');
      if (node.title.toLowerCase().includes('eco') || node.title.toLowerCase().includes('écologique')) categories.add('Écologique');

      // Extract price range
      const price = parseFloat(node.priceRange?.minVariantPrice?.amount || '0');
      if (price < minPrice) minPrice = price;
      if (price > maxPrice) maxPrice = price;
    });

    // Sort sizes by dimensions for better organization
    const sortedSizes = Array.from(sizes).sort((a, b) => {
      // Extract dimensions from size strings (e.g., "10x15" -> [10, 15])
      const dimsA = a.split('x').map(part => parseInt(part));
      const dimsB = b.split('x').map(part => parseInt(part));

      // Compare first dimension, then second if first is equal
      if (dimsA[0] === dimsB[0]) {
        return dimsA[1] - dimsB[1];
      }
      return dimsA[0] - dimsB[0];
    });

    setFilterOptions({
      colors: Array.from(colors),
      sizes: sortedSizes,
      priceRange: [Math.floor(minPrice), Math.ceil(maxPrice)],
      categories: Array.from(categories),
    });

    // Initialize price range
    setPriceRange([Math.floor(minPrice), Math.ceil(maxPrice)]);
  }, [products]);

  // Apply filters
  useEffect(() => {
    if (!products || products.length === 0) return;

    let filteredProducts = [...products];

    // Apply color filter
    if (selectedColors.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const node = product.node || product;
        return selectedColors.some(color => {
          if (color === 'Kraft Brun') return node.title.toLowerCase().includes('kraft brun');
          if (color === 'Kraft Blanc') return node.title.toLowerCase().includes('kraft blanc');
          if (color === 'Aluminium') return node.title.toLowerCase().includes('aluminium') ||
                                           node.title.toLowerCase().includes('alu') ||
                                           node.title.toLowerCase().includes('fullalu');
          if (color === 'Transparent') return node.title.toLowerCase().includes('transparent');
          if (color === 'Noir') return node.title.toLowerCase().includes('noir') || node.title.toLowerCase().includes('black');
          return false;
        });
      });
    }

    // Apply size filter
    if (selectedSizes.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const node = product.node || product;

        // First, normalize the title by replacing × and * with x
        const normalizedTitle = node.title.replace(/[×*]/g, 'x');

        return selectedSizes.some(size => {
          // Create regex patterns to match the size in different formats
          // We need to be careful with word boundaries since sizes are often followed by +
          const patterns = [
            new RegExp(`\\b${size}\\b`, 'i'),       // Exact match with word boundaries
            new RegExp(`\\b${size}\\+`, 'i'),       // Size followed by +
            new RegExp(`\\b${size}\\s`, 'i'),       // Size followed by space
            new RegExp(`\\b${size}[\\s+]`, 'i')     // Size followed by space or +
          ];

          return patterns.some(regex => regex.test(normalizedTitle));
        });
      });
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const node = product.node || product;
        return selectedCategories.some(category => {
          // Original collections
          if (category === 'KraftView') return node.title.toLowerCase().includes('kraftview');
          if (category === 'WhiteView') return node.title.toLowerCase().includes('whiteview');
          if (category === 'KraftAlu') return node.title.toLowerCase().includes('kraftalu');
          if (category === 'FullViewKraft') return node.title.toLowerCase().includes('fullviewkraft');
          if (category === 'BlackView') return node.title.toLowerCase().includes('blackview');
          if (category === 'FullAlu') return node.title.toLowerCase().includes('fullalu');

          // Additional collections
          if (category === 'ZIPBAGS®') return node.title.toLowerCase().includes('zipbags');
          if (category === 'Doypack') return node.title.toLowerCase().includes('doypack');
          if (category === 'Stand Up') return node.title.toLowerCase().includes('stand up');
          if (category === 'Transparent') return node.title.toLowerCase().includes('transparent');
          if (category === 'Métallisé') return node.title.toLowerCase().includes('metallise') || node.title.toLowerCase().includes('métallisé');
          if (category === 'Biodégradable') return node.title.toLowerCase().includes('biodegradable') || node.title.toLowerCase().includes('biodégradable');
          if (category === 'Recyclable') return node.title.toLowerCase().includes('recyclable');
          if (category === 'Premium') return node.title.toLowerCase().includes('premium');
          if (category === 'Écologique') return node.title.toLowerCase().includes('eco') || node.title.toLowerCase().includes('écologique');

          return false;
        });
      });
    }

    // Apply price filter
    filteredProducts = filteredProducts.filter((product) => {
      const node = product.node || product;
      const price = parseFloat(node.priceRange?.minVariantPrice?.amount || '0');
      return price >= priceRange[0] && price <= priceRange[1];
    });



    // Count active filters
    let count = 0;
    if (selectedColors.length > 0) count++;
    if (selectedSizes.length > 0) count++;
    if (selectedCategories.length > 0) count++;
    if (priceRange[0] > filterOptions.priceRange[0] || priceRange[1] < filterOptions.priceRange[1]) count++;
    setActiveFiltersCount(count);



    // Update parent component with filtered products
    onFilterChange(filteredProducts);
  }, [selectedColors, selectedSizes, selectedCategories, priceRange, products, filterOptions]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedCategories([]);
    setPriceRange(filterOptions.priceRange);
  };

  // Toggle color selection
  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  // Toggle size selection (currently not used)
  // const toggleSize = (size: string) => {
  //   setSelectedSizes(prev =>
  //     prev.includes(size)
  //       ? prev.filter(s => s !== size)
  //       : [...prev, size]
  //   );
  // };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="w-full">
      {/* Mobile Filter Toggle Button */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Section - Desktop */}
        <div className={`w-full md:w-64 md:block ${showMobileFilters ? 'block' : 'hidden'}`}>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Filtres</h3>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Réinitialiser
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {/* Price Range Filter */}
              <div className="border-b pb-4">
                <h3 className="text-sm font-medium mb-4">Prix</h3>
                <div className="space-y-6 pt-2">
                  <div className="pt-5">
                    <Slider
                      value={priceRange}
                      min={filterOptions.priceRange[0]}
                      max={filterOptions.priceRange[1]}
                      step={1}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mt-6"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium">{priceRange[0]} TND</span>
                    <span className="text-sm font-medium">{priceRange[1]} TND</span>
                  </div>
                </div>
              </div>

              {/* Colors Filter */}
              {filterOptions.colors.length > 0 && (
                <div className="border-b pb-4">
                  <h3 className="text-sm font-medium mb-4">Couleurs</h3>

                  {/* All Colors option */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className={`w-7 h-7 rounded-full cursor-pointer flex items-center justify-center ${selectedColors.length === 0 ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                      onClick={() => {
                        if (selectedColors.length > 0) {
                          setSelectedColors([]);
                        }
                      }}
                    >
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-800 via-gray-400 to-black"></div>
                    </div>
                    <label
                      htmlFor="color-all"
                      className="text-sm font-medium cursor-pointer"
                      onClick={() => {
                        if (selectedColors.length > 0) {
                          setSelectedColors([]);
                        }
                      }}
                    >
                      Toutes les couleurs
                    </label>
                  </div>

                  {/* Divider */}
                  <div className="my-2 border-t border-gray-200"></div>

                  <div className="pt-2 flex flex-wrap">
                    {filterOptions.colors.map((color) => {
                      // Define color mapping for the circles
                      let bgColor = "bg-gray-200";
                      if (color === "Kraft Brun") bgColor = "bg-amber-800";
                      if (color === "Kraft Blanc") bgColor = "bg-gray-100 border border-gray-300";
                      if (color === "Aluminium") bgColor = "bg-gray-400";
                      if (color === "Noir") bgColor = "bg-black";

                      return (
                        <div key={color} className="flex items-center space-x-3 mb-3 mr-4">
                          <div
                            className={`w-7 h-7 rounded-full cursor-pointer flex items-center justify-center ${selectedColors.includes(color) ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                            onClick={() => toggleColor(color)}
                          >
                            <div className={`w-5 h-5 rounded-full ${bgColor}`}></div>
                          </div>
                          <label
                            htmlFor={`color-${color}`}
                            className="text-sm font-medium cursor-pointer"
                            onClick={() => toggleColor(color)}
                          >
                            {color}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sizes Filter */}
              {filterOptions.sizes.length > 0 && (
                <div className="border-b pb-4">
                  <h3 className="text-sm font-medium mb-4">Tailles</h3>
                  <div className="space-y-4">
                    <Select
                      value={selectedSizes.length === 1 ? selectedSizes[0] : "all_sizes"}
                      onValueChange={(value) => {
                        if (value === "all_sizes") {
                          setSelectedSizes([]);
                        } else {
                          setSelectedSizes([value]);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Toutes les tailles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_sizes">Toutes les tailles</SelectItem>
                        {filterOptions.sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size} cm
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedSizes.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-600 font-medium">
                          Taille sélectionnée: {selectedSizes[0]} cm
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSizes([])}
                          className="text-xs text-gray-500 hover:text-gray-700 h-6 px-2"
                        >
                          Réinitialiser
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Categories Filter */}
              {filterOptions.categories.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-4">Collections</h3>
                  <div className="space-y-2">
                    {/* All Collections option */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="category-all"
                        checked={selectedCategories.length === 0}
                        onCheckedChange={() => {
                          if (selectedCategories.length > 0) {
                            setSelectedCategories([]);
                          }
                        }}
                      />
                      <label
                        htmlFor="category-all"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Toutes les collections
                      </label>
                    </div>

                    {/* Divider */}
                    <div className="my-2 border-t border-gray-200"></div>

                    {/* Individual categories */}
                    {filterOptions.categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid will be rendered by parent component */}
        <div className="flex-grow">
          {/* This is just a placeholder - the actual grid is rendered by the parent */}
        </div>
      </div>
    </div>
  );
}
