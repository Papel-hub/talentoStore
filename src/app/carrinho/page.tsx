// app/carrinho/page.tsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";

export default function CarrinhoPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const router = useRouter();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

  if (cartCount === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Seu carrinho está vazio 
                          <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9"
                />
              </svg>
          </h2>
          <p className="text-gray-600 mb-6">Adicione produtos para continuar sua compra.</p>
          <button
            onClick={() => router.push("/loja")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow hover:bg-blue-700 transition"
          >
            Voltar às compras
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
  Seu Carrinho
  <svg
    className="w-7 h-7 text-blue-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9"
    />
  </svg>
</h1>

        {/* Lista de Itens */}
        <section className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center gap-4 border-b pb-6 last:border-b-0"
            >
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={item.imagemUrl}
                  alt={item.titulo}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-medium text-gray-900">{item.titulo}</h3>
                <p className="text-sm text-gray-600">{item.subtitulo}</p>
                <p className="font-bold text-blue-600 mt-1">{formatPrice(item.preco)}</p>
              </div>

              {/* Quantidade */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity === 1}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                    item.quantity === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>

              {/* Remover */}
<button
  onClick={() => removeFromCart(item.id)}
  className="text-red-500 hover:text-red-700 transition-colors"
  aria-label={`Remover ${item.titulo} do carrinho`}
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
</button>
            </div>
          ))}
        </section>

        {/* Resumo */}
        <aside className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span className="text-blue-600">{formatPrice(cartTotal)}</span>
          </div>
        </aside>

        {/* Botões */}
<div className="flex flex-col sm:flex-row gap-4">
  <button
    onClick={() => router.push("/loja")}
    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition"
  >
    Continuar Comprando
  </button>
  <button
    onClick={() => router.push("/confirmar-compra")}
    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all duration-200"
  >
    Confirmar Compra
  </button>
</div>
      </div>
    </main>
  );
}
