'use client';

import { Suspense } from 'react';
import FeaturedProducts from '@/components/FeaturedProducts';
import Categories from '@/components/Categories';
import CTASection from '@/components/CTASection';
import Advantages from '@/components/Advantages';
import References from '@/components/References';
import HeroSection from '@/components/HeroSection';

export default function Home() {
  return (
    <div className=" ">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <HeroSection />
        
      </section>
      
      <Categories />

      {/* Featured Products Section */}
      <Suspense fallback={
        <section className="py-4 bg-white">
          <div className="container mx-auto px-4">
            {/* Simplified skeleton loader */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="space-y-3 w-full md:w-auto">
                <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-10 w-36 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Compact product grid skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded-full mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      }>
        <FeaturedProducts />
      </Suspense>

      {/* Categories Section */}
      

      {/* CTA Section */}
      <CTASection />

      {/* Advantages Section */}
      <section className="relative py-16 bg-gradient-to-br from-green-50/20 to-white">
        <div className="absolute inset-0 bg-gradient-to-r from-green-100/10 via-transparent to-green-100/10" />
        <Advantages />
      </section>

      {/* References Section */}
      <section className="relative py-16 bg-white">
        <References />
        {/* Subtle decorative divider */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-200/20 to-transparent" />
      </section>
    </div>
  );
}