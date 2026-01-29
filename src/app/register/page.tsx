"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(name, email, password);
            router.push("/account");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />

            <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-4">
                <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="p-12">
                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center font-black text-white text-3xl mx-auto mb-6 shadow-lg shadow-primary/20">LD</div>
                            <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900 mb-2">Crear Cuenta</h1>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Unite a la comunidad LD</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Juan Pérez"
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ejemplo@correo.com"
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Contraseña</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Registrarme
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                                ¿Ya tenés cuenta? <Link href="/login" className="text-primary hover:underline">Iniciá sesión</Link>
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-8 text-center border-t border-slate-100">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                            Al registrarte aceptás nuestros <a href="#" className="text-slate-600 underline">Términos y Condiciones</a>.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
