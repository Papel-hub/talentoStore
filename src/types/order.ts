export interface Order {
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
    price: number;
    quantity: number;
  }>;
  total: number;
  paymentMethod: string;
  status: "pending";
  createdAt: string;
}