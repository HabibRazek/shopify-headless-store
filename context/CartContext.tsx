'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the cart item type
export interface CartItem {
  id: string;
  title: string;
  price: string;
  currency: string;
  quantity: number;
  imageUrl: string;
  handle: string;
}

// Define the cart context type
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

// Create the cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize cart from localStorage if available
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    console.log('CartContext: Initializing from localStorage');
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        console.log('CartContext: Found stored cart:', parsedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        // Initialize with empty cart if parsing fails
        setCartItems([]);
      }
    } else {
      console.log('CartContext: No stored cart found, initializing with empty cart');
      setCartItems([]);
    }
    setIsInitialized(true);
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    // Only update localStorage if the cart is initialized
    if (isInitialized) {
      console.log('CartContext: Saving cart to localStorage:', cartItems);
      localStorage.setItem('cart', JSON.stringify(cartItems));

      // Update cart count and total
      const count = cartItems.reduce((total, item) => total + item.quantity, 0);
      console.log('CartContext: Updating cart count to:', count);
      setCartCount(count);

      const total = cartItems.reduce((sum, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        return sum + price * item.quantity;
      }, 0);
      console.log('CartContext: Updating cart total to:', total);
      setCartTotal(total);
    }
  }, [cartItems, isInitialized]);

  // Add an item to the cart
  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    console.log('CartContext: Adding item to cart:', item, 'with quantity:', quantity);

    setCartItems(prevItems => {
      // Check if the item is already in the cart
      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);

      console.log('CartContext: Current cart items:', prevItems);
      console.log('CartContext: Item exists in cart?', existingItemIndex >= 0);

      let newItems;
      if (existingItemIndex >= 0) {
        // Item exists, add the new quantity to the existing quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        newItems = updatedItems;
      } else {
        // Item doesn't exist, add it with the specified quantity
        newItems = [...prevItems, { ...item, quantity }];
      }

      console.log('CartContext: New cart items:', newItems);
      return newItems;
    });
  };

  // Remove an item from the cart
  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Update the quantity of an item
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Clear the cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Create a hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
