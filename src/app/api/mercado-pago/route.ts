import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { items, customer } = await req.json();

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          title: item.title,
          quantity: Number(item.quantity) || 1,
          unit_price: Number(item.price),
          currency_id: "BRL",
        })),
        payer: {
          name: customer?.nome,
          email: customer?.email,
          identification: customer?.cpf
            ? { type: "CPF", number: customer.cpf.replace(/\D/g, "") }
            : undefined,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/compra-realizada`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/compra-falhou`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/compra-pendente`,
        },
        auto_return: "approved",
      },
    });

    return NextResponse.json({
      initPoint: result.init_point, // URL para redirecionar o cliente
    });
  } catch (error: any) {
    console.error("Erro ao criar preferência no Mercado Pago:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
