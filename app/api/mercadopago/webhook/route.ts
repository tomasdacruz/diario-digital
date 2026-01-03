import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const id = url.searchParams.get('data.id');

  if (type === 'payment' && id) {
    // 1. Consultar el estado del pago en Mercado Pago
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` }
    });
    const payment = await response.json();

    // 2. Si está aprobado, activar al usuario
    if (payment.status === 'approved') {
      const userId = payment.external_reference; // Recuperamos el ID que enviamos antes

      await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', userId);
        
      console.log(`Usuario ${userId} activado como Premium`);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}