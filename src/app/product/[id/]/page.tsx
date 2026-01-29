"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, use } from "react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import CartButton from "@/components/CartButton";

// Mock data generator for demo purposes
const getProduct = (id: string): Product => ({
    id: parseInt(id) || 1,
    name: `Producto Importado Premium #${id}`,
    price: 89900 + (parseInt(id) * 500),
});

export default function ProductPage() {
    const params = useParams();
    const id = params.id as string;
    const product = getProduct(id);
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const relatedProducts: Product[] = [
        { id: 101, name: "Gadget Pro X1", price: 45000 },
        { id: 102, name: "Accesorio Elite v2", price: 12000 },
        { id: 103, name: "Smart Link Hub", price: 89000 },
        { id: 104, name: "Power Wall Charger", price: 7500 },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans pb-24">
            <header className="bg-primary text-white py-4 px-4 md:px-12 flex justify-between items-center shadow-lg sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-black text-primary text-2xl shadow-sm">LD</div>
                    <span className="hidden md:block font-bold tracking-tighter text-xl uppercase">Importaciones</span>
                </Link>
                <div className="flex items-center gap-6">
                    <CartButton />
                </div>
            </header>

            {/* Breadcrumbs */}
            <nav className="container mx-auto px-6 py-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                <span>/</span>
                <span className="hover:text-primary transition-colors cursor-pointer">Tecnología</span>
                <span>/</span>
                <span className="text-slate-500">{product.name}</span>
            </nav>

            <main className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                {/* Gallery Side */}
                <div className="space-y-6">
                    <div className="relative aspect-square bg-slate-50 rounded-[40px] overflow-hidden border border-slate-100 group cursor-zoom-in">
                        <div className="absolute inset-0 flex items-center justify-center text-slate-100 font-black italic text-[200px] opacity-10 select-none">LD</div>
                        <div className="absolute top-8 left-8 bg-primary text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-xl">Original Import</div>
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500"></div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`aspect-square rounded-2xl bg-slate-50 border-2 transition-all cursor-pointer hover:border-primary/30 ${i === 1 ? 'border-primary' : 'border-slate-50'}`}></div>
                        ))}
                    </div>
                </div>

                {/* Content Side */}
                <div className="flex flex-col">
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-[0.9] mb-6">{product.name}</h1>

                    <div className="flex items-center gap-4 mb-10">
                        <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map(i => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">48 Reseñas Verificadas</span>
                    </div>

                    <p className="text-slate-400 font-medium leading-relaxed mb-10 text-lg">
                        Producto de alta gama seleccionado exclusivamente por nuestros expertos en logística internacional. Calidad superior garantizada con certificación de origen.
                    </p>

                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-12">
                        <div className="flex items-baseline gap-4 mb-2">
                            <span className="text-4xl font-black text-primary tracking-tighter">${product.price.toLocaleString('es-AR')}</span>
                            <span className="text-slate-300 line-through font-bold text-xl">${(product.price * 1.3).toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                        </div>
                        <p className="text-[10px] font-black text-green-500 uppercase tracking-widest italic">Ahorro disponible por tiempo limitado</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch gap-6 mb-12">
                        <div className="flex items-center bg-slate-50 rounded-2xl p-2 border border-slate-100">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center font-black text-xl text-slate-400 hover:text-primary transition-colors">-</button>
                            <span className="w-12 text-center font-black text-lg">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center font-black text-xl text-slate-400 hover:text-primary transition-colors">+</button>
                        </div>
                        <button
                            onClick={() => {
                                for (let i = 0; i < quantity; i++) addToCart(product);
                                // Podríamos añadir un toast o feedback visual aquí
                            }}
                            className="flex-grow bg-primary text-white font-black py-5 px-12 rounded-2xl hover:bg-primary-dark transition-all uppercase text-sm tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-4"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Añadir al Carrito</span>
                        </button>
                    </div>

                    {/* Key Benefits */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl">
                            <div className="w-10 h-10 bg-primary/5 text-primary rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-0.5">Envío</p>
                                <p className="text-xs font-black uppercase">Express 24 hs</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl">
                            <div className="w-10 h-10 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-0.5">Garantía</p>
                                <p className="text-xs font-black uppercase">12 Meses Oficial</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Related Products */}
            <section className="container mx-auto px-6 mt-32">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">También te puede interesar</h2>
                    <div className="hidden md:block w-32 h-1 bg-slate-100"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {relatedProducts.map(prod => (
                        <Link href={`/product/${prod.id}`} key={prod.id} className="group">
                            <div className="aspect-[4/5] bg-slate-50 rounded-3xl mb-6 relative overflow-hidden border border-slate-100 transition-all group-hover:-translate-y-2 group-hover:shadow-xl duration-500">
                                <div className="absolute inset-0 flex items-center justify-center text-slate-100 font-bold italic text-2xl uppercase opacity-20">LD</div>
                            </div>
                            <h3 className="font-bold text-slate-700 text-sm group-hover:text-primary transition-colors leading-tight mb-2 uppercase">{prod.name}</h3>
                            <p className="text-primary font-black text-lg tracking-tighter">${prod.price.toLocaleString('es-AR')}</p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
