'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  images?: string[];
  description?: string;
  sizes?: number[];
  selectedSize?: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string, size?: number) => void;
  updateQuantity: (productId: string, quantity: number, size?: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      // Create a unique key for the product (id + size if applicable)
      const cartKey = product.selectedSize 
        ? `${product.id}-${product.selectedSize}`
        : product.id;
      
      const existingItemIndex = prevCart.findIndex(item => {
        const itemKey = item.selectedSize 
          ? `${item.id}-${item.selectedSize}`
          : item.id;
        return itemKey === cartKey;
      });

      if (existingItemIndex > -1) {
        // Item exists, increase quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      } else {
        // New item, add to cart
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string, size?: number) => {
    setCart(prevCart => 
      prevCart.filter(item => {
        if (size !== undefined) {
          return !(item.id === productId && item.selectedSize === size);
        }
        return item.id !== productId;
      })
    );
  };

  const updateQuantity = (productId: string, quantity: number, size?: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item => {
        if (size !== undefined) {
          if (item.id === productId && item.selectedSize === size) {
            return { ...item, quantity };
          }
        } else if (item.id === productId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
