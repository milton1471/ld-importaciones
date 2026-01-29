"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";

interface ProductInteractionProps {
    product: Product;
}

export default function ProductInteraction({ product }: ProductInteractionProps) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-stretch gap-6 mb-12">
            <div className="flex items-center bg-slate-100 rounded-[2rem] p-2 border border-slate-200">
                <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-14 h-14 flex items-center justify-center font-black text-2xl text-slate-400 hover:text-primary transition-colors"
                >
                    -
                </button>
                <span className="w-14 text-center font-black text-xl text-slate-900">{quantity}</span>
                <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-14 h-14 flex items-center justify-center font-black text-2xl text-slate-400 hover:text-primary transition-colors"
                >
                    +
                </button>
            </div>
            <button
                onClick={handleAddToCart}
                className="flex-grow bg-primary text-white font-black py-6 px-12 rounded-[2rem] hover:bg-primary-dark transition-all uppercase text-sm tracking-[0.2em] shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 active:scale-95"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                <span>Añadir al Carrito</span>
            </button>
        </div>
    );
}
