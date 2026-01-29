"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { MOCK_ORDERS } from "@/data/mockData";

export default function AccountPage() {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />

            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Sidebar */}
                        <aside className="w-full lg:w-80 shrink-0">
                            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 space-y-8">
                                <div className="flex items-center gap-4 border-b border-slate-50 pb-8">
                                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/20">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="font-black text-slate-900 leading-tight">{user.name}</h2>
                                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest truncate max-w-[150px]">{user.email}</p>
                                    </div>
                                </div>

                                <nav className="space-y-2">
                                    <AccountNavLink href="/account" active>Dashboard</AccountNavLink>
                                    <AccountNavLink href="/account/orders">Mis Pedidos</AccountNavLink>
                                    <AccountNavLink href="/account/addresses">Direcciones</AccountNavLink>
                                    <AccountNavLink href="/account/wishlist">Lista de Deseos</AccountNavLink>
                                    <AccountNavLink href="/account/profile">Datos Personales</AccountNavLink>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-6 py-4 rounded-xl font-bold text-sm text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-between group"
                                    >
                                        Cerrar Sesión
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <StatCard title="Pedidos" value={MOCK_ORDERS.length.toString()} icon={<svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>} />
                                <StatCard title="Pendientes" value="0" icon={<svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} />
                                <StatCard title="Cupones" value="2" icon={<svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>} />
                            </div>

                            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                                <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                                    <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl">Últimos Pedidos</h3>
                                    <Link href="/account/orders" className="text-primary font-black text-xs uppercase tracking-widest hover:underline">Ver Historial</Link>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                                <th className="px-10 py-6">Pedido</th>
                                                <th className="px-10 py-6">Fecha</th>
                                                <th className="px-10 py-6">Total</th>
                                                <th className="px-10 py-6">Estado</th>
                                                <th className="px-10 py-6 text-right">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {MOCK_ORDERS.map(order => (
                                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-10 py-8 font-black text-sm text-slate-900">{order.id}</td>
                                                    <td className="px-10 py-8 font-bold text-sm text-slate-500">{order.date}</td>
                                                    <td className="px-10 py-8 font-black text-sm text-primary">${order.total.toLocaleString('es-AR')}</td>
                                                    <td className="px-10 py-8">
                                                        <span className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' :
                                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                                                                    'bg-amber-100 text-amber-600'
                                                            }`}>
                                                            {order.status === 'delivered' ? 'Entregado' :
                                                                order.status === 'shipped' ? 'En Camino' : 'Procesando'}
                                                        </span>
                                                    </td>
                                                    <td className="px-10 py-8 text-right">
                                                        <button className="bg-slate-100 hover:bg-primary hover:text-white p-3 rounded-xl transition-all">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function AccountNavLink({ href, children, active = false }: { href: string, children: React.ReactNode, active?: boolean }) {
    return (
        <Link
            href={href}
            className={`w-full block px-6 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-between group ${active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-600 hover:bg-slate-50 hover:text-primary"}`}
        >
            {children}
            {!active && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
            )}
        </Link>
    );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-between group hover:border-primary transition-colors">
            <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary transition-colors">{title}</h4>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
            </div>
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-primary-light transition-colors">
                {icon}
            </div>
        </div>
    );
}
