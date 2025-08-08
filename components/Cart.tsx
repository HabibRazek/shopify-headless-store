'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import CheckoutPopup from '@/components/CheckoutPopup';

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal } = useCart();

  // Check if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckout = () => {
    setIsOpen(false); // Close the cart
    setShowCheckout(true); // Open checkout dialog
  };

  // Shared cart content component
  const CartContent = ({ onClose }: { onClose: () => void }) => (
    <>
      {cartItems.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Button onClick={onClose} variant="outline" className="w-full">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          <div className="max-h-96 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-start space-x-2 sm:space-x-4 py-2 border-b border-gray-100">
                {/* Product Image */}
                <div className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 48px, 64px"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.handle}`}
                    className="text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-700 block"
                    onClick={onClose}
                  >
                    {item.title}
                  </Link>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    {formatPrice(item.price, item.currency)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center mt-1.5 sm:mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5 sm:h-6 sm:w-6 rounded-md"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </Button>
                    <span className="mx-1.5 sm:mx-2 text-xs sm:text-sm w-4 sm:w-6 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5 sm:h-6 sm:w-6 rounded-md"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </Button>
                  </div>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-red-500 flex-shrink-0"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Cart Footer */}
          <div className="p-4 border-t border-gray-200 space-y-4">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(cartTotal, 'TND')}</span>
            </div>
            <div className="space-y-2">
              {/* Primary checkout button */}
              <Button
                className="w-full"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="relative">
      {/* Cart Button */}
      <Button
        onClick={toggleCart}
        variant="link"
        size="icon"
        className="relative"
        aria-label="Open shopping cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
            {cartCount}
          </span>
        )}
      </Button>

      {/* Mobile Sheet */}
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="right" className="w-full sm:w-[400px] p-0">
            <SheetHeader className="p-4 border-b border-gray-200">
              <SheetTitle className="text-left">Your Cart ({cartCount})</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto">
              <CartContent onClose={() => setIsOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        /* Desktop Dropdown */
        isOpen && (
          <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium">Your Cart ({cartCount})</h3>
              <Button variant="ghost" size="icon" onClick={toggleCart} aria-label="Close cart">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CartContent onClose={() => setIsOpen(false)} />
          </div>
        )
      )}

      {/* Checkout Popup */}
      <CheckoutPopup
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </div>
  );
}
