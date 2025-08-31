// app/carrinho/page.tsx

"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";

export default function CarrinhoPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const router = useRouter();

  if (cartCount === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Seu carrinho está vazio</h2>
          <button
            onClick={() => router.push("/loja")}
            className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
          >
            Voltar às compras
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Seu Carrinho</h1>

        {/* Lista de Itens */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b pb-4 mb-4 last:border-b-0 last:mb-0">
              <Image
                fill
                src={item. imagemUrl}
                alt={item.titulo}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{item.titulo}</h3>
                <p className="text-sm text-gray-600">{item.subtitulo}</p>
                <p className="font-bold text-blue-600">{item.preco}</p>
              </div>

              {/* Quantidade */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              {/* Remover */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 ml-4 text-xl"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span className="text-blue-600">{cartTotal}</span>
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100"
          >
            Continuar Comprando
          </button>
          <button
            onClick={() => router.push("/confirmar-compra")}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg"
          >
            Confirmar Compra
          </button>
        </div>
      </div>
    </div>
  );
}