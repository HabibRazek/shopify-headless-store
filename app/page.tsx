
'use client';

import { Suspense } from 'react';
import HeroCarousel from '@/components/HeroCarousel';
import FeaturedProducts from '@/components/FeaturedProducts';
import Advantages from '@/components/Advantages';
import References from '@/components/References';

export default function Home() {
  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Featured Products Section */}
      <Suspense fallback={
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div className="mb-6 md:mb-0 animate-pulse">
                <div className="h-10 w-64 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 w-96 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-10 w-48 bg-gray-200 rounded-full"></div>
              </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                  {/* Image area */}
                  <div className="aspect-square w-full bg-gray-200"></div>

                  {/* Price tag */}
                  <div className="relative">
                    <div className="absolute top-[-12px] right-3 h-6 w-16 bg-gray-200 rounded-full"></div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

                    {/* Stock indicator */}
                    <div className="flex items-center mt-2">
                      <div className="h-2 w-2 rounded-full bg-gray-200 mr-2"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="px-4 pb-4 mt-4">
                    <div className="h-10 bg-gray-200 rounded-full w-full"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA Skeleton */}
            <div className="mt-12 flex justify-center animate-pulse">
              <div className="h-10 w-64 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </section>
      }>
        <FeaturedProducts />
      </Suspense>

      {/* Advantages Section */}
      <Advantages />

      {/* References Section */}
      <References />
    </div>
  );
}
