import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseConfig";
import { doc, updateDoc, getDocs, collection, query, where } from "firebase/firestore";
import MercadoPagoConfig, { Payment } from "mercadopago";

// Instancia o cliente Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Webhook recebido:", JSON.stringify(body, null, 2));

    const { type, data } = body;

    if (type === "payment") {
      const paymentId = data.id;

      // Buscar detalhes do pagamento
      const payment = await new Payment(client).get({ id: paymentId });

      const status = payment.status; // approved, rejected, pending, etc.
      const externalReference = payment.external_reference; // order_123456
      const preferenceId = payment.order?.id; // usado como fallback

      console.log("Pagamento encontrado:", {
        paymentId,
        status,
        externalReference,
        preferenceId,
      });

      // Buscar pedido no Firestore pelo external_reference (mais seguro)
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("mercadoPago.preferenceId", "==", preferenceId));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        for (const docSnap of querySnapshot.docs) {
          const orderRef = doc(db, "orders", docSnap.id);

          await updateDoc(orderRef, {
            status,
            updatedAt: new Date().toISOString(),
          });

          console.log(`Pedido ${docSnap.id} atualizado para status: ${status}`);
        }
      } else {
        console.warn("Pedido não encontrado para pagamento:", paymentId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Erro no webhook do Mercado Pago:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
