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
      <div className='sm:lg:-mt-[120px] mt-[-200px] sm:mt-[-60px]'>
        <FeaturedProductsClient />
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

      
        <div className='mt-[-20px] sm:mt-[-40px] md:mt-[-60px] lg:mt-[-80px]'>
          <CustomPackaging />
        </div>

      {/* Mobile Spacing Buffer */}
      <div className="block md:hidden mb-20 h-16 sm:h-20"></div>

      {/* Curved Arrow Decorations */}
      <div className="hidden md:flex justify-start ring-offset-slate-200 mt-[-20px]">
        <div className='z-30 animate-bounce'>
          <Image
            src="/ArrowLeft.png"
            alt="Arrow pointing to products"
            width={180}
            height={160}
            className="object-contain z-30 w-[120px] h-[100px] sm:w-[180px] sm:h-[160px] sm:lg:ml-10 mt-[15px]"
            priority={false}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rw="
          />
          <h1 className='font-extrabold mb-10 sm:text-3xl ml-[100px] mt-[-100px] lg:sm:ml-40 -rotate-12 z-30 sm:lg:mt-[-200px]'>
            On ne veut pas <br /> se vanter <br /> mais...
          </h1>
        </div>
      </div>
      
      <div className="mt-0 md:mt-[-100px] lg:mt-[-120px]">
        <WhyChooseUs />
      </div>

      <div className="mt-[-20px] sm:mt-[-40px] md:mt-[-60px] lg:mt-[-80px]">
        <ProductCategories />
      </div>

      {/* CTA Section */}
      <div className="mt-[-20px] sm:mt-[-40px] md:mt-[-70px] lg:mt-[-100px]">
        <CTASection />
      </div>

      {/* References Section */}
      <div className="mt-[-150px] sm:mt-[-40px] md:mt-[-60px] lg:mt-[-80px]">
        <References />
      </div>

      <div className="mt-[-10px] sm:mt-[-20px] md:mt-[-30px]">
        <SocialFollow />
      </div>
    </div>
  );
}
