"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function SuccessContent() {
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const orderId = searchParams.get("orderId");

    useEffect(() => {
        // Limpiar el carrito apenas llega a la página de éxito
        clearCart();
    }, [clearCart]);

    return (
        <main className="container mx-auto px-4 pt-32 pb-24 max-w-4xl text-center">
            <div className="bg-white rounded-[3rem] p-16 shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col items-center">
                <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-emerald-500/30 rotate-[15deg]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-5xl font-black uppercase tracking-tighter italic mb-4 text-slate-900">¡Pago Confirmado!</h1>
                <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-12 bg-primary/5 px-6 py-2 rounded-full italic">
                    Referencia: #{orderId || "Procesando"}
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">Tu pedido ha sido recibido con éxito</h2>
                <p className="text-slate-500 font-medium max-w-md mb-12 text-lg leading-relaxed">
                    Muchas gracias por tu compra. Pronto recibirás un correo electrónico con el detalle y el seguimiento de tu importación.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
                    <Link href="/" className="flex-1 bg-primary text-white font-black py-6 rounded-2xl hover:bg-primary-dark transition-all uppercase text-xs tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-4">
                        <span>Ir al Inicio</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </Link>
                    <Link href="/account/orders" className="flex-1 bg-slate-100 text-slate-900 font-black py-6 rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-4 border border-slate-200">
                        <span>Ver mis pedidos</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Header />
            <Suspense fallback={<div className="pt-40 text-center font-black uppercase tracking-widest text-slate-300">Cargando confirmación...</div>}>
                <SuccessContent />
            </Suspense>
            <Footer />
        </div>
    );
}
