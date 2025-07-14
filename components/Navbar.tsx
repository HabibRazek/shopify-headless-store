'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, User, X, LogIn, LogOut, Settings } from 'lucide-react';
import { useShopContext } from '@/context/ShopContext';
import { Button } from '@/components/ui/button';
import Cart from '@/components/Cart';
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GlobalQuoteDialog } from '@/components/quote/GlobalQuoteDialog';

export default function Navbar() {
  const { } = useShopContext(); // We don't need any context values here
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 z-40 transition-all duration-500 ease-out
        ${scrolled
          ? 'lg:top-12 lg:mx-6 lg:xl:mx-20 xl:mx-32 top-4 sm:top-12 bg-white/95  shadow-2xl border-b border-gray-200/50 lg:border-none lg:bg-transparent lg:shadow-none'
          : 'top-6 sm:top-16 md:top-14 mx-6 md:mx-12 lg:mx-20 xl:mx-32'
        }
        ${mobileMenuOpen ? 'pb-4' : ''}
      `}
    >
      <div className={`transition-all duration-500 ease-out ${
        scrolled
          ? 'lg:max-w-6xl lg:mx-auto lg:bg-white/90  lg:shadow-xl lg:border lg:border-green-200/30 rounded-none sm:rounded-full container mx-auto max-w-7xl'
          : 'max-w-6xl mx-auto bg-white/90  shadow-xl border border-green-200/30 sm:rounded-full'
      }`}>
        <div className={`flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'lg:h-20 lg:px-8 lg:md:px-12 h-16 px-6' : 'h-20 px-8 md:px-12'
        }`}>
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 group relative"
            aria-label="Home"
          >
            <div className={`relative transition-all duration-300 group-hover:scale-105 ${
              scrolled ? 'h-10 w-28 md:h-12 md:w-36' : 'h-12 w-32 md:h-14 md:w-40'
            }`}>
              <Image
                src="/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp"
                alt="Packedin Logo"
                fill
                className="object-contain filter transition-all duration-300 group-hover:brightness-110"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className="relative px-6 py-3 rounded-full text-sm font-medium text-gray-700 hover:text-green-700 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Accueil</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 origin-center" />
            </Link>
            <Link
              href="/products"
              className="relative px-6 py-3 rounded-full text-sm font-medium text-gray-700 hover:text-green-700 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Produits</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 origin-center" />
            </Link>
            <Link
              href="/collections"
              className="relative px-6 py-3 rounded-full text-sm font-medium text-gray-700 hover:text-green-700 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Collections</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 origin-center" />
            </Link>
            <Link
              href="/about"
              className="relative px-6 py-3 rounded-full text-sm font-medium text-gray-700 hover:text-green-700 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">À propos</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 origin-center" />
            </Link>
            <Link
              href="/blog"
              className="relative px-6 py-3 rounded-full text-sm font-medium text-gray-700 hover:text-green-700 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Blog</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 origin-center" />
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="w-px h-6 bg-gray-300/60" />
            <Cart />

            {status === 'authenticated' ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                      <AvatarFallback className="bg-green-100 text-green-800">
                        {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                      <p className="text-xs leading-none text-gray-500">{session?.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {session?.user?.role === 'admin' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Administration</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/', redirect: true })}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/signin" className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <LogIn className="h-5 w-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">Sign in</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button - Touch Optimized */}
          <div className="flex lg:hidden items-center space-x-2 sm:space-x-3">
            <Cart />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative p-3 rounded-xl hover:bg-gray-100 transition-all duration-300 group touch-target"
              aria-label="Menu"
            >
              <div className="relative w-5 h-5">
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-700 transition-transform duration-300 rotate-0 group-hover:rotate-90" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Touch Optimized */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 sm:mt-4 mx-3 sm:mx-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 animate-slide-up border border-gray-200/50">
            <nav className="flex flex-col space-y-2 sm:space-y-3">
              <Link
                href="/"
                className="relative px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-gray-700 hover:text-primary transition-all duration-300 flex items-center group overflow-hidden touch-target"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10 text-base font-medium">Accueil</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 origin-left" />
              </Link>
              <Link
                href="/products"
                className="relative px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-gray-700 hover:text-primary transition-all duration-300 flex items-center group overflow-hidden touch-target"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10 text-base font-medium">Produits</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 origin-left" />
              </Link>
              <Link
                href="/collections"
                className="relative px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-gray-700 hover:text-primary transition-all duration-300 flex items-center group overflow-hidden touch-target"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10 text-base font-medium">Collections</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 origin-left" />
              </Link>
              <Link
                href="/about"
                className="relative px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-gray-700 hover:text-primary transition-all duration-300 flex items-center group overflow-hidden touch-target"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10 text-base font-medium">À propos</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 origin-left" />
              </Link>
              <Link
                href="/blog"
                className="relative px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-gray-700 hover:text-primary transition-all duration-300 flex items-center group overflow-hidden touch-target"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10 text-base font-medium">Blog</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 origin-left" />
              </Link>
              {status === 'authenticated' ? (
                <>
                  <Link
                    href="/profile"
                    className="px-4 py-2.5 rounded-full text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-colors duration-200 flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Mon Profil</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: '/', redirect: true });
                    }}
                    className="w-full px-4 py-2.5 rounded-full text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-colors duration-200 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Déconnexion</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="px-4 py-2.5 rounded-full text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-colors duration-200 flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Connexion</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Global Quote Dialog */}
      <GlobalQuoteDialog
        isOpen={quoteDialogOpen}
        onClose={() => setQuoteDialogOpen(false)}
      />
    </header>
  );
}
