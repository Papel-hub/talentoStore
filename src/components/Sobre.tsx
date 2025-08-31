// components/Sobre.tsx
"use client";

import Image from "next/image";

export default function Sobre() {
  return (
    <section
      id="sobre"
      className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Sobre o{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Talento Store
              </span>
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Há mais de 15 anos ajudamos farmacêuticos a transformarem suas
              carreiras e alcançarem o sucesso profissional que merecem. Nossa
              missão é empoderar profissionais da saúde com conhecimento prático
              e estratégias comprovadas.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Criamos produtos digitais de alta qualidade que combinam teoria
              com prática, oferecendo soluções reais para os desafios do mercado
              farmacêutico atual.
            </p>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-white rounded-xl shadow-md">
                <div className="text-2xl font-bold text-blue-600 mb-1">50+</div>
                <div className="text-gray-600 text-sm">Cursos Criados</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-md">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  10k+
                </div>
                <div className="text-gray-600 text-sm">Alunos Satisfeitos</div>
              </div>
            </div>
          </div>

          {/* Imagem */}
          <div className="relative">
            <Image
              src="https://placehold.co/600x400/4f46e5/ffffff?text=Sobre+N%C3%B3s"
              alt="Sobre Nós"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Garantia</div>
                  <div className="text-sm text-gray-600">
                    7 dias de satisfação
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
