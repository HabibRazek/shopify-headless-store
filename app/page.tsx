
'use client';

import { Suspense } from 'react';
import HeroCarousel from '@/components/HeroCarousel';
import FeaturedProducts from '@/components/FeaturedProducts';
import Advantages from '@/components/Advantages';
import References from '@/components/References';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden sm:mt-[-128px]">
        <HeroCarousel />
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      </section>

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
      <section className="relative py-20 bg-gradient-to-br from-green-50/30 via-white to-green-50/30">
        <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 via-transparent to-green-100/20" />
        <Advantages />
      </section>

      {/* References Section */}
      <section className="relative py-20 bg-gradient-to-br from-white to-green-50/30">
        <References />
        {/* Decorative Bottom Elements */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-300/30 to-transparent" />
      </section>
    </div>
  );
}
