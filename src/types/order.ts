export interface Order {
  id?: string;
  customer: {
    nome: string;
    email: string;
    cpf?: string;
    celular: string;
    tipoPessoa: "fisica" | "juridica";
  };
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    arquivoUrl?: string | null;
  }[];
  total: number;
  status: "pending" | "paid" | "failed";
  createdAt: string;
}
