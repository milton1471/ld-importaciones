"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <Header />

            <main className="container mx-auto px-4 pt-32 pb-24 max-w-6xl">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Tu Carrito</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Gestioná tu pedido antes del checkout</p>
                    </div>
                    <Link href="/search" className="text-primary font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                        Seguir Comprando
                    </Link>
                </div>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Tu carrito está vacío</h2>
                        <p className="text-slate-500 font-medium mb-10 max-w-xs mx-auto">Parece que aún no has sumado nada a tu próxima experiencia LD.</p>
                        <Link
                            href="/search"
                            className="inline-block bg-primary text-white font-black py-5 px-12 rounded-2xl hover:bg-primary-dark transition-all uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/30"
                        >
                            Explorar Catálogo
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Lista de Productos */}
                        <div className="lg:col-span-2 space-y-6">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center gap-10 animate-in fade-in slide-in-from-left-4 duration-500 group">
                                    <div className="w-32 h-32 relative rounded-3xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100/50">
                                        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-grow text-center md:text-left">
                                        <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">{item.brand}</span>
                                        <h3 className="font-bold text-xl text-slate-800 leading-tight mb-2 uppercase line-clamp-2">{item.name}</h3>
                                        <p className="text-primary font-black text-2xl tracking-tighter">${item.price.toLocaleString('es-AR')}</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center bg-slate-50 rounded-2xl p-2 border border-slate-100">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors font-black text-xl"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center font-black text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors font-black text-xl"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-300 hover:bg-rose-500 hover:text-white transition-all rounded-2xl"
                                            title="Eliminar"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resumen de Compra */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/80 border border-slate-100 sticky top-32">
                                <h2 className="font-black text-xs uppercase tracking-[0.3em] mb-10 border-b border-slate-50 pb-6 text-slate-400">Resumen de Compra</h2>
                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between font-bold text-slate-500 uppercase text-[10px] tracking-widest">
                                        <span>Productos ({totalItems})</span>
                                        <span className="text-slate-900">${totalPrice.toLocaleString('es-AR')}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-slate-500 uppercase text-[10px] tracking-widest">
                                        <span>Envío Estándar</span>
                                        <span className="text-emerald-500 font-black italic">Bonificado</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-slate-500 uppercase text-[10px] tracking-widest">
                                        <span>Impuestos</span>
                                        <span className="text-slate-900">Incluidos</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mb-12 pt-8 border-t-2 border-dashed border-slate-100">
                                    <span className="font-black text-slate-900 uppercase tracking-tighter text-xl">Total Final</span>
                                    <span className="font-black text-primary text-4xl tracking-tighter">${totalPrice.toLocaleString('es-AR')}</span>
                                </div>
                                <Link
                                    href="/checkout"
                                    className="w-full bg-primary text-white font-black py-6 rounded-2xl hover:bg-primary-dark transition-all uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <span>Iniciar Checkout</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>

                                <div className="mt-10 pt-10 border-t border-slate-50 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pago seguro garantizado</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Devolución sin cargo (30 días)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
