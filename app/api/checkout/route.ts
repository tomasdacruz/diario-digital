import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

export async function POST(request: Request) {
  try {
    const { userId, userEmail } = await request.json();

    if (!userId) return NextResponse.json({ error: "Falta ID" }, { status: 400 });

    let baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

    const preference = new Preference(client);
    
    // CREAMOS EL CUERPO DEL PAGO
    const preferenceBody: any = {
      items: [
        {
          id: 'premium-monthly',
          title: 'Suscripción Premium - Habemus Info',
          quantity: 1,
          unit_price: 2500,
          currency_id: 'ARS',
        }
      ],
      external_reference: userId, 
      payer: { email: userEmail },
      back_urls: {
        success: `${baseUrl}/`,
        failure: `${baseUrl}/`,
        pending: `${baseUrl}/`,
      }
    };

    // LÓGICA CRÍTICA:
    // Si NO estamos en localhost, activamos el auto_return y el webhook.
    // Si estamos en localhost, los quitamos para evitar el error 400 de Mercado Pago.
    if (!baseUrl.includes('localhost')) {
      preferenceBody.auto_return = 'approved';
      preferenceBody.notification_url = `${baseUrl}/api/mercadopago/webhook`;
    }

    const result = await preference.create({ body: preferenceBody });

    return NextResponse.json({ init_url: result.init_point });
  } catch (error: any) {
    console.error("Error detallado de Mercado Pago:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}