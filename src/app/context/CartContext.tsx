// src/context/CartContext.tsx
"use client";

import React, { createContext, useContext,
   useState, useEffect, ReactNode } from "react";
import { Product } from "@/types/product";

// Interface do Item do Carrinho
export interface CartItem extends Product {
  quantity: number;
}

// Interface do Contexto
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
  cartCount: number;
  cartTotal: string;
}

// Criar o Contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook personalizado
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de CartProvider");
  return context;
};

// Provider
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  // Carregar do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cartItems");
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar carrinho:", e);
      }
    }
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Adicionar ao carrinho
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true); // Abre automaticamente ao adicionar
  };

  // Remover do carrinho
  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Atualizar quantidade
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Limpar carrinho
  const clearCart = () => {
    setCartItems([]);
  };

  // Controle do modal
  const toggleCart = () => setCartOpen(prev => !prev);
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  // Cálculos
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
const cartTotal = cartItems.reduce((acc, item) => {
  return acc + (item.preco * item.quantity);
}, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartOpen,
        toggleCart,
        openCart,
        closeCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}