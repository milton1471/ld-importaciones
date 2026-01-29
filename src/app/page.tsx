import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/woocommerce";
import { Product } from "@/types";
import { Monitor, Tent, Wrench, Home as HomeIcon, Leaf, Sparkles } from "lucide-react";

export default async function Home() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    const data = await getProducts({ per_page: 4 });

    // Map WC products to frontend format
    products = data.map((wcProd: any) => ({
      id: wcProd.id,
      name: wcProd.name,
      price: parseFloat(wcProd.price),
      description: wcProd.short_description.replace(/<[^>]*>?/gm, ''), // Clean HTML
      category: wcProd.categories[0]?.name || "General",
      brand: wcProd.attributes.find((a: any) => a.name.toLowerCase() === 'marca')?.options[0] || "LD",
      stock: wcProd.stock_quantity || 0,
      image: wcProd.images[0]?.src || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=800&auto=format&fit=crop",
      rating: parseFloat(wcProd.average_rating) || 5,
      reviewsCount: wcProd.rating_count || 0,
      isNew: wcProd.date_created > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      isOffer: wcProd.on_sale
    }));
  } catch (err) {
    console.error("Error loading home products:", err);
    error = "No pudimos cargar los productos. Por favor intenta de nuevo más tarde.";
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative w-full aspect-[21/9] md:aspect-[3/1] lg:aspect-[4/1] overflow-hidden group">
          <Image
            src="/hero-lifestyle-4k.png"
            alt="LD Importaciones - Tu ventana al mundo"
            fill
            className="object-cover transition-transform duration-[10s] group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-transparent to-transparent flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-2xl text-white space-y-6">
                <div className="inline-block bg-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 animate-in fade-in slide-in-from-left duration-700">Llegaron las Novedades 2026</div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none animate-in fade-in slide-in-from-left duration-1000">TODO LO QUE BUSCAS<br />EN UN SOLO LUGAR.</h1>
                <p className="text-lg md:text-xl text-white/80 font-medium animate-in fade-in slide-in-from-left duration-1000 delay-200">Encontrá miles de productos importados de calidad con envío a todo el país y garantía oficial.</p>
                <div className="pt-8 flex gap-4 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
                  <Link href="/search" className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/30">Explorar Catálogo</Link>
                  <Link href="/search?filter=offers" className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/20 transition-all border border-white/20">Ver Ofertas</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="py-16 border-b border-slate-50 bg-slate-50/50">
          <div className="container mx-auto px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-12">
            <FeatureItem
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>}
              title="Envíos a Todo el País"
              desc="Recibí tu pedido en la puerta de tu casa"
            />
            <FeatureItem
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
              title="Cuotas Sin Interés"
              desc="Financiación con todas las tarjetas"
            />
            <FeatureItem
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
              title="Garantía Oficial"
              desc="Respaldo directo de las marcas"
            />
            <FeatureItem
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.05 9.402c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
              title="Calidad Premium"
              desc="Importación directa seleccionada"
            />
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-24 container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Lo más buscado</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Lo mejor del mercado global ahora disponible</p>
            </div>
            <Link href="/search" className="px-8 py-4 bg-slate-100 text-slate-900 font-black hover:bg-primary hover:text-white transition-all rounded-2xl uppercase text-[10px] tracking-[0.2em]">
              Ver catálogo completo
            </Link>
          </div>

          {error ? (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem]">
              <p className="text-slate-500 font-bold mb-4">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </section>

        {/* Promotional Banner */}
        <section className="py-12 px-4 md:px-8">
          <div className="container mx-auto relative h-[400px] rounded-[3rem] overflow-hidden bg-slate-900 flex items-center">
            <div className="absolute inset-0 opacity-40">
              <Image
                src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2000&auto=format&fit=crop"
                alt="Promo background"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 px-12 md:px-24 max-w-2xl text-white">
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 uppercase leading-tight">MÁS QUE UNA IMPORTACIÓN,<br />UNA EXPERIENCIA.</h3>
              <p className="text-white/70 font-medium text-lg mb-10">Unite a miles de clientes que ya disfrutan de productos importados de calidad con el respaldo de LD.</p>
              <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform shadow-2xl">Descubrí tu próximo favorito</button>
            </div>
            <div className="hidden lg:block absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/20 to-transparent"></div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 container mx-auto px-4 md:px-8 border-t border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { name: "Tecnología", icon: <Monitor className="w-8 h-8" strokeWidth={1.5} /> },
              { name: "Camping", icon: <Tent className="w-8 h-8" strokeWidth={1.5} /> },
              { name: "Ferretería", icon: <Wrench className="w-8 h-8" strokeWidth={1.5} /> },
              { name: "Hogar", icon: <HomeIcon className="w-8 h-8" strokeWidth={1.5} /> },
              { name: "Jardinería", icon: <Leaf className="w-8 h-8" strokeWidth={1.5} /> },
              { name: "Limpieza", icon: <Sparkles className="w-8 h-8" strokeWidth={1.5} /> },
            ].map((cat) => (
              <Link key={cat.name} href={`/search?category=${cat.name}`} className="group text-center space-y-4">
                <div className="aspect-square bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-500 overflow-hidden relative">
                  <div className="text-slate-400 group-hover:text-white transition-all duration-500 z-10">
                    {cat.icon}
                  </div>
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors">{cat.name}</h4>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-6 group cursor-default">
      <div className="transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 bg-white shadow-xl shadow-slate-100 p-8 rounded-[2rem] border border-slate-100/50">
        {icon}
      </div>
      <div>
        <h3 className="font-black text-slate-900 text-lg tracking-tighter mb-2">{title}</h3>
        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed px-4">{desc}</p>
      </div>
    </div>
  )
}

