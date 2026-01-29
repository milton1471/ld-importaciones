"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import CartButton from "./CartButton";
import { CATEGORIES, PRODUCTS } from "@/data/mockData";
import { Monitor, Tent, Wrench, Home as HomeIcon, Leaf, Sparkles } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    "Tecnología": <Monitor className="h-5 w-5" />,
    "Camping": <Tent className="h-5 w-5" />,
    "Ferretería": <Wrench className="h-5 w-5" />,
    "Hogar": <HomeIcon className="h-5 w-5" />,
    "Jardinería": <Leaf className="h-5 w-5" />,
    "Limpieza": <Sparkles className="h-5 w-5" />,
};

export default function Header() {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (searchQuery.length > 1) {
            const filtered = PRODUCTS.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).slice(0, 5);
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-lg shadow-md py-2" : "bg-primary py-4"}`}>
            <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-2xl shadow-sm transition-all duration-300 ${isScrolled ? "bg-primary text-white" : "bg-white text-primary"}`}>LD</div>
                    <span className={`hidden md:block font-bold tracking-tighter text-xl uppercase transition-colors duration-300 ${isScrolled ? "text-slate-900" : "text-white"}`}>Importaciones</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    {/* ... (Categories nav) */}
                    <div className="relative group">
                        <button
                            onMouseEnter={() => setIsCatOpen(true)}
                            className={`flex items-center gap-2 font-bold text-sm uppercase tracking-widest py-2 transition-colors duration-300 ${isScrolled ? "text-slate-700 hover:text-primary" : "text-white/90 hover:text-white"}`}
                        >
                            <span>Categorías</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className={`h-4 w-4 transition-transform ${isCatOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Mega Menu */}
                        <div
                            onMouseLeave={() => setIsCatOpen(false)}
                            className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 ${isCatOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}
                        >
                            <div className="grid grid-cols-2 p-8 gap-8">
                                <div>
                                    <h3 className="text-primary font-black text-xs uppercase tracking-widest mb-6">Explorar</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {CATEGORIES.map((cat) => (
                                            <Link
                                                key={cat}
                                                href={`/search?category=${cat}`}
                                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item"
                                            >
                                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover/item:bg-primary/10 transition-colors">
                                                    <div className="text-slate-400 group-hover/item:text-primary transition-colors">
                                                        {CATEGORY_ICONS[cat] || <Monitor className="h-5 w-5" />}
                                                    </div>
                                                </div>
                                                <span className="font-bold text-sm text-slate-700 group-hover/item:text-primary">{cat}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-6 flex flex-col justify-between overflow-hidden relative">
                                    <div className="relative z-10">
                                        <h4 className="font-black text-lg text-slate-900 leading-tight mb-2">Ofertas de Temporada</h4>
                                        <p className="text-slate-500 text-sm mb-4">Aprovechá hasta 12 cuotas sin interés en productos seleccionados.</p>
                                        <button className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">Ver Todo</button>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link href="/search?filter=new" className={`font-bold text-sm uppercase tracking-widest transition-colors duration-300 ${isScrolled ? "text-slate-700 hover:text-primary" : "text-white/90 hover:text-white"}`}>Novedades</Link>
                    <Link href="/search?filter=offers" className={`font-bold text-sm uppercase tracking-widest transition-colors duration-300 ${isScrolled ? "text-slate-700 hover:text-primary" : "text-white/90 hover:text-white"}`}>Ofertas</Link>
                </nav>

                {/* Search & Actions */}
                <div className="flex items-center gap-4 md:gap-6">
                    {/* Search Bar */}
                    <div className="relative hidden lg:block">
                        <form onSubmit={handleSearch} className={`flex items-center rounded-full px-5 py-2 transition-all duration-300 ${isScrolled ? "bg-slate-100 border border-slate-200" : "bg-white/10 border border-white/20"} focus-within:bg-white focus-within:shadow-xl focus-within:border-primary/20`}>
                            <input
                                type="text"
                                placeholder="¿Qué estás buscando?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`bg-transparent border-none text-sm focus:outline-none w-48 xl:w-64 transition-colors duration-300 ${isScrolled ? "text-slate-900 placeholder-slate-400" : "text-white placeholder-white/60 focus:text-slate-900 focus:placeholder-slate-400"}`}
                            />
                            <button type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className={`h-5 w-5 transition-colors duration-300 ${isScrolled ? "text-slate-400" : "text-white/80"} hover:text-primary`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>

                        {/* Suggestions Dropdown */}
                        {suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[110]">
                                {suggestions.map(p => (
                                    <Link
                                        key={p.id}
                                        href={`/product/${p.id}`}
                                        className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none"
                                    >
                                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-slate-100">
                                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-800 line-clamp-1">{p.name}</p>
                                            <p className="text-primary font-black text-xs">${p.price.toLocaleString('es-AR')}</p>
                                        </div>
                                    </Link>
                                ))}
                                <Link href={`/search?q=${searchQuery}`} className="block p-4 text-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary bg-slate-50/50">Ver todos los resultados</Link>
                            </div>
                        )}
                    </div>

                    <button className={`lg:hidden p-2 rounded-full transition-colors ${isScrolled ? "hover:bg-slate-100 text-slate-900" : "hover:bg-white/10 text-white"}`} onClick={() => setIsSearchOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>

                    {/* User Account */}
                    <div className="relative group/user">
                        <Link href={user ? "/account" : "/login"} className={`p-2 rounded-full transition-colors flex items-center gap-2 ${isScrolled ? "hover:bg-slate-100 text-slate-900" : "hover:bg-white/10 text-white"}`}>
                            {user ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-xs">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="hidden xl:block font-bold text-sm">{user.name.split(' ')[0]}</span>
                                </div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            )}
                        </Link>

                        {user && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden opacity-0 translate-y-4 pointer-events-none group-hover/user:opacity-100 group-hover/user:translate-y-0 group-hover/user:pointer-events-auto transition-all duration-200">
                                <Link href="/account" className="block px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors">Mi Perfil</Link>
                                <Link href="/account/orders" className="block px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors">Mis Pedidos</Link>
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-6 py-4 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors border-t border-slate-100"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>

                    <CartButton isScrolled={isScrolled} />

                    {/* Mobile Menu Toggle */}
                    <button
                        className={`lg:hidden p-2 rounded-full transition-colors ${isScrolled ? "hover:bg-slate-100 text-slate-900" : "hover:bg-white/10 text-white"}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-white z-[200] transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-12">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-black text-white text-2xl">LD</div>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-100 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="h-6 w-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <nav className="flex flex-col gap-8">
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-slate-900">Inicio</Link>
                        <div className="flex flex-col gap-4">
                            <h3 className="text-primary font-black text-xs uppercase tracking-widest">Categorías</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {CATEGORIES.map(cat => (
                                    <Link
                                        key={cat}
                                        href={`/search?category=${cat}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="bg-slate-50 p-4 rounded-2xl font-bold text-sm text-slate-700 flex items-center gap-3 active:bg-slate-100 transition-colors"
                                    >
                                        <div className="text-primary/60">
                                            {CATEGORY_ICONS[cat]}
                                        </div>
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Link href="/search?filter=new" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-slate-900">Novedades</Link>
                        <Link href="/search?filter=offers" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-slate-900 text-primary">Ofertas Especiales</Link>
                    </nav>

                    <div className="mt-auto pt-12 border-t border-slate-100 space-y-6">
                        {!user ? (
                            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-4 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/30">Iniciar Sesión</Link>
                        ) : (
                            <Link href="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-black text-lg">{user.name.charAt(0)}</div>
                                <div>
                                    <div className="font-black text-slate-900">{user.name}</div>
                                    <div className="text-slate-500 text-sm font-semibold">Ver mi perfil</div>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
