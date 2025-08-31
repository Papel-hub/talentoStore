// src/components/CartCheckout.tsx

"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext"; // Ajuste o caminho se necessário

export default function CartCheckout() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  // Só mostra se tiver itens
  if (cartItems.length === 0) return null;

  return (
    <section className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50 transform transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Itens do Carrinho */}
          <div className="flex-1 mb-4 lg:mb-0">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Itens no Carrinho ({cartItems.length})</h3>
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center bg-gray-100 rounded-lg px-3 py-1 text-sm">
                  <span>{item.titulo}</span>
                  <div className="flex items-center ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.id, item.quantity - 1);
                      }}
                      className="w-5 h-5 flex items-center justify-center bg-gray-300 rounded text-xs"
                    >
                      −
                    </button>
                    <span className="mx-1 bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.id, item.quantity + 1);
                      }}
                      className="w-5 h-5 flex items-center justify-center bg-gray-300 rounded text-xs"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.id);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Total e Botões */}
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-xl font-bold text-gray-900">{cartTotal}</div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // Fecha o carrinho e volta para as compras
                  const cartCheckout = document.querySelector('.fixed.bottom-0');
                  if (cartCheckout) {
                    cartCheckout.classList.add('opacity-0');
                    setTimeout(() => {
                      // Pode navegar se quiser
                      // router.push('/loja');
                    }, 300);
                  }
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Continuar Comprando
              </button>
              <button
                onClick={() => router.push('/carrinho')}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
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