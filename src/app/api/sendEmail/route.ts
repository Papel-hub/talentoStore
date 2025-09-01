// src/app/api/sendEmail/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, nome, orderId, items } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, 
      },
    });

    // Lista com os links de cada produto
    const downloadLinks = items
      .map(
        (item: any) => `
          <li style="margin-bottom:10px;">
            <strong>${item.titulo || item.title}</strong><br/>
            <a href="${item.arquivoUrl}?fl_attachment"
               target="_blank"
               rel="noopener noreferrer"
               style="color:#1a73e8; text-decoration:none;">
              📥 Baixar arquivo
            </a>
          </li>
        `
      )
      .join("");

    await transporter.sendMail({
      from: `"Talentostore" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Seu pedido #${orderId} está pronto!`,
      html: `
        <h2>Olá, ${nome}!</h2>
        <p>Obrigado pela sua compra. Aqui estão os links dos seus arquivos digitais:</p>
        <ul>
          ${downloadLinks}
        </ul>
        <p>Qualquer dúvida, basta responder este e-mail.</p>
      `,
    });

    return NextResponse.json({ message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return NextResponse.json(
      { message: "Erro ao enviar email." },
      { status: 500 }
    );
  }
}
