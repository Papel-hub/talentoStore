// app/checkout/page.tsx

"use client";

import React, { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CheckoutPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Gerar mensagem do WhatsApp
  const generateWhatsAppMessage = () => {
    let message = "Olá! Gostaria de finalizar minha compra no Talento Store:\n\n";
    cartItems.forEach((item) => {
      message += `• ${item.titulo} (x${item.quantity})\n`;
    });
    message += `\nValor total: ${cartTotal}\n\nObrigado!`;
    return encodeURIComponent(message);
  };

  const handleFinalize = () => {
    setLoading(true);
    const whatsappUrl = `https://wa.me/18556461390?text=${generateWhatsAppMessage()}`;
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setLoading(false);
    }, 1000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Seu carrinho está vazio</h2>
          <p className="text-gray-600 mb-6">Adicione produtos antes de finalizar a compra.</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Finalizar Compra</h1>

        {/* Lista de Itens */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Itens do seu pedido</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                <Image
                  fill
                  src={item.imagemUrl}
                  alt={item.titulo}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.titulo}</h3>
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
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span className="text-blue-600">{cartTotal}</span>
          </div>
        </div>

        {/* Ação */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Continuar Comprando
          </button>
          <button
            onClick={handleFinalize}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-70"
          >
            {loading ? "Redirecionando..." : "Finalizar pelo WhatsApp"}
          </button>
        </div>

        {/* Informação */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Após clicar em "Finalizar pelo WhatsApp", você será redirecionado para conversar com nosso atendimento.
            <br />
            Aceitamos Pix, cartão e boleto.
          </p>
        </div>
      </div>
    </div>
  );
}