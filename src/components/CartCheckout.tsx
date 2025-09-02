// src/components/CartCheckout.tsx

"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

export default function CartCheckout() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

  // Só mostra se tiver itens
  if (cartItems.length === 0) return null;

  return (
    <section className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Itens do Carrinho */}
          <div className="flex-1 overflow-hidden">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Itens no Carrinho ({cartItems.length})</h3>
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-gray-100 rounded-lg px-3 py-1 text-sm whitespace-nowrap"
                >
                  <span className="truncate max-w-[120px]">{item.titulo}</span>
                  <div className="flex items-center ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.id, Math.max(1, item.quantity - 1));
                      }}
                      className="w-5 h-5 flex items-center justify-center bg-gray-300 rounded text-xs hover:bg-gray-400 transition"
                      aria-label="Diminuir quantidade"
                    >
                      −
                    </button>
                    <span className="mx-1 bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.id, item.quantity + 1);
                      }}
                      className="w-5 h-5 flex items-center justify-center bg-gray-300 rounded text-xs hover:bg-gray-400 transition"
                      aria-label="Aumentar quantidade"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.id);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700 transition"
                    aria-label="Remover item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Total e Botões */}
          <div className="flex items-center space-x-6 flex-shrink-0">
            <div className="text-right">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-xl font-bold text-gray-900">{formatPrice(cartTotal)}</div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/confirmar-compra')}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-sm"
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}