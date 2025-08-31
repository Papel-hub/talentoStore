// src/components/ProductCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  // Helper para formatar preços
  const formatPrice = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative cursor-pointer"
      onClick={() => (window.location.href = `/loja/${product.id}`)}
    >
      {/* Badge "Mais Vendido" */}
      {product.bestseller && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-tr-2xl rounded-bl-2xl z-10">
          MAIS VENDIDO
        </div>
      )}

      <div className="p-6">
        {/* Imagem */}
        <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
          <Image
            src={product.imagemUrl}
            alt={`Imagem de ${product.titulo}`}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Categoria */}
        <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
          {product.categoria}
        </span>

        {/* Título */}
        <h3
          className="text-xl font-bold text-gray-900 mb-2 mt-1 line-clamp-1"
          onClick={(e) => e.stopPropagation()}
        >
          {product.titulo}
        </h3>

        {/* Subtítulo */}
        {product.subtitulo && (
          <p
            className="text-gray-600 mb-4 text-sm line-clamp-2"
            onClick={(e) => e.stopPropagation()}
          >
            {product.subtitulo}
          </p>
        )}

        {/* Features */}
        {product.features?.length > 0 && (
          <ul className="space-y-2 mb-4">
            {product.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-center text-sm text-gray-600">
                <svg
                  className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {feature.length > 50 ? `${feature.substring(0, 50)}...` : feature}
              </li>
            ))}
          </ul>
        )}

        {/* Preço */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.preco)}
            </span>
            {product.precoOriginal && (
              <span className="text-lg text-gray-500 line-through ml-2">
                {formatPrice(product.precoOriginal)}
              </span>
            )}
          </div>
        </div>

        {/* Botão Adicionar ao Carrinho */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
          aria-label={`Adicionar ${product.titulo} ao carrinho`}
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
          <span>Adicionar ao Carrinho</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
