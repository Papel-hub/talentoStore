"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import Header from "@/components/Header";

export default function LojaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    "consultoria farmacêutica"
  );

  const PRODUCTS_PER_PAGE = 6;

  // carregar produtos
  const loadProducts = async (reset = false) => {
    setLoading(reset);
    try {
      let q = query(collection(db, "produtos"), orderBy("titulo"), limit(100));
      const querySnapshot = await getDocs(q);

      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      // aplica filtro fixo
      const filteredList = productList.filter(
        (p) =>
          p.categoria?.toLowerCase() === selectedCategory.toLowerCase()
      );

      const displayed = reset
        ? filteredList.slice(0, PRODUCTS_PER_PAGE)
        : [
            ...products,
            ...filteredList.slice(
              products.length,
              products.length + PRODUCTS_PER_PAGE
            ),
          ];

      const lastVisible =
        displayed.length > 0
          ? querySnapshot.docs[displayed.length - 1] || null
          : null;

      if (reset) {
        setProducts(displayed);
        setLastDoc(lastVisible);
        setHasMore(filteredList.length > PRODUCTS_PER_PAGE);
      } else {
        setProducts((prev) => [
          ...prev,
          ...filteredList.slice(
            prev.length,
            prev.length + PRODUCTS_PER_PAGE
          ),
        ]);
        setLastDoc(lastVisible);
        setHasMore(filteredList.length > displayed.length);
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // carregar mais
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      let q = query(
        collection(db, "produtos"),
        orderBy("titulo"),
        startAfter(lastDoc),
        limit(50)
      );
      const querySnapshot = await getDocs(q);

      const newProducts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      const filteredNew = newProducts.filter(
        (p) =>
          p.categoria?.toLowerCase() === selectedCategory.toLowerCase()
      );

      const combined = [...products, ...filteredNew];
      const nextBatch = combined.slice(
        0,
        products.length + PRODUCTS_PER_PAGE
      );
      const lastVisible = querySnapshot.docs[PRODUCTS_PER_PAGE - 1] || null;

      setProducts(nextBatch);
      setLastDoc(lastVisible);
      setHasMore(filteredNew.length >= PRODUCTS_PER_PAGE);
    } catch (error) {
      console.error("Erro ao carregar mais produtos:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // recarregar quando categoria mudar
  useEffect(() => {
    setLastDoc(null);
    loadProducts(true);
  }, [selectedCategory]);

  // carregar primeira vez
  useEffect(() => {
    loadProducts(true);
  }, []);

  // categorias fixas
  const categories = [
    { id: "consultoria farmacêutica", name: "Consultoria Farmacêutica" },
  ];

  // contagem
  const getCategoryCount = (id: string) => {
    return products.filter(
      (p) => p.categoria?.toLowerCase() === id.toLowerCase()
    ).length;
  };

  // adicionar ao carrinho
  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existing = cart.find(
      (item: Product & { quantity: number }) => item.id === product.id
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(cart));
    alert(`${product.titulo} adicionado ao carrinho!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* header */}
      <Header />

      {/* título loja */}
      <div className="bg-white shadow-sm py-24 text-center mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nossa <span className="text-blue-600">Loja de Produtos</span>
          </h1>
          <p className="text-lg text-gray-600">
            Escolha o produto ideal para transformar sua carreira farmacêutica.
          </p>
        </div>
      </div>

      {/* categorias */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 mt-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.name} ({getCategoryCount(category.id)})
          </button>
        ))}
      </div>

      {/* loader ou lista */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Nenhum produto encontrado.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* carregar mais */}
          {hasMore && !loading && (
            <div className="text-center mt-12">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-60"
              >
                {loadingMore ? "Carregando..." : "Carregar Mais"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
