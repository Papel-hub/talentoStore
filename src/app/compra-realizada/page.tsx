// src/app/compra-realizada/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CompraRealizadaPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5); // segundos para redirecionar

  useEffect(() => {
    // Contador regressivo
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redireciona quando chegar a 0
    if (countdown === 0) {
      router.push("/");
    }

    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
        {/* Ícone ou emoji de sucesso */}
        <div className="text-6xl mb-4 animate-bounce">🎉</div>

        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Parabéns!
        </h1>
        <p className="text-gray-700 mb-6">
          Sua compra foi realizada com sucesso. ✅
        </p>

        {/* Loader */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 border-4 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
        </div>

        <p className="text-gray-600">
          Você será redirecionado para a página inicial em <span className="font-semibold">{countdown}</span> segundos.
        </p>

        <button
          onClick={() => router.push("/")}
          className="mt-6 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          Ir agora para a página inicial
        </button>
      </div>
    </div>
  );
}
