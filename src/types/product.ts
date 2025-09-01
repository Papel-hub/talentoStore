// types/index.ts
export interface Product {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  preco: number;
  precoOriginal?: number;
  imagemUrl: string;
  arquivoUrl?: string; 
  categoria: string;
  features: string[];
  bestseller?: boolean;
  createdAt: any;
}