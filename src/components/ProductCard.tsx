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
        <div className="group flex flex-col h-full bg-white">
            {/* Image Container */}
            <div className="relative aspect-[4/5] bg-slate-50 rounded-[2.5rem] overflow-hidden mb-6 transition-all group-hover:shadow-2xl group-hover:-translate-y-2 duration-500 border border-slate-100/50">
                <Link href={`/product/${product.id}`} className="absolute inset-0 z-0">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    {/* Subtle Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Link>

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                    {product.isNew && (
                        <div className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">Nuevo</div>
                    )}
                    {product.isOffer && (
                        <div className="bg-rose-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-rose-500/20">Oferta</div>
                    )}
                    {product.stock <= 5 && (
                        <div className="bg-amber-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-amber-500/20">¡Últimas {product.stock}!</div>
                    )}
                </div>

                {/* Action Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                    }}
                    className="absolute bottom-6 inset-x-6 bg-primary text-white font-black py-4 rounded-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl shadow-primary/40 uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 z-20 hover:bg-primary-dark active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Agregar al Carrito
                </button>
            </div>

            {/* Info */}
            <div className="px-2 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{product.brand}</span>
                    <div className="flex items-center gap-1">
                        <span className="text-amber-400">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        </span>
                        <span className="text-slate-900 font-black text-[11px] truncate">{product.rating}</span>
                    </div>
                </div>

                <Link href={`/product/${product.id}`} className="group-hover:text-primary transition-colors block mb-3">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight uppercase line-clamp-2">{product.name}</h3>
                </Link>

                <div className="mt-auto">
                    <div className="flex items-baseline gap-2">
                        <p className="text-primary font-black text-2xl tracking-tighter">${product.price.toLocaleString('es-AR')}</p>
                        {product.isOffer && (
                            <p className="text-slate-300 font-bold text-sm line-through">${(product.price * 1.2).toLocaleString('es-AR')}</p>
                        )}
                    </div>
                    <p className="text-emerald-500 font-black text-[10px] uppercase tracking-wider mt-1">12 cuotas sin interés</p>
                </div>
            </div>
        </div>
    );
}
