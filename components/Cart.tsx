'use client';

import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import CheckoutDialog from '@/components/CheckoutDialog';

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal } = useCart();

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckout = () => {
    setIsOpen(false); // Close the cart dropdown
    setShowCheckout(true); // Open checkout dialog
  };

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
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
            {cartCount}
          </span>
        )}
      </Button>

      {/* Cart Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium">Your Cart ({cartCount})</h3>
            <Button variant="ghost" size="icon" onClick={toggleCart} aria-label="Close cart">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {cartItems.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button onClick={toggleCart} variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="max-h-96 overflow-y-auto p-4 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 py-2 border-b border-gray-100">
                    {/* Product Image */}
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.handle}`}
                        className="text-sm font-medium text-gray-900 hover:text-gray-700 line-clamp-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.title}
                      </Link>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatPrice(item.price, item.currency)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 rounded-md"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-2 text-sm w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 rounded-md"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-red-500"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
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
                    className="w-full bg-black hover:bg-gray-800 text-white"
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
        </div>
      )}

      {/* Checkout Dialog */}
      <CheckoutDialog
        open={showCheckout}
        onOpenChange={setShowCheckout}
      />
    </div>
  );
}
