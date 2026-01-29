"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface CartButtonProps {
    isScrolled?: boolean;
}

export default function CartButton({ isScrolled = false }: CartButtonProps) {
    const { cart, totalItems, totalPrice, removeFromCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative group">
            <Link
                href="/cart"
                onMouseEnter={() => setIsOpen(true)}
                className={`p-2 rounded-full transition-colors relative flex items-center justify-center ${isScrolled ? "hover:bg-slate-100 text-slate-900" : "hover:bg-white/10 text-white"
                    }`}
                title="Ver Carrito"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                    <span className="absolute top-0 right-0 bg-white text-primary text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-primary animate-in zoom-in bounce-in">
                        {totalItems}
                    </span>
                )}
            </Link>

            {isOpen && (
                <div
                    onMouseLeave={() => setIsOpen(false)}
                    className="absolute top-full right-0 mt-2 w-80 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-[100]"
                >
                    <div className="p-6">
                        <h3 className="font-black text-lg mb-4 border-b pb-2 text-slate-400 uppercase tracking-widest text-xs">Tu Carrito</h3>
                        {cart.length === 0 ? (
                            <div className="py-8 text-center">
                                <p className="text-slate-400 text-sm italic">Tu carrito está vacío</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center gap-4 group/item border-b border-slate-50 pb-3 last:border-none">
                                            <div className="flex-grow">
                                                <p className="font-bold text-sm leading-tight text-slate-700">{item.name}</p>
                                                <p className="text-primary font-black text-xs mt-1">{item.quantity} x ${item.price.toLocaleString('es-AR')}</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    removeFromCart(item.id);
                                                }}
                                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Total</span>
                                        <span className="font-black text-primary text-xl tracking-tighter">${totalPrice.toLocaleString('es-AR')}</span>
                                    </div>
                                    <Link
                                        href="/cart"
                                        className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-primary-dark transition-all uppercase text-xs tracking-[0.2em] shadow-lg shadow-primary/20 flex items-center justify-center"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Ver Pedido Completo
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
