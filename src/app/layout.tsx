import type { Metadata } from "next";
import Head from "next/head";
import localFont from "next/font/local";
import { CartProvider } from "@/app/context/CartContext";
import "./../styles/globals.css";

// Fonte personalizada
const circularStd = localFont({
  src: [
    {
      path: "../fonts/Circular-Std-Book.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Circular-Std-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-circular",
  display: "swap",
  preload: true,
});

// Domínio principal (sem espaços!)
const siteUrl = "https://seusite.com";

export const metadata: Metadata = {
  title: "Talento Store | Transforme sua Carreira Farmacêutica",
  description: "Descubra os segredos para alcançar o sucesso profissional com nossos produtos digitais exclusivos, criados por especialistas do mercado farmacêutico.",
  authors: [{ name: "Marco Morais" }],
  keywords: [
    "farmacêutico",
    "consultoria farmacêutica",
    "cursos para farmacêuticos",
    "marketing digital para farmácias",
    "planos de negócio",
    "produtos digitais",
    "Talento Store",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/", // URL principal
  },
  openGraph: {
    title: "Talento Store | Produtos Digitais para Farmacêuticos",
    description:
      "Transforme sua carreira com estratégias comprovadas. Cursos, e-books e consultorias exclusivas.",
    url: siteUrl,
    siteName: "Talento Store",
    locale: "pt_BR",
    type: "website",
  // Atualize o `openGraph.images`
    images: [
  {
    url: `${siteUrl}/api/og?title=Talento+Store&subtitle=Transforme+sua+carreira+farmacêutica`,
    width: 1200,
    height: 630,
    alt: "Talento Store - Transforme sua carreira",
  },
  ],
   
  },
  twitter: {
    card: "summary_large_image",
    title: "Talento Store | Para Farmacêuticos que Querem Mais",
    description:
      "Domine o mercado com nossos produtos digitais feitos por especialistas.",
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "SEU-CÓDIGO-DE-VERIFICAÇÃO", // Adicione se usar Google Search Console
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={circularStd.variable} suppressHydrationWarning>
      <Head>
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1e40af" />
        {/* Coloque somente tags válidas aqui, sem texto/espacos extras */}
      </Head>
      <body className="font-sans antialiased bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
        <div className="relative z-10">
        <CartProvider>
          {children} 
        </CartProvider>
          </div>


      </body>
    </html>
  );
}