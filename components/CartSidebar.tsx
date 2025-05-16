'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useShopContext } from '@/context/ShopContext';
import { formatPrice } from '@/lib/utils';
import CheckoutForm from './CheckoutForm';

export default function CartSidebar() {
  const {
    cart,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    checkoutUrl
  } = useShopContext();

  // State for showing checkout form
  const [showCheckout, setShowCheckout] = useState(false);

  // Delivery fee in TND
  const deliveryFee = 8;

  // Calculate subtotal (items only)
  const subtotal = cart.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  );

  // Calculate total (including delivery fee)
  const total = subtotal + deliveryFee;

  return (
    <div
      className={`fixed inset-0 overflow-hidden z-50 ${
        isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Background overlay */}
        <div
          className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${
            isCartOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={toggleCart}
        />

        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div
            className={`transform transition ease-in-out duration-500 sm:duration-700 w-screen max-w-md ${
              isCartOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Shopping cart</h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button
                      type="button"
                      className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                      onClick={toggleCart}
                    >
                      <span className="sr-only">Close panel</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flow-root">
                    {cart.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                    ) : (
                      <ul role="list" className="-my-6 divide-y divide-gray-200">
                        {cart.map((item) => (
                          <li key={item.cartItemId || `${item.variantId}_${item.title}`} className="py-6 flex">
                            {item.image && (
                              <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                <div className="relative h-full w-full">
                                  <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="100px"
                                    className="object-cover object-center"
                                  />
                                </div>
                              </div>
                            )}

                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.title}</h3>
                                  <p className="ml-4">{formatPrice(item.price, 'TND')}</p>
                                </div>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center">
                                  <button
                                    type="button"
                                    className="px-2 py-1 border rounded-md"
                                    onClick={() => updateQuantity(item.cartItemId || `${item.variantId}_${encodeURIComponent(item.title)}`, item.quantity - 1)}
                                  >
                                    -
                                  </button>
                                  <span className="mx-2">{item.quantity}</span>
                                  <button
                                    type="button"
                                    className="px-2 py-1 border rounded-md"
                                    onClick={() => updateQuantity(item.cartItemId || `${item.variantId}_${encodeURIComponent(item.title)}`, item.quantity + 1)}
                                  >
                                    +
                                  </button>
                                </div>

                                <div className="flex">
                                  <button
                                    type="button"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                    onClick={() => removeFromCart(item.cartItemId || `${item.variantId}_${encodeURIComponent(item.title)}`)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {cart.length > 0 && (
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>Subtotal</p>
                    <p>{formatPrice(subtotal.toString(), 'TND')}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <p>Delivery Fee</p>
                    <p>{formatPrice(deliveryFee.toString(), 'TND')}</p>
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-900 mt-2 pt-2 border-t border-gray-200">
                    <p>Total</p>
                    <p>{formatPrice(total.toString(), 'TND')}</p>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Checkout
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                    <p>
                      or{' '}
                      <button
                        type="button"
                        className="text-indigo-600 font-medium hover:text-indigo-500"
                        onClick={toggleCart}
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <CheckoutForm
                onClose={() => {
                  setShowCheckout(false);
                  toggleCart(); // Close the cart after checkout
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
