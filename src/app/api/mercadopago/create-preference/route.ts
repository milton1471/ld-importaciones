import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
    try {
        const { items, orderId, customerEmail } = await request.json();

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const preference = new Preference(client);

        const body = {
            items: items.map((item: any) => ({
                id: item.id.toString(),
                title: item.name,
                quantity: item.quantity,
                unit_price: Number(item.price),
                currency_id: 'ARS',
                picture_url: item.image
            })),
            payer: {
                email: customerEmail,
            },
            back_urls: {
                success: `${siteUrl}/checkout/success`,
                failure: `${siteUrl}/checkout`,
                pending: `${siteUrl}/checkout/pending`
            },
            auto_return: "approved",
            external_reference: orderId.toString(),
            statement_descriptor: "LD IMPORTACIONES",
        };

        console.log("=== PREFERENCIA MP ===");
        console.log(JSON.stringify(body, null, 2));
        console.log("=====================");

        const response = await preference.create({ body });

        return NextResponse.json({
            id: response.id,
            init_point: response.init_point
        });
    } catch (error: any) {
        console.error('Error creating MP preference:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
