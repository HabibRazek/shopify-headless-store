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
      <div className='sm:lg:-mt-[140px] mt-[-60px]'>
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




      <div className="hidden md:flex justify-start ring-offset-slate-200 mt-[-120px]">
        <div className='z-30 animate-bounce'>
          <Image
            src="/ArrowLeft.png"
            alt="Arrow pointing to products"
            width={180}
            height={160}
            className="object-contain z-30 w-[120px] h-[100px] sm:w-[180px] sm:h-[160px] sm:lg:ml-10 mt-[15px]"
          />
          <h1 className='font-extrabold mb-5 sm:text-3xl ml-[100px] mt-[-100px] lg:sm:ml-40 -rotate-12 z-30 sm:lg:mt-[-200px]'>
            Nos <br /> Categories
          </h1>
        </div>
      </div>

      <div className="mt-[-40px]">
        <Categories />
      </div>

      
        <div className='mt-[-80px]'>
          <CustomPackaging />
        </div>

      {/* Curved Arrow Decorations */}
      <div className="hidden md:flex justify-start ring-offset-slate-200 mt-[-20px]">
        <div className='z-30 animate-bounce'>
          <Image
            src="/ArrowLeft.png"
            alt="Arrow pointing to products"
            width={180}
            height={160}
            className="object-contain z-30 w-[120px] h-[100px] sm:w-[180px] sm:h-[160px] sm:lg:ml-10 mt-[15px]"
          />
          <h1 className='font-extrabold mb-10 sm:text-3xl ml-[100px] mt-[-100px] lg:sm:ml-40 -rotate-12 z-30 sm:lg:mt-[-200px]'>
            On ne veut pas <br /> se vanter <br /> mais...
          </h1>
        </div>
      </div>
      <div className="mt-[-120px]">
        <WhyChooseUs />
      </div>

      <div className="mt-[-80px]">
        <ProductCategories />
      </div>

      {/* CTA Section */}
      <div className="mt-[-100px]">
        <CTASection />
      </div>

      {/* References Section */}
      <div className="mt-[-80px]">
        <References />
      </div>

      <div className="mt-[-30px]">
        <SocialFollow />
      </div>
    </div>
  );
}
