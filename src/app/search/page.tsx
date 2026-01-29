"use client";

import { Suspense } from "react";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, CATEGORIES, BRANDS } from "@/data/mockData";
import { Product } from "@/types";

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const queryParam = searchParams.get("q") || "";
    const catParam = searchParams.get("category") || "";
    const filterParam = searchParams.get("filter") || "";

    const [searchQuery, setSearchQuery] = useState(queryParam);
    const [selectedCategory, setSelectedCategory] = useState(catParam);
    const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
    const [sortBy, setSortBy] = useState("newest");
    const [showInStockOnly, setShowInStockOnly] = useState(false);

    useEffect(() => {
        setSearchQuery(queryParam);
        setSelectedCategory(catParam);
    }, [queryParam, catParam]);

    const filteredProducts = useMemo(() => {
        let result = [...PRODUCTS];

        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory) {
            result = result.filter(p => p.category === selectedCategory);
        }

        if (filterParam === "new") {
            result = result.filter(p => p.isNew);
        } else if (filterParam === "offers") {
            result = result.filter(p => p.isOffer);
        }

        if (selectedBrand.length > 0) {
            result = result.filter(p => selectedBrand.includes(p.brand));
        }

        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        if (showInStockOnly) {
            result = result.filter(p => p.stock > 0);
        }

        if (sortBy === "price-asc") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-desc") {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === "rating") {
            result.sort((a, b) => b.rating - a.rating);
        }

        return result;
    }, [searchQuery, selectedCategory, filterParam, selectedBrand, priceRange, showInStockOnly, sortBy]);

    const clearFilters = () => {
        router.push("/search");
        setSearchQuery("");
        setSelectedCategory("");
        setSelectedBrand([]);
        setPriceRange([0, 1000000]);
        setShowInStockOnly(false);
    };

    const toggleBrand = (brand: string) => {
        if (selectedBrand.includes(brand)) {
            setSelectedBrand(selectedBrand.filter(b => b !== brand));
        } else {
            setSelectedBrand([...selectedBrand, brand]);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans">
            <Header />

            <main className="pt-32 pb-24">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="mb-12">
                        <h1 className="text-4xl font-black tracking-tighter uppercase mb-4">
                            {searchQuery ? `Resultados para "${searchQuery}"` : "Nuestro Catálogo"}
                        </h1>
                        <div className="flex items-center gap-4 text-slate-400 font-bold text-sm uppercase tracking-widest">
                            <span>{filteredProducts.length} Productos encontrados</span>
                            <div className="h-4 w-[2px] bg-slate-100"></div>
                            <button onClick={clearFilters} className="text-primary hover:underline">Limpiar Filtros</button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        <aside className="w-full lg:w-80 shrink-0 space-y-12">
                            <div className="space-y-6">
                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Categorías</h3>
                                <div className="flex flex-wrap lg:flex-col gap-3">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
                                            className={`px-5 py-3 rounded-xl border text-left font-bold text-sm transition-all ${selectedCategory === cat ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white border-slate-100 text-slate-700 hover:border-primary hover:text-primary"}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Marcas</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {BRANDS.map(brand => (
                                        <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBrand.includes(brand)}
                                                    onChange={() => toggleBrand(brand)}
                                                    className="peer hidden"
                                                />
                                                <div className="w-6 h-6 border-2 border-slate-200 rounded-lg group-hover:border-primary peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-1 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="font-bold text-sm text-slate-600 group-hover:text-primary transition-colors">{brand}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Rango de Precio</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex-1 text-center font-black text-sm text-slate-400">
                                            ${priceRange[0]}
                                        </div>
                                        <div className="h-[2px] w-4 bg-slate-200"></div>
                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex-1 text-center font-black text-sm text-slate-400">
                                            ${priceRange[1]}
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="500000"
                                        step="10000"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full accent-primary h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Disponibilidad</h3>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={showInStockOnly}
                                            onChange={() => setShowInStockOnly(!showInStockOnly)}
                                            className="peer hidden"
                                        />
                                        <div className="w-12 h-6 bg-slate-200 rounded-full peer-checked:bg-primary transition-all"></div>
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                                    </div>
                                    <span className="font-bold text-sm text-slate-600 group-hover:text-primary transition-colors">Sólo en Stock</span>
                                </label>
                            </div>
                        </aside>

                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                                <div className="hidden md:block">
                                    <p className="font-bold text-slate-400 text-sm">Mostrando resultados para: <span className="text-slate-900">{selectedCategory || "Todas las categorías"}</span></p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-black text-xs uppercase tracking-widest text-slate-400">Ordenar por:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="bg-slate-50 border-none rounded-xl px-4 py-2 font-black text-xs uppercase tracking-widest text-slate-700 focus:ring-2 focus:ring-primary/20 cursor-pointer outline-none"
                                    >
                                        <option value="newest">Más Recientes</option>
                                        <option value="price-asc">Precio: Menor a Mayor</option>
                                        <option value="price-desc">Precio: Mayor a Menor</option>
                                        <option value="rating">Popularidad</option>
                                    </select>
                                </div>
                            </div>

                            {filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                                    {filteredProducts.map(prod => (
                                        <ProductCard key={prod.id} product={prod} />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-24 text-center">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter">No encontramos lo que buscas</h3>
                                    <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10">Probá con otros filtros o términos de búsqueda para encontrar lo que necesitas.</p>
                                    <button onClick={clearFilters} className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/30">Limpiar Filtros</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-xl">Cargando...</div></div>}>
            <SearchContent />
        </Suspense>
    );
}
