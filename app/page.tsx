'use client';


import FeaturedProductsClient from '@/components/FeaturedProductsClient';
import Categories from '@/components/Categories';
import CTASection from '@/components/CTASection';
import References from '@/components/References';
import HeroSection from '@/components/HeroSection';
import Image from 'next/image';

import WhyChooseUs from '@/components/WhyChooseUs';
import ProductCategories from '@/components/ProductCategories';
import CustomPackaging from '@/components/CustomPackaging';
import SocialFollow from '@/components/SocialFollow';
import ServiceFeatures from '@/components/ServiceFeatures';
import GrowthPartnership from '@/components/GrowthPartnership';


export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 sm:pt-20 md:pt-24 lg:pt-28">
        <HeroSection />
      </section>

      {/* Best Sellers Section */}
      <section className="relative py-8">
        <div className="hidden md:flex justify-end mb-4">
          <div className='z-30 animate-bounce'>
            <Image
              src="/Arrow.png"
              alt="Arrow pointing to products"
              width={180}
              height={160}
              className="object-contain z-30 w-[120px] h-[100px] sm:w-[180px] sm:h-[160px] rotate-[-93deg]"
            />
            <h1 className='font-extrabold sm:text-3xl sm:mr-20 rotate-2 z-30'>
              Nos Best <br /> Sellers
            </h1>
          </div>
        </div>
        <FeaturedProductsClient />
      </section>




      {/* Categories Section */}
      <section className="relative py-8">
        <div className="hidden md:flex justify-start mb-4">
          <div className='z-30 animate-bounce'>
            <Image
              src="/ArrowLeft.png"
              alt="Arrow pointing to products"
              width={180}
              height={160}
              className="object-contain z-30 w-[120px] h-[100px] sm:w-[180px] sm:h-[160px] ml-10"
            />
            <h1 className='font-extrabold sm:text-3xl ml-[100px] -mt-20 -rotate-12 z-30'>
              Nos <br /> Categories
            </h1>
          </div>
        </div>
        <Categories />
      </section>

      {/* Custom Packaging Section */}
      <section className="py-8">
        <CustomPackaging />
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-8">
        <div className="hidden md:flex justify-start mb-4">
          <div className='z-30 animate-bounce'>
            <Image
              src="/ArrowLeft.png"
              alt="Arrow pointing to products"
              width={180}
              height={160}
              className="object-contain z-30 w-[120px] h-[100px] sm:w-[180px] sm:h-[160px] ml-10"
              priority={false}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rw="
            />
            <h1 className='font-extrabold sm:text-3xl ml-[100px] -mt-20 -rotate-12 z-30'>
              On ne veut pas <br /> se vanter <br /> mais...
            </h1>
          </div>
        </div>
        <WhyChooseUs />
      </section>

      {/* Service Features Section */}
      <section className="py-8">
        <ServiceFeatures />
      </section>

      {/* Product Categories Section */}
      <section className="py-8">
        <ProductCategories />
      </section>

      {/* CTA Section */}
      <section className="py-8">
        <CTASection />
      </section>

      {/* References Section */}
      <section className="py-8">
        <References />
      </section>

      {/* Growth Partnership Section */}
      <section className="py-8">
        <GrowthPartnership />
      </section>

      {/* Social Follow Section */}
      <section className="relative py-8">
        <div className="hidden md:flex justify-end mb-4">
          <div className='animate-bounce'>
            <Image
              src="/Arrow.png"
              alt="Arrow pointing to products"
              width={180}
              height={160}
              className="object-contain w-[120px] h-[100px] sm:w-[180px] sm:h-[160px] rotate-[-90deg]"
            />
            <h1 className='font-extrabold sm:text-3xl sm:mr-20 rotate-2 text-center'>
              suivez-nous!
            </h1>
          </div>
        </div>
        <SocialFollow />
      </section>
    </div>
  );
}
