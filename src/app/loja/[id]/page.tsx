// app/loja/[id]/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { useCart } from "@/app/context/CartContext";
import CartCheckout from "@/components/CartCheckout"; 


export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const productId = Array.isArray(id) ? id[0] : id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // ✅ Usa o contexto do carrinho
  const { addToCart: addToCartContext, cartItems } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const docRef = doc(db, "produtos", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Product;
          setProduct({ ...data, id: docSnap.id });
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // ✅ Função correta: usa o contexto
  const handleAddToCart = () => {
    if (!product) return;
    addToCartContext(product, quantity); // ✅ Envia produto + quantidade
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // Esconde depois de 2s
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Produto não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-28">

      <div className="max-w-7xl mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={() => router.push("/loja")}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          ← <span className="ml-1">Voltar à Loja</span>
        </button>

      {/* ====== DETALHE DO PRODUTO ====== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Imagem */}
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={product.imagemUrl}
              alt={`Imagem do produto ${product.titulo}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
            {product.bestseller && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                MAIS VENDIDO
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="space-y-6">
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {product.categoria}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {product.titulo}
            </h1>

            <p className="text-lg text-gray-600">{product.subtitulo}</p>

            {/* Preço formatado */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.preco)}
              </span>
              {product.precoOriginal && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.precoOriginal)}
                </span>
              )}
            </div>

            {/* Descrição */}
            <div className="text-gray-700 leading-relaxed">
              <p>
                {product.descricao ||
                  "Este produto exclusivo foi desenvolvido para farmacêuticos que desejam se destacar no mercado com estratégias modernas e eficazes."}
              </p>
            </div>

            {/* Benefícios */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">
                Você vai aprender:
              </h3>
              <ul className="space-y-2">
                {product.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantidade */}
            <div className="flex items-center space-x-4 mt-6">
              <label className="font-medium text-gray-700">Quantidade:</label>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                aria-label="Diminuir quantidade"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                aria-label="Aumentar quantidade"
              >
                +
              </button>
            </div>

            {/* Botão de compra */}
            <button
              onClick={handleAddToCart}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
            >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h9"
            />
          </svg>
              <span>
                Adicionar ao Carrinho
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    {cartItems.length > 0 && <CartCheckout />}
    </div>
  );
}
