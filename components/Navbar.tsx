'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, User, X } from 'lucide-react';
import { useShopContext } from '@/context/ShopContext';
import { Button } from '@/components/ui/button';
import Cart from '@/components/Cart';

export default function Navbar() {
  const { } = useShopContext(); // We don't need any context values here
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed shadow-lg sm:rounded-full sm:w-9/12 md:mx-auto sm:top-4 sm:bg-white/65 left-0 right-0 z-50 transition-all duration-300 px-4
        ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-sm'}
        ${mobileMenuOpen ? 'pb-4' : ''}
      `}
    >
      <div className="container mx-auto rounded-full border-none max-w-5xl">
        <div className="flex items-center justify-between h-14 md:h-16 px-3 md:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group"
            aria-label="Home"
          >
            <div className="relative h-8 w-24 md:h-10 md:w-32">
              <Image
                src="/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp"
                alt="Packedin Logo"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-all duration-200"
            >
              Accueil
            </Link>
            <Link
              href="/products"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-all duration-200"
            >
              Produits
            </Link>
            <Link
              href="/collections"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-all duration-200"
            >
              Collections
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-all duration-200"
            >
              À propos
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">


            <Button className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 rounded-full text-white text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-green-500/30">
              Demander un devis
            </Button>
            <Cart />
            <Link href="/account" className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <User className="h-5 w-5 text-gray-700" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <div className="flex items-center">
              <Cart />
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-700" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-4 animate-slideDown">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="px-4 py-2.5 rounded-full text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-colors duration-200 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-sm font-medium">Accueil</span>
              </Link>
              <Link
                href="/products"
                className="px-4 py-2.5 rounded-full text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-colors duration-200 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-sm font-medium">Produits</span>
              </Link>
              <Link
                href="/collections"
                className="px-4 py-2.5 rounded-full text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-colors duration-200 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-sm font-medium">Collections</span>
              </Link>
              <Link
                href="/about"
                className="px-4 py-2.5 rounded-full text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-colors duration-200 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-sm font-medium">À propos</span>
              </Link>
              <Link
                href="/account"
                className="px-4 py-2.5 rounded-full text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-colors duration-200 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-sm font-medium">Mon Compte</span>
              </Link>

              <div className="pt-2">
                <Button
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 rounded-full text-white font-medium hover:shadow-lg transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Demander un devis
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
