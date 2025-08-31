// app/confirmar-compra/page.tsx

"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

// Interface do Pedido (opcional: crie em /types se quiser)
interface Order {
  customer: {
    nome: string;
    email: string;
    cpf: string;
    celular: string;
    tipoPessoa: "fisica" | "juridica";
  };
  items: Array<{
    id: string;
    title: string;
    price: string;
    quantity: number;
  }>;
  total: number;
  paymentMethod: string;
  status: "pending";
  createdAt: string;
}

export default function ConfirmarCompraPage() {
  const { cartItems, cartTotal } = useCart();
  const router = useRouter();

  // Etapas
  const [step, setStep] = useState<1 | 2>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dados do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [celular, setCelular] = useState("");
  const [tipoPessoa, setTipoPessoa] = useState<"fisica" | "juridica">("fisica");

  // Validação
  const isFormValid = nome && email.includes("@") && celular.length >= 10 && (tipoPessoa === "juridica" || cpf.length === 14);

  // Máscara e validação de CPF
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, "");
    if (cleanCPF.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleanCPF)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false;

    return true;
  };

  // Ir para pagamento
  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (tipoPessoa === "fisica" && cpf.length === 14 && !validateCPF(cpf)) {
      alert("CPF inválido. Por favor, verifique os números.");
      return;
    }
    if (isFormValid) {
      setStep(2);
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.");
    }
  };

// Finalizar compra
const handleFinalize = async () => {
  if (!paymentMethod) {
    alert("Por favor, escolha uma forma de pagamento.");
    return;
  }

  setIsSubmitting(true);

  try {
    const order: Order = {
      customer: { nome, email, cpf, celular, tipoPessoa },
      items: cartItems.map((item) => ({
        id: item.id.toString(),
        title: item.titulo,
        price: item.preco.toString(),
        quantity: item.quantity || 1,
      })),
      total: cartTotal,
      paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await addDoc(collection(db, "orders"), order);
    alert(`🎉 Compra realizada com sucesso!\n\nUm email foi enviado para ${email} com o acesso ao produto digital.`);
    router.push("/compra-realizada");
  } catch (error) {
    console.error("Erro ao salvar pedido:", error);
    alert("Erro ao finalizar compra. Tente novamente.");
  } finally {
    setIsSubmitting(false);
  }
}; // <-- Faltava fechar aqui a função

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Botão Voltar à Loja */}
        <button
          onClick={() => router.push("/loja")}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          ← <span className="ml-1">Voltar à Loja</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Finalizar Compra
        </h1>

        {/* Indicador de Progresso */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                  step === 1 ? "bg-blue-600" : step > 1 ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {step > 1 ? "✓" : "1"}
              </div>
              <span className="text-sm font-medium text-gray-700">Identificação</span>
            </div>

            <div className={`w-16 h-1 ${step > 1 ? "bg-green-500" : "bg-gray-300"}`}></div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                  step === 2 ? "bg-blue-600" : step > 2 ? "bg-green-500" : "bg-gray-300"
                } ${step < 2 ? "opacity-50" : ""}`}
              >
                2
              </div>
              <span className="text-sm font-medium text-gray-700">Pagamento</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ====== COLUNA 1: IDENTIFICAÇÃO ====== */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">1. Identificação</h2>
            <p className="text-sm text-gray-600 mb-6">
              Utilizaremos seu e-mail para: identificar seu perfil, histórico de compra, notificação de pedidos e envio do produto digital.
            </p>

            <form onSubmit={handleContinueToPayment}>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="tipoPessoa"
                      checked={tipoPessoa === "fisica"}
                      onChange={() => setTipoPessoa("fisica")}
                      className="text-blue-600"
                    />
                    <span>Pessoa física</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="tipoPessoa"
                      checked={tipoPessoa === "juridica"}
                      onChange={() => setTipoPessoa("juridica")}
                      className="text-blue-600"
                    />
                    <span>Pessoa jurídica</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                  <input
                    type="text"
                    placeholder="ex.: Maria de Almeida Cruz"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="ex.: maria@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                {tipoPessoa === "fisica" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => {
                        const masked = maskCPF(e.target.value);
                        setCpf(masked);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Celular / WhatsApp</label>
                  <div className="flex space-x-2">
                    <span className="px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-100">+55</span>
                    <input
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={celular}
                      onChange={(e) => setCelular(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors mt-6 ${
                    isFormValid
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {step === 1 ? 'Ir para Pagamento' : 'Editar Identificação'}
                </button>
              </div>
            </form>
          </div>

          {/* ====== COLUNA 2: PAGAMENTO ====== */}
          <div className={`bg-white p-6 rounded-2xl shadow-lg transition-all ${step >= 2 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">2. Pagamento</h2>
            {step < 2 ? (
              <p className="text-gray-500 italic">Complete a identificação para liberar o pagamento</p>
            ) : (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "pix"}
                      onChange={() => setPaymentMethod("pix")}
                      className="text-green-600"
                    />
                    <span className="font-medium">PIX (Recomendado)</span>
                  </label>
                  <p className="text-sm text-gray-600 ml-6 mt-2">Pagamento instantâneo. Produto enviado por email após confirmação.</p>
                </div>

                <div className="border rounded-lg p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="text-green-600"
                    />
                    <span className="font-medium">PayPal</span>
                  </label>
                  <p className="text-sm text-gray-600 ml-6 mt-2">Pague com conta PayPal ou cartão.</p>
                </div>

                <div className="border rounded-lg p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cartao"}
                      onChange={() => setPaymentMethod("cartao")}
                      className="text-green-600"
                    />
                    <span className="font-medium">Cartão de Crédito</span>
                  </label>
                  <p className="text-sm text-gray-600 ml-6 mt-2">Até 12x com juros. Produto enviado após confirmação.</p>
                </div>

                <button
                  onClick={handleFinalize}
                  disabled={!paymentMethod || isSubmitting}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors mt-8 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </>
                  ) : (
                    "Finalizar Compra"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ====== COLUNA 3: RESUMO DO PEDIDO ====== */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo da Compra</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cartItems.length === 0 ? (
                <p className="text-gray-600">Nenhum produto no carrinho.</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 border-b pb-3">
                    <img
                      src={item.imagemUrl}
                      alt={item.titulo}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{item.titulo}</h3>
                      <p className="text-blue-600 font-bold">{item.preco} x{item.quantity}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-blue-600">{cartTotal}</span>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p>Compras são seguras com criptografia de ponta a ponta.</p>
              <p className="mt-2">Após o pagamento, enviaremos o acesso ao produto por email.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}