import Image from "next/image";
import Link from "next/link";
import { getProductById, getProducts } from "@/lib/woocommerce";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductInteraction from "@/components/ProductInteraction";
import { Product } from "@/types";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;

    let product: Product | null = null;
    let relatedProducts: Product[] = [];
    let error: string | null = null;

    try {
        const wcProd = await getProductById(parseInt(id));

        if (wcProd) {
            product = {
                id: wcProd.id,
                name: wcProd.name,
                price: parseFloat(wcProd.price),
                description: wcProd.description.replace(/<[^>]*>?/gm, '').trim(), // Better for the detail section
                category: wcProd.categories[0]?.name || "General",
                brand: wcProd.attributes.find((a: any) => a.name.toLowerCase() === 'marca')?.options[0] || "LD",
                stock: wcProd.stock_quantity || 0,
                image: wcProd.images[0]?.src || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=800&auto=format&fit=crop",
                images: wcProd.images.map((img: any) => img.src),
                sku: wcProd.sku,
                rating: parseFloat(wcProd.average_rating) || 5,
                reviewsCount: wcProd.rating_count || 0,
                isNew: wcProd.date_created > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                isOffer: wcProd.on_sale
            };

            // Fetch related products (same category)
            if (wcProd.categories[0]) {
                const relatedData = await getProducts({
                    category: wcProd.categories[0].id,
                    per_page: 5, // 4 + 1 potentially excluding current
                    exclude: [wcProd.id]
                });

                relatedProducts = relatedData.slice(0, 4).map((rp: any) => ({
                    id: rp.id,
                    name: rp.name,
                    price: parseFloat(rp.price),
                    description: rp.short_description.replace(/<[^>]*>?/gm, ''),
                    category: rp.categories[0]?.name || "General",
                    brand: rp.attributes.find((a: any) => a.name.toLowerCase() === 'marca')?.options[0] || "LD",
                    stock: rp.stock_quantity || 0,
                    image: rp.images[0]?.src || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=800&auto=format&fit=crop",
                    rating: parseFloat(rp.average_rating) || 5,
                    reviewsCount: rp.rating_count || 0,
                    isOffer: rp.on_sale
                }));
            }
        }
    } catch (err) {
        console.error("Error loading product page:", err);
        error = "No pudimos cargar el producto.";
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center pt-32">
                    <div className="text-center">
                        <h1 className="text-4xl font-black mb-4">{error || "Producto no encontrado"}</h1>
                        <Link href="/search" className="text-primary font-bold hover:underline">Volver al catálogo</Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const regPrice = product.isOffer ? product.price * 1.2 : product.price;

    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans">
            <Header />

            <main className="pt-32 pb-24">
                {/* Breadcrumbs */}
                <nav className="container mx-auto px-4 md:px-8 py-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                    <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                    <span>/</span>
                    <Link href={`/search?category=${product.category}`} className="hover:text-primary transition-colors uppercase">{product.category}</Link>
                    <span>/</span>
                    <span className="text-slate-500 uppercase">{product.name}</span>
                </nav>

                <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Gallery Side */}
                    <div className="space-y-6">
                        <div className="relative aspect-square bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100/50 group cursor-zoom-in shadow-2xl shadow-slate-200/50">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                priority
                            />
                            <div className="absolute top-8 left-8 flex flex-col gap-3">
                                <div className="bg-primary text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-xl">Original Import</div>
                                {product.isOffer && (
                                    <div className="bg-rose-500 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-xl">Oferta Especial</div>
                                )}
                            </div>
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.slice(0, 4).map((img, i) => (
                                    <div key={i} className={`aspect-square rounded-2xl bg-slate-50 border-2 transition-all cursor-pointer hover:border-primary/30 relative overflow-hidden ${i === 0 ? 'border-primary' : 'border-slate-50'}`}>
                                        <Image src={img} alt="preview" fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content Side */}
                    <div className="flex flex-col">
                        <div className="mb-4">
                            <span className="text-primary font-black text-xs uppercase tracking-[0.3em]">{product.brand}</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.9] mb-8 text-slate-900">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-slate-200'}`} viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{product.reviewsCount} Reseñas Verificadas</span>
                        </div>

                        {product.sku && (
                            <div className="mb-10">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">SKU: {product.sku}</span>
                            </div>
                        )}

                        <p className="text-slate-500 font-medium leading-relaxed mb-10 text-xl border-l-4 border-primary pl-6">
                            {product.description}
                        </p>

                        <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 mb-12 shadow-inner">
                            <div className="flex items-baseline gap-6 mb-3">
                                <span className="text-5xl font-black text-primary tracking-tighter">${product.price.toLocaleString('es-AR')}</span>
                                {product.isOffer && (
                                    <span className="text-slate-300 line-through font-bold text-2xl">${regPrice.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                                )}
                            </div>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                Envío gratis a todo el país + 12 cuotas sin interés
                            </p>
                        </div>

                        {/* Quantity and Cart Interaction */}
                        <ProductInteraction product={product} />

                        {/* Inventory status */}
                        <div className="flex items-center gap-3 mb-12 px-6 py-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <span className="text-xs font-black uppercase tracking-widest text-amber-600">
                                {product.stock > 0 ? `Quedan solo ${product.stock} unidades en stock` : "Sin stock disponible"}
                            </span>
                        </div>

                        {/* Key Benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <BenefitItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} label="Entrega Prioritaria" sub="24-48 horas hábiles" />
                            <BenefitItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} label="Compra Seleccionada" sub="Garantía de Calidad LD" />
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="container mx-auto px-4 md:px-8 mt-32">
                        <div className="flex items-end justify-between mb-16">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Productos Similares</h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Completá tu set con lo mejor de {product.category}</p>
                            </div>
                            <div className="hidden md:block w-32 h-2 bg-primary/20 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map(prod => (
                                <ProductCard key={prod.id} product={prod} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}

function BenefitItem({ icon, label, sub }: { icon: React.ReactNode, label: string, sub: string }) {
    return (
        <div className="flex items-center gap-5 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-primary transition-all duration-300">
            <div className="w-12 h-12 bg-slate-50 text-primary rounded-2xl flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-0.5">{sub}</p>
                <p className="text-sm font-black uppercase text-slate-800 tracking-tight">{label}</p>
            </div>
        </div>
    );
}

