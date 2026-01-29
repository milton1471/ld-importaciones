"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type CheckoutStep = "datos" | "direccion" | "envio" | "pago" | "confirmacion";

const steps: { key: CheckoutStep; label: string }[] = [
    { key: "datos", label: "Datos" },
    { key: "direccion", label: "Dirección" },
    { key: "envio", label: "Envío" },
    { key: "pago", label: "Pago" },
    { key: "confirmacion", label: "Éxito" },
];

export default function CheckoutPage() {
    const { cart, totalPrice, totalItems, clearCart } = useCart();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState<CheckoutStep>("datos");
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        telefono: "",
        calle: "",
        ciudad: "",
        cp: "",
        envio: "estandar",
        pago: "mercadopago",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                nombre: user.name,
                email: user.email
            }));
        }
    }, [user]);

    const stepIndex = steps.findIndex((s) => s.key === currentStep);

    const validateStep = () => {
        if (currentStep === "datos") {
            return formData.nombre && formData.email && formData.telefono;
        }
        if (currentStep === "direccion") {
            return formData.calle && formData.ciudad && formData.cp;
        }
        return true;
    };

    const nextStep = async () => {
        if (!validateStep()) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        if (currentStep === "pago") {
            await handleFinishOrder();
        } else {
            const nextIdx = stepIndex + 1;
            if (nextIdx < steps.length) {
                setCurrentStep(steps[nextIdx].key);
                window.scrollTo(0, 0);
            }
        }
    };

    const handleFinishOrder = async () => {
        setIsSubmitting(true);
        setOrderError(null);

        // Format data for WooCommerce
        const orderPayload = {
            payment_method: formData.pago === 'mercadopago' ? 'mercadopago' : 'bacs',
            payment_method_title: formData.pago === 'mercadopago' ? 'Mercado Pago' : 'Transferencia bancaria',
            set_paid: false,
            status: 'pending', // Siempre pendiente hasta recibir confirmación de pago
            billing: {
                first_name: formData.nombre.split(' ')[0],
                last_name: formData.nombre.split(' ').slice(1).join(' ') || '.',
                email: formData.email,
                phone: formData.telefono,
                address_1: formData.calle,
                city: formData.ciudad,
                postcode: formData.cp,
                country: 'AR'
            },
            shipping: {
                first_name: formData.nombre.split(' ')[0],
                last_name: formData.nombre.split(' ').slice(1).join(' ') || '.',
                address_1: formData.calle,
                city: formData.ciudad,
                postcode: formData.cp,
                country: 'AR'
            },
            line_items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }))
        };

        try {
            // 1. Crear pedido en WooCommerce
            const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });

            const orderData = await orderResponse.json();

            if (!orderResponse.ok) throw new Error(orderData.error || "Fallo en la creación del pedido");

            const orderId = orderData.id;
            setOrderNumber(orderData.number);

            // 2. Si es Mercado Pago, crear preferencia y redirigir
            if (formData.pago === 'mercadopago') {
                const mpResponse = await fetch('/api/mercadopago/create-preference', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: cart,
                        orderId: orderId,
                        customerEmail: formData.email
                    })
                });

                const mpData = await mpResponse.json();

                if (!mpResponse.ok) throw new Error(mpData.error || "Fallo al crear preferencia de Mercado Pago");

                // Redirigir a Mercado Pago
                window.location.href = mpData.init_point;
            } else {
                // Si es transferencia, mostrar pantalla de éxito local
                setCurrentStep("confirmacion");
                window.scrollTo(0, 0);
            }
        } catch (err: any) {
            console.error("Error processing order:", err);
            setOrderError("Hubo un problema al procesar tu pedido. " + (err.message || "Por favor intenta nuevamente."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const prevStep = () => {
        const prevIdx = stepIndex - 1;
        if (prevIdx >= 0) {
            setCurrentStep(steps[prevIdx].key);
            window.scrollTo(0, 0);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    if (cart.length === 0 && currentStep !== "confirmacion") {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center p-4 pt-32">
                    <div className="bg-white p-16 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 text-center max-w-lg">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Tu carrito está vacío</h2>
                        <p className="text-slate-400 font-medium mb-10 leading-relaxed text-sm">No puedes iniciar el proceso de pago sin productos seleccionados.</p>
                        <Link href="/search" className="bg-primary text-white font-black py-5 px-10 rounded-2xl uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-primary/20 inline-block transition-transform hover:scale-105">Explorar Catálogo</Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <Header />

            <main className="container mx-auto px-4 pt-32 pb-24 max-w-6xl">
                {/* Stepper Premium */}
                <div className="flex justify-between items-center mb-24 max-w-4xl mx-auto relative px-4">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 -translate-y-1/2 z-0"></div>
                    {steps.map((step, idx) => {
                        const isActive = idx <= stepIndex;
                        const isCurrent = idx === stepIndex;
                        return (
                            <div key={step.key} className="relative z-10 flex flex-col items-center gap-4">
                                <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-700 border-2 ${isActive
                                        ? "bg-primary text-white border-primary shadow-2xl shadow-primary/40 rotate-[10deg]"
                                        : "bg-white text-slate-300 border-slate-100"
                                        } ${isCurrent ? "scale-125" : ""}`}
                                >
                                    {idx + 1}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] absolute -bottom-8 whitespace-nowrap ${isActive ? "text-primary" : "text-slate-300"}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Form Side */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100 min-h-[500px] flex flex-col">
                            {orderError && (
                                <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl text-xs font-bold uppercase tracking-widest text-center animate-in fade-in zoom-in-95">
                                    {orderError}
                                </div>
                            )}

                            {currentStep === "datos" && (
                                <div className="animate-in fade-in slide-in-from-right-8 duration-700">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-10 text-slate-900 leading-none">Datos Personales</h2>
                                    <div className="space-y-8">
                                        <InputField label="Nombre Completo" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Ej: Juan Pérez" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <InputField label="Correo Electrónico" name="email" value={formData.email} onChange={handleInputChange} placeholder="ejemplo@correo.com" type="email" />
                                            <InputField label="Teléfono de contacto" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="+54 9 11 ..." type="tel" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === "direccion" && (
                                <div className="animate-in fade-in slide-in-from-right-8 duration-700">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-10 text-slate-900 leading-none">Domicilio de Entrega</h2>
                                    <div className="space-y-8">
                                        <InputField label="Calle y Altura" name="calle" value={formData.calle} onChange={handleInputChange} placeholder="Av. Siempre Viva 742" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <InputField label="Ciudad / Localidad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} placeholder="CABA" />
                                            <InputField label="Código Postal" name="cp" value={formData.cp} onChange={handleInputChange} placeholder="B1000" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === "envio" && (
                                <div className="animate-in fade-in slide-in-from-right-8 duration-700">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-10 text-slate-900 leading-none">Logística y Entrega</h2>
                                    <div className="space-y-6">
                                        <SelectionCard
                                            isSelected={formData.envio === 'estandar'}
                                            onClick={() => setFormData(p => ({ ...p, envio: 'estandar' }))}
                                            title="Envío Estándar (Correo Argentino)"
                                            sub="Entrega en 3 a 7 días hábiles"
                                            price="GRATIS"
                                        />
                                        <SelectionCard
                                            isSelected={formData.envio === 'express'}
                                            onClick={() => setFormData(p => ({ ...p, envio: 'express' }))}
                                            title="Envío Priority Express"
                                            sub="Entrega asegurada en 24/48 hs"
                                            price="$4.500"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === "pago" && (
                                <div className="animate-in fade-in slide-in-from-right-8 duration-700">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-10 text-slate-900 leading-none">Método de Pago</h2>
                                    <div className="space-y-6">
                                        <PaymentCard
                                            isSelected={formData.pago === 'mercadopago'}
                                            onClick={() => setFormData(p => ({ ...p, pago: 'mercadopago' }))}
                                            title="Mercado Pago"
                                            sub="Tarjetas, Débito o Efectivo"
                                            badge="Hasta 12 cuotas"
                                            icon={<span className="text-sky-500 font-black italic">MP</span>}
                                        />
                                        <PaymentCard
                                            isSelected={formData.pago === 'transferencia'}
                                            onClick={() => setFormData(p => ({ ...p, pago: 'transferencia' }))}
                                            title="Transferencia Directa"
                                            sub="Envía el comprobante vía WhatsApp"
                                            badge="-10% OFF"
                                            icon={<span className="text-emerald-500 font-black uppercase text-[10px]">BANK</span>}
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === "confirmacion" && (
                                <div className="flex flex-col items-center justify-center text-center py-16 animate-in zoom-in-95 duration-1000">
                                    <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-emerald-500/30 rotate-[15deg]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h2 className="text-5xl font-black uppercase tracking-tighter italic mb-4 text-slate-900">¡Pedido Exitoso!</h2>
                                    <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-12 bg-primary/5 px-6 py-2 rounded-full italic">Referencia: #{orderNumber || "Generando..."}</p>
                                    <p className="text-slate-500 font-medium max-w-sm mb-6 text-lg">Tu importación ha sido procesada correctamente.</p>
                                    {formData.pago === 'transferencia' && (
                                        <div className="mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 italic">Instrucciones de Pago:</p>
                                            <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                                                Para confirmar tu pedido, realiza la transferencia al CBU: 000000310000000000<br />
                                                Y envía el comprobante por WhatsApp con el nro de pedido.
                                            </p>
                                        </div>
                                    )}
                                    <Link href="/" className="bg-primary text-white font-black py-6 px-16 rounded-[2rem] hover:bg-primary-dark transition-all uppercase text-xs tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center gap-4" onClick={() => clearCart()}>
                                        <span>Volver al Catálogo</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                </div>
                            )}

                            {/* Nav Buttons */}
                            {currentStep !== "confirmacion" && (
                                <div className="mt-auto pt-16 flex justify-between items-center">
                                    {stepIndex > 0 ? (
                                        <button
                                            onClick={prevStep}
                                            disabled={isSubmitting}
                                            className="font-black text-slate-400 hover:text-primary transition-colors uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
                                            Anterior
                                        </button>
                                    ) : (
                                        <Link href="/cart" className="font-black text-slate-400 hover:text-primary transition-colors uppercase text-[10px] tracking-[0.2em]">Cancelar</Link>
                                    )}
                                    <button
                                        onClick={nextStep}
                                        disabled={isSubmitting}
                                        className="bg-primary text-white font-black py-6 px-12 rounded-2xl hover:bg-primary-dark transition-all uppercase text-xs tracking-[0.3em] shadow-2xl shadow-primary/40 active:scale-95 flex items-center gap-2 disabled:opacity-70"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Procesando...</span>
                                            </>
                                        ) : (
                                            currentStep === "pago" ? "Finalizar Compra" : "Siguiente Paso"
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary Side */}
                    {currentStep !== "confirmacion" && (
                        <div className="lg:col-span-1">
                            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 sticky top-32">
                                <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-10 pb-6 border-b border-slate-50">Resumen de Importación</h3>
                                <div className="space-y-6 mb-10 max-h-64 overflow-y-auto pr-4 custom-scrollbar">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex justify-between items-start gap-6">
                                            <div className="w-12 h-12 relative rounded-xl overflow-hidden shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-bold text-xs text-slate-800 leading-tight mb-1 uppercase line-clamp-1">{item.name}</p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Cant: {item.quantity}</p>
                                            </div>
                                            <p className="font-black text-xs text-primary">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-4 pt-8 border-t border-slate-50 mb-10">
                                    <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span className="text-slate-900">${totalPrice.toLocaleString('es-AR')}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>Logística ({formData.envio})</span>
                                        <span className="text-primary">{formData.envio === 'express' ? '$4.500' : 'SIN CARGO'}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end bg-slate-50 -mx-10 px-10 py-10 rounded-b-[3rem] border-t-2 border-dashed border-slate-200">
                                    <div className="space-y-1">
                                        <span className="font-black text-slate-400 uppercase text-[9px] tracking-[0.2em] block">Inversión Final</span>
                                        <span className="font-black text-primary text-3xl tracking-tighter leading-none">
                                            ${(totalPrice + (formData.envio === 'express' ? 4500 : 0)).toLocaleString('es-AR')}
                                        </span>
                                    </div>
                                    <div className="mb-1">
                                        <svg className="w-6 h-6 text-slate-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

function InputField({ label, name, value, onChange, placeholder, type = "text" }: any) {
    return (
        <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{label}</label>
            <input
                type={type} name={name} value={value} onChange={onChange}
                className="w-full bg-slate-50 border-none rounded-[1.5rem] px-8 py-5 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-700 outline-none placeholder:text-slate-300 shadow-inner"
                placeholder={placeholder}
            />
        </div>
    );
}

function SelectionCard({ isSelected, onClick, title, sub, price }: any) {
    return (
        <div onClick={onClick} className={`p-8 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center gap-6 group ${isSelected ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}>
            <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${isSelected ? 'border-primary bg-white' : 'border-slate-200'}`}>
                {isSelected && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
            </div>
            <div className="flex-grow">
                <p className={`font-black uppercase text-sm mb-1 ${isSelected ? 'text-primary' : 'text-slate-800'}`}>{title}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{sub}</p>
            </div>
            <span className={`font-black text-lg tracking-tighter ${isSelected ? 'text-primary' : 'text-slate-400'}`}>{price}</span>
        </div>
    );
}

function PaymentCard({ isSelected, onClick, title, sub, badge, icon }: any) {
    return (
        <div onClick={onClick} className={`flex flex-col p-8 rounded-[2rem] border-2 transition-all cursor-pointer group ${isSelected ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}>
            <div className="flex items-center gap-6 w-full">
                <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${isSelected ? 'border-primary bg-white' : 'border-slate-200'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                </div>
                <div className="flex-grow">
                    <p className={`font-black uppercase text-sm mb-1 ${isSelected ? 'text-primary' : 'text-slate-800'}`}>{title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{sub}</p>
                </div>
                <div className="bg-white shadow-sm border border-slate-100 rounded-xl p-3">
                    {icon}
                </div>
            </div>
            {isSelected && (
                <div className="mt-6 pt-6 border-t border-primary/10 flex justify-between items-center animate-in slide-in-from-top-4 duration-500">
                    <div className="bg-primary/10 text-primary text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">{badge}</div>
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Siguiente paso: Confirmar</span>
                </div>
            )}
        </div>
    );
}
