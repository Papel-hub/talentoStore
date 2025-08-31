import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { email, nome, orderId, items } = req.body;

  try {
    // Transporter configurado com Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // seu email Gmail
        pass: process.env.GMAIL_PASS, // senha de app, não a senha normal!
      },
    });

    // Links de download (pode vir do Firestore, Storage ou array fixo)
    const downloadLinks = items
      .map((item: any) => `<li>${item.title} - <a href="https://meuservidor.com/files/${item.id}.pdf">Baixar</a></li>`)
      .join("");

    const mailOptions = {
      from: `"Minha Loja" <${process.env.GMAIL_USER}>`,
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
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return res.status(500).json({ message: "Erro ao enviar email." });
  }
}
