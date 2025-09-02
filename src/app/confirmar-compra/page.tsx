"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { db } from "@/lib/firebaseConfig"; // Certifique-se de exportar tudo do seu firebaseConfig
import { 
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";



export default function ConfirmarCompraPage() {
  const { cartItems, cartTotal } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isSubmittingStep1, setIsSubmittingStep1] = useState(false);
  const [isSubmittingStep2, setIsSubmittingStep2] = useState(false);

  // Dados do cliente
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [celular, setCelular] = useState("");
  const [tipoPessoa, setTipoPessoa] = useState<"fisica" | "juridica">("fisica");


  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);


  // Remove máscara do CPF (pontos e traço)
const sanitizeCPF = (value: string) => value.replace(/\D/g, "");

 // Validações
const isFormValid =
  nome &&
  email.includes("@") &&
  celular.length >= 10 &&
  (tipoPessoa === "juridica" || sanitizeCPF(cpf).length === 11);

  // Máscara de CPF
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  // Validar CPF
const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, "");
  if (cleanCPF.length !== 11 || /^(\d)\1+$/.test(cleanCPF)) return false;

  const calcDigit = (slice: number) => {
    let sum = 0;
    let factor = slice + 1;
    for (let i = 0; i < slice; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (factor - i);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const d1 = calcDigit(9);
  const d2 = calcDigit(10);

  return d1 === parseInt(cleanCPF.charAt(9)) && d2 === parseInt(cleanCPF.charAt(10));
};


  // Salvar cliente com status "suspenso" ao preencher identificação
  const saveClientToFirestore = async () => {
    const cleanCPF = cpf.replace(/\D/g, "");
    const clientData = {
      nome,
      email,
      cpf: tipoPessoa === "fisica" ? cleanCPF : null,
      cnpj: tipoPessoa === "juridica" ? cleanCPF : null,
      celular,
      tipoPessoa,
      status: "suspenso",
      ultimoPedido: null,
      historicoCompras: [],
      createdAt: new Date().toISOString(),
    };

    try {
      const clientsRef = collection(db, "clientes");
      const q = query(clientsRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        const existingData = querySnapshot.docs[0].data();

        // Só atualiza para "suspenso" se ainda não for "comprou"
        if (existingData.status !== "comprou") {
          await updateDoc(docRef, {
            status: "suspenso",
            updatedAt: serverTimestamp(),
          });
          console.log("Cliente atualizado para 'suspenso'");
        }
      } else {
        await addDoc(clientsRef, clientData);
        console.log("Cliente novo salvo como 'suspenso'");
      }
    } catch (error) {
      console.error("Erro ao salvar cliente na identificação:", error);
    }
  };

  // Ir para pagamento
const handleContinueToPayment = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validação do CPF
  if (tipoPessoa === "fisica" && cpf.length === 14 && !validateCPF(cpf)) {
    alert("CPF inválido. Por favor, verifique os números.");
    return;
  }

  // Validação dos campos
  if (!isFormValid) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  // Inicia o loading
  setIsSubmittingStep1(true);

  try {
    // Salva ou atualiza o cliente no Firestore
    await saveClientToFirestore();

    // Após salvar, avança para o passo 2
    setStep(2);
  } catch (error) {
    console.error("Erro ao processar identificação:", error);
    alert("Ocorreu um erro ao salvar seus dados. Tente novamente.");
  } finally {
    // Sempre finalize o loading
    setIsSubmittingStep1(false);
  }
};

  // Finalizar compra
const handleFinalize = async () => {
  if (!paymentMethod) {
    alert("Por favor, escolha uma forma de pagamento.");
    return;
  }

  setIsSubmittingStep2(true); // ✅ Use o estado correto

  try {
    const orderItems = cartItems.map((item) => ({
      id: item.id.toString(),
      title: item.titulo,
      price: parseFloat(item.preco.toString()),
      quantity: item.quantity || 1,
      arquivoUrl: item.arquivoUrl || null,
    }));

    const response = await fetch("/api/mercado-pago", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentMethod,
        items: orderItems,
        total: cartTotal,
        customer: { nome, email, cpf, celular, tipoPessoa },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Falha ao criar pagamento");
    }

    window.location.href = data.initPoint;
  } catch (error: any) {
    console.error("Erro ao processar pagamento:", error);
    alert("Erro ao processar pagamento: " + error.message);
  } finally {
    setIsSubmittingStep2(false); // ✅ Reseta o estado correto
  }
};


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={() => router.push("/loja")}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          ← <span className="ml-1">Voltar à Loja</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Finalizar Compra
        </h1>

        {/* Progresso */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                  step === 1 ? "bg-blue-600" : "bg-green-500"
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
          {/* IDENTIFICAÇÃO */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">1. Identificação</h2>
            <p className="text-sm text-gray-600 mb-6">
              Utilizaremos seu e-mail para identificar seu perfil, histórico de compra e envio do produto digital.
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
  disabled={!isFormValid || isSubmittingStep1}
  className={`w-full py-3 rounded-xl font-semibold transition-colors mt-6 flex items-center justify-center ${
    isFormValid && !isSubmittingStep1
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
>
  {isSubmittingStep1 ? (
    <>
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Validando...
    </>
  ) : (
    step === 1 ? "Ir para Pagamento" : "Editar Identificação"
  )}
</button>
              </div>
            </form>
          </div>

          {/* PAGAMENTO */}
          <div className={`bg-white p-6 rounded-2xl shadow-lg transition-all ${step >= 2 ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">2. Pagamento</h2>
            {step < 2 ? (
              <p className="text-gray-500 italic">Complete a identificação para liberar o pagamento</p>
            ) : (
              <div className="space-y-4">
                {["pix", "cartao"].map((method) => (
                  <div key={method} className="border rounded-lg p-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="text-green-600"
                      />
                      <span className="font-medium">
                        {method === "pix" && "PIX (Recomendado)"}
                        {method === "cartao" && "Cartão de Crédito"}
                      </span>
                    </label>
                    <p className="text-sm text-gray-600 ml-6 mt-2">
                      {method === "pix" && "Pagamento instantâneo. Produto enviado por email após confirmação."}
                      {method === "cartao" && "Até 12x com juros. Produto enviado após confirmação."}
                    </p>
                  </div>
                ))}
<button
  onClick={handleFinalize}
  disabled={!paymentMethod || isSubmittingStep2}
  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors mt-8 flex items-center justify-center"
>
  {isSubmittingStep2 ? (
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

          {/* RESUMO */}
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
                      <p className="text-blue-600 font-bold">
                        {formatPrice(parseFloat(item.preco.toString()))} x{item.quantity}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-blue-600">{formatPrice(cartTotal)}</span>
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