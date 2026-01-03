import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

export async function POST(request: Request) {
  try {
    const { userId, userEmail } = await request.json();

    const preference = new Preference(client);
    
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'suscripcion-anual',
            title: 'Suscripción Premium - Habemus Info',
            quantity: 1,
            unit_price: 2500, // Precio en pesos
            currency_id: 'ARS',
          }
        ],
        // Guardamos el ID del usuario para saber a quién activar luego
        external_reference: userId, 
        payer: { email: userEmail },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/`,
          failure: `${process.env.NEXT_PUBLIC_URL}/`,
          pending: `${process.env.NEXT_PUBLIC_URL}/`,
        },
        auto_return: 'approved',
        // El Webhook es donde Mercado Pago nos avisa del pago
        notification_url: `${process.env.NEXT_PUBLIC_URL}/api/mercadopago/webhook`,
      },
    });

    return NextResponse.json({ init_url: result.init_point });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear el pago' }, { status: 500 });
  }
}