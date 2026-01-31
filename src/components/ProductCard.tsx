"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    return (
        <div className="group flex flex-col h-full bg-white rounded-[2.5rem] p-4 lg:p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200 border border-slate-100/50">
            <Link href={`/product/${product.id}`} className="block">
                {/* Image Container */}
                <div className="relative aspect-square bg-slate-50 rounded-[2rem] overflow-hidden mb-6 transition-transform duration-500 group-hover:scale-[1.02]">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        {product.isNew && (
                            <div className="bg-primary text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">Nuevo</div>
                        )}
                        {product.isOffer && (
                            <div className="bg-rose-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-rose-500/20">Oferta</div>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-grow min-h-[140px]">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{product.brand}</span>
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full">
                            <svg className="w-3 h-3 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            <span className="text-slate-900 font-black text-[10px]">{product.rating}</span>
                        </div>
                    </div>

                    <h3 className="font-bold text-slate-800 text-base lg:text-lg leading-tight uppercase line-clamp-2 mb-4 group-hover:text-primary transition-colors h-10 lg:h-12">
                        {product.name}
                    </h3>

                    <div className="mt-auto">
                        <div className="flex flex-wrap items-baseline gap-2">
                            <p className="text-primary font-black text-xl lg:text-2xl tracking-tighter">${product.price.toLocaleString('es-AR')}</p>
                            {product.isOffer && (
                                <p className="text-slate-300 font-bold text-xs lg:text-sm line-through">${(product.price * 1.2).toLocaleString('es-AR', { maximumFractionDigits: 0 })}</p>
                            )}
                        </div>
                        <p className="text-emerald-500 font-black text-[9px] lg:text-[10px] uppercase tracking-wider mt-1">12 cuotas sin interés</p>
                    </div>
                </div>
            </Link>

            {/* Action Button - Always visible on mobile, hover on desktop */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                }}
                className="mt-6 w-full bg-primary text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-primary/20 uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-primary-dark active:scale-95"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Agregar al Carrito
            </button>
        </div>
    );
}
