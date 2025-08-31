"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/lib/firebaseConfig"; // Ajuste o caminho para seu arquivo de config do Firebase
import { doc, getDoc } from "firebase/firestore";

interface Stat {
  value: string;
  label: string;
  color: "blue" | "purple" | "green" | "indigo" | "pink";
}

interface SobreData {
  title: string;
  subtitle: string;
  description: string;
  stats: Stat[];
  image: string;
  guaranteeText: string;
}

export default function Sobre() {
  const [data, setData] = useState<SobreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSobre = async () => {
      try {
        const docRef = doc(db, "pages", "sobre");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data() as SobreData);
        } else {
          console.warn("Documento 'sobre' não encontrado.");
          // Pode definir um fallback aqui, se quiser
          setData({
            title: "Sobre o Talento Store",
            subtitle: "Há mais de 15 anos ajudamos farmacêuticos...",
            description:
              "Criamos produtos digitais de alta qualidade que combinam teoria com prática...",
            stats: [
              { value: "50+", label: "Cursos Criados", color: "blue" },
              { value: "10k+", label: "Alunos Satisfeitos", color: "purple" },
            ],
            image:
              "https://placehold.co/600x400/4f46e5/ffffff?text=Sobre+N%C3%B3s",
            guaranteeText: "7 dias de satisfação",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados do Firebase:", error);
        // Fallback em caso de erro
        setData({
          title: "Sobre o Talento Store",
          subtitle: "Há mais de 15 anos ajudamos farmacêuticos...",
          description:
            "Criamos produtos digitais de alta qualidade que combinam teoria com prática...",
          stats: [
            { value: "50+", label: "Cursos Criados", color: "blue" },
            { value: "10k+", label: "Alunos Satisfeitos", color: "purple" },
          ],
          image:
            "https://placehold.co/600x400/4f46e5/ffffff?text=Sobre+N%C3%B3s",
          guaranteeText: "7 dias de satisfação",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSobre();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-600">Carregando...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-red-600">Erro ao carregar dados.</p>
        </div>
      </section>
    );
  }

  const getColorClass = (color: Stat["color"]) => {
    switch (color) {
      case "blue":
        return "text-blue-600";
      case "purple":
        return "text-purple-600";
      case "green":
        return "text-green-600";
      case "indigo":
        return "text-indigo-600";
      case "pink":
        return "text-pink-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <section
      id="sobre"
      className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div>
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              dangerouslySetInnerHTML={{
                __html: data.title.replace(
                  /(TalentoStore)/g,
                  '<span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">$1</span>'
                ),
              }}
            />

            <p className="text-lg text-gray-700 mb-6">{data.subtitle}</p>
            <p className="text-lg text-gray-700 mb-8">{data.description}</p>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-6">
              {data.stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-white rounded-xl shadow-md"
                >
                  <div
                    className={`text-2xl font-bold mb-1 ${getColorClass(
                      stat.color
                    )}`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Imagem */}
          <div className="relative">
            <Image
              src={data.image}
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
                    {data.guaranteeText}
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