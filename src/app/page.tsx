"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useProducts } from "@/hooks/useProducts";

import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartCheckout from "@/components/CartCheckout";
import Sobre from "@/components/Sobre";

export default function Home() {
  const { products, loading } = useProducts();
  const [searchQuery, setSearchQuery] = useState<string>("");

  // ====== Filtro de Produtos ======
  const filteredProducts = products.filter(
    (p) => p.categoria === "consultoria farmacêutica"
  );

  const searchedProducts = filteredProducts.filter(
    (p) =>
      p.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitulo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Transforme sua carreira{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              farmacêutica
            </span>
          </h1>

          <div className="relative w-full max-w-4xl aspect-[1092/370] mx-auto rounded-xl overflow-hidden">
            <Image
              src="/1.png"
              alt="Transforme sua carreira farmacêutica com a Talento Store"
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* PRODUTOS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Consultoria Farmacêutica
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha o produto ideal para acelerar seu crescimento profissional
            </p>
          </div>

          {/* Loader / Produtos */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : searchedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Nenhum produto encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {searchedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SOBRE */}
      <Sobre />

      {/* FOOTER */}
      <Footer />

      {/* CartCheckout só renderiza se houver produtos */}
      {products.length > 0 && <CartCheckout />}
    </div>
  );
}
