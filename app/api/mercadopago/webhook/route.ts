import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  const url = new URL(request.url);
  const resourceId = url.searchParams.get('data.id') || url.searchParams.get('id');
  const topic = url.searchParams.get('type') || url.searchParams.get('topic');

  // Solo nos interesan las notificaciones de pagos
  if (topic === 'payment' && resourceId) {
    try {
      // 1. Validar el pago con Mercado Pago
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${resourceId}`, {
        headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` }
      });
      const payment = await response.json();

      // 2. Si el pago fue aprobado
      if (payment.status === 'approved') {
        const userId = payment.external_reference; // Recuperamos el ID de nuestro usuario

        // 3. Actualizar la tabla profiles en Supabase
        const { error } = await supabase
          .from('profiles')
          .update({ is_premium: true })
          .eq('id', userId);

        if (error) console.error("Error activando premium:", error);
        else console.log(`Usuario ${userId} ahora es Premium.`);
      }
    } catch (e) {
      console.error("Error en Webhook:", e);
    }
  }

  // Siempre responder 200 a Mercado Pago para que deje de intentar avisar
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}