
'use client';

import { Suspense } from 'react';
import HeroCarousel from '@/components/HeroCarousel';
import FeaturedProducts from '@/components/FeaturedProducts';

export default function Home() {
  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Featured Products Section */}
      <Suspense fallback={
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }>
        <FeaturedProducts />
      </Suspense>
    </div>
  );
}
