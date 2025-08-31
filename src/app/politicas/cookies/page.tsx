// src/app/privacy/page.tsx  (ou pages/privacy.tsx se não for app router)

import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>

      <p className="mb-4">
        A <strong>Talento Store</strong> valoriza sua privacidade e está
        comprometida em proteger os dados pessoais de nossos usuários.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Coleta de Informações</h2>
      <p className="mb-4">
        Coletamos informações fornecidas diretamente por você, como nome, e-mail,
        telefone e dados de pagamento quando necessário. Também podemos coletar
        informações automaticamente, como endereço IP e cookies, para melhorar sua
        experiência.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. Uso das Informações</h2>
      <p className="mb-4">
        As informações coletadas são utilizadas para:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Fornecer e melhorar nossos serviços;</li>
        <li>Personalizar sua experiência no site;</li>
        <li>Enviar notificações e comunicações importantes;</li>
        <li>Cumprir obrigações legais.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Compartilhamento de Dados</h2>
      <p className="mb-4">
        Não vendemos ou alugamos suas informações pessoais. Podemos compartilhar
        seus dados apenas com parceiros confiáveis quando necessário para a
        prestação de serviços ou conforme exigido por lei.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Segurança</h2>
      <p className="mb-4">
        Utilizamos medidas técnicas e organizacionais adequadas para proteger suas
        informações contra acesso não autorizado, perda ou alteração.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Direitos do Usuário</h2>
      <p className="mb-4">
        Você tem o direito de acessar, corrigir ou excluir seus dados pessoais, bem
        como retirar seu consentimento para o uso de determinadas informações.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Alterações nesta Política</h2>
      <p className="mb-4">
        Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos
        você sobre mudanças significativas por meio do nosso site ou por e-mail.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. Contato</h2>
      <p className="mb-4">
        Em caso de dúvidas sobre esta Política de Privacidade, entre em contato
        conosco pelo e-mail:{" "}
        <a href="mailto:marcomorais568@gmail.com" className="text-blue-600 underline">
          marcomorais568@gmail.com
        </a>
      </p>
    </main>
  );
}




// src/app/privacy/page.tsx   (App Router)
// ou src/pages/privacy.tsx   (Pages Router)