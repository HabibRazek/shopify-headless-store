'use client';

import { Suspense } from 'react';
import FeaturedProducts from '@/components/FeaturedProducts';
import Categories from '@/components/Categories';
import CTASection from '@/components/CTASection';
import References from '@/components/References';
import HeroSection from '@/components/HeroSection';
import Image from 'next/image';
import WhyChooseUs from '@/components/WhyChooseUs';
import ProductCategories from '@/components/ProductCategories';
import CustomPackaging from '@/components/CustomPackaging';
import SocialFollow from '@/components/SocialFollow';


export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <HeroSection />
      </section>
      <div>
        <div className="absolute left-0 w-full h-4 bg-gradient-to-r from-green-800 via-green-500 to-[#70db19] -rotate-2  mt-[-50px]"></div>
        <div className="hidden md:flex justify-end mt-[-120px] ">
          <div className='z-30 sm:lg:mt-[-150px] animate-bounce '>
            <Image
              src="/Arrow.png"
              alt="Arrow pointing to products"
              width={180}
              height={160}
              className="object-contain z-30 w-[120px] h-[100px] sm:w-[180px] sm:h-[160px] mt-[15px] rotate-[-93deg]"
            />
            <h1 className='font-extrabold sm:text-3xl sm:mr-20 rotate-2 z-30'>
              Nos Best <br /> Sellers
            </h1>
          </div>
        </div>
      </div>
      <div className='sm:lg:-mt-[120px] mt-[-40px]'>
        <Suspense fallback={
          <section className="py-4 bg-transparent">
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
      </div>
      {/* Awesome Animated Separator */}
      <div className="relative w-full flex justify-center mt-[-50px] mb-8 z-10">
        <div className="relative w-9/12 max-w-4xl">
          {/* Glow effect underneath */}
          <div className="absolute inset-0 h-4 bg-gradient-to-r from-green-800/20 via-green-500/30 to-[#70db19]/20 rounded-full blur-sm scale-110 -z-10"></div>

          {/* Main gradient line with enhanced effects */}
          <div className="h-4 bg-gradient-to-r from-green-800 via-green-500 to-[#70db19] rounded-full separator-glow relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse rounded-full"></div>

            {/* Moving light effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-[shimmer_3s_ease-in-out_infinite]"></div>

            {/* Inner highlight */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full"></div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-green-600 rounded-full shadow-lg animate-pulse relative">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-30"></div>
            </div>
          </div>

          <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-green-400 rounded-full shadow-lg animate-pulse relative" style={{ animationDelay: '1s' }}>
              <div className="absolute inset-0 bg-green-300 rounded-full animate-ping opacity-30" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          {/* Side sparkles */}
          <div className="absolute -left-6 top-0 w-2 h-2 bg-green-300 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -right-6 bottom-0 w-2 h-2 bg-green-300 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      <div className="hidden md:flex justify-start ring-offset-slate-200 mt-[-100px]">
        <div className='z-30 animate-bounce'>
          <Image
            src="/ArrowLeft.png"
            alt="Arrow pointing to products"
            width={180}
            height={160}
            className="object-contain z-30 w-[120px] h-[100px] sm:w-[180px] sm:h-[160px] sm:lg:ml-10 mt-[15px]"
          />
          <h1 className='font-extrabold mb-10 sm:text-3xl ml-[100px] mt-[-100px] lg:sm:ml-40 -rotate-12 z-30 sm:lg:mt-[-200px]'>
            Nos <br /> Categories
          </h1>
        </div>
      </div>

      <div className="mt-[-20px]">
        <Categories />
      </div>
      {/* Curved Arrow Decorations */}
      <div className="hidden md:flex justify-start ring-offset-slate-200">
        <div className='z-30 animate-bounce'>
          <Image
            src="/ArrowLeft.png"
            alt="Arrow pointing to products"
            width={180}
            height={160}
            className="object-contain z-30 w-[120px] h-[100px] sm:w-[180px] sm:h-[160px] sm:lg:ml-10 mt-[15px]"
          />
          <h1 className='font-extrabold mb-20 sm:text-3xl ml-[100px] mt-[-100px] lg:sm:ml-40 -rotate-12 z-30 sm:lg:mt-[-200px]'>
            On ne veut pas <br /> se vanter <br /> mais...
          </h1>
        </div>
      </div>
      <div className="mt-[-40px]">
        <WhyChooseUs />
      </div>


      <div className="hidden md:flex justify-end mt-[-20px] ">
        <div className='z-30 sm:lg:mt-[-80px] animate-bounce '>
          <Image
            src="/Arrow.png"
            alt="Arrow pointing to products"
            width={180}
            height={160}
            className="object-contain z-30 w-[120px] h-[100px] sm:w-[180px] sm:h-[160px] mt-[15px] rotate-[-90deg]"
          />
          <h1 className='font-extrabold sm:text-3xl sm:mr-20 rotate-2 z-30'>
            Emballez le <br /> a votre facon
          </h1>
        </div>
      </div>

      <div className="mt-[20px]">
        <ProductCategories />
      </div>

      <CustomPackaging />

      {/* CTA Section */}
      <div className="mt-[-40px]">
        <CTASection />
      </div>

      {/* References Section */}
      <section className="relative py-8 bg-white mt-[-40px]">
        <References />

        {/* Subtle decorative divider */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-200/20 to-transparent" />
      </section>
      <SocialFollow />
    </div>
  );
}
