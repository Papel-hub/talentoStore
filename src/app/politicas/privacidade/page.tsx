

"use client";

import { usePrivacyPolicy } from "@/hooks/usePrivacyPolicy";

export default function PrivacyPage() {
  const { data, loading } = usePrivacyPolicy();

  if (loading) {
    return <p className="p-6">Carregando...</p>;
  }

  if (!data) {
    return <p className="p-6 text-red-500">Não foi possível carregar a política.</p>;
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
      <div className="prose prose-lg">
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>
    </main>
  );
}

