'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type CartItem = {
  variantId: string;
  quantity: number;
  title: string;
  price: string;
  image?: string;
  // Unique identifier for the cart item (combination of variantId and title)
  cartItemId?: string;
};

type ShopContextType = {
  cart: CartItem[];
  cartCount: number;
  checkoutUrl: string | null;
  isCartOpen: boolean;
  toggleCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initialize cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('shopifyCart');
    const storedCheckoutId = localStorage.getItem('shopifyCheckoutId');
    const storedCheckoutUrl = localStorage.getItem('shopifyCheckoutUrl');

    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedCheckoutId) setCheckoutId(storedCheckoutId);
    if (storedCheckoutUrl) setCheckoutUrl(storedCheckoutUrl);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('shopifyCart', JSON.stringify(cart));
    }
  }, [cart]);

  // Calculate cart count
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Toggle cart sidebar
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Helper function to sync cart with Shopify
  const syncCartWithShopify = async (cartItems: CartItem[]) => {
    try {
      // Prepare line items for Shopify
      const lineItems = cartItems.map(cartItem => ({
        variantId: cartItem.variantId,
        quantity: cartItem.quantity
      }));

      // Call our API endpoint
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          items: lineItems,
          checkoutId: checkoutId || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error updating checkout:', data);
        return;
      }

      // Handle cart creation response
      if (data.cartCreate?.cart) {
        const cart = data.cartCreate.cart;
        setCheckoutId(cart.id);
        setCheckoutUrl(cart.checkoutUrl);

        localStorage.setItem('shopifyCheckoutId', cart.id);
        localStorage.setItem('shopifyCheckoutUrl', cart.checkoutUrl);
      }
    } catch (error) {
      console.error('Error updating checkout:', error);
    }
  };

  // Add item to cart
  const addToCart = async (item: CartItem) => {
    // Generate a unique cartItemId based on variantId and title
    const cartItemId = `${item.variantId}_${encodeURIComponent(item.title)}`;

    // Add the cartItemId to the item
    const itemWithId = {
      ...item,
      cartItemId
    };

    // Check if item already exists in cart using the cartItemId
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.cartItemId === cartItemId
    );

    let newCart: CartItem[];

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      newCart = [...cart];
      newCart[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item if it doesn't exist
      newCart = [...cart, itemWithId];
    }

    setCart(newCart);
    setIsCartOpen(true);

    // Sync with Shopify
    await syncCartWithShopify(newCart);
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId: string) => {
    const newCart = cart.filter((item) => item.cartItemId !== cartItemId);
    setCart(newCart);

    if (newCart.length === 0) {
      clearCart();
      return;
    }

    // Sync with Shopify
    await syncCartWithShopify(newCart);
  };

  // Update item quantity
  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    const newCart = cart.map((item) => {
      if (item.cartItemId === cartItemId) {
        return { ...item, quantity };
      }
      return item;
    });

    setCart(newCart);

    // Sync with Shopify
    await syncCartWithShopify(newCart);
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setCheckoutId(null);
    setCheckoutUrl(null);
    localStorage.removeItem('shopifyCart');
    localStorage.removeItem('shopifyCheckoutId');
    localStorage.removeItem('shopifyCheckoutUrl');
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        cartCount,
        checkoutUrl,
        isCartOpen,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShopContext must be used within a ShopProvider');
  }
  return context;
};
