import { NextResponse } from "next/server";
import { createOrder } from "@/lib/woocommerce";

export async function POST(request: Request) {
    try {
        const orderData = await request.json();

        // Server-side call to WooCommerce
        const order = await createOrder(orderData);

        return NextResponse.json(order);
    } catch (error: any) {
        console.error("Order API Error:", error);
        if (error.response?.data) {
            console.error("WooCommerce Error Details:", error.response.data);
        }
        return NextResponse.json(
            { error: error.message || "Error al procesar el pedido" },
            { status: 500 }
        );
    }
}
