import { Product, Order } from "@/types";

export const CATEGORIES = [
    "Tecnología",
    "Camping",
    "Ferretería",
    "Hogar",
    "Jardinería",
    "Limpieza"
];

export const BRANDS = [
    "Samsung",
    "Xiaomi",
    "Black+Decker",
    "Waterdog",
    "Philips",
    "Sony",
    "HP"
];

export const PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Reloj Inteligente Ultra Pro",
        price: 89900,
        description: "El smartwatch definitivo con pantalla AMOLED de 2.0 pulgadas, GPS integrado y resistencia al agua 5ATM.",
        category: "Tecnología",
        brand: "Samsung",
        stock: 5,
        image: "https://images.unsplash.com/photo-1546868831-70c30e3a5a30?q=80&w=800&auto=format&fit=crop",
        rating: 4.8,
        reviewsCount: 124,
        isNew: true
    },
    {
        id: 2,
        name: "Auriculares Noise Cancelling",
        price: 125000,
        description: "Cancelación activa de ruido líder en la industria. 30 horas de batería y sonido de alta fidelidad.",
        category: "Tecnología",
        brand: "Sony",
        stock: 12,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
        rating: 4.9,
        reviewsCount: 89,
        isOffer: true
    },
    {
        id: 3,
        name: "Drone 4K Explorer",
        price: 450000,
        description: "Captura momentos épicos desde el aire con resolución 4K a 60fps. Estabilización de 3 ejes.",
        category: "Tecnología",
        brand: "Xiaomi",
        stock: 3,
        image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=800&auto=format&fit=crop",
        rating: 4.7,
        reviewsCount: 45
    },
    {
        id: 4,
        name: "Cámara Deportiva Action X",
        price: 175400,
        description: "Sumergible hasta 30 metros. Grabación en 4K y modo cámara lenta ultra fluido.",
        category: "Tecnología",
        brand: "Sony",
        stock: 8,
        image: "https://images.unsplash.com/photo-1590330297626-d762c0a8582d?q=80&w=800&auto=format&fit=crop",
        rating: 4.5,
        reviewsCount: 67
    },
    {
        id: 5,
        name: "Carpa Térmica 4 Personas",
        price: 210000,
        description: "Material ultra resistente, costuras termoselladas y excelente ventilación para tus aventuras.",
        category: "Camping",
        brand: "Waterdog",
        stock: 15,
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop",
        rating: 4.9,
        reviewsCount: 230,
        isNew: true
    },
    {
        id: 6,
        name: "Taladro Percutor Inalámbrico",
        price: 75000,
        description: "Potencia y libertad sin cables. 18V de fuerza pura para cualquier trabajo en casa.",
        category: "Ferretería",
        brand: "Black+Decker",
        stock: 20,
        image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=800&auto=format&fit=crop",
        rating: 4.6,
        reviewsCount: 156,
        isOffer: true
    }
];

export const MOCK_ORDERS: Order[] = [
    {
        id: "ORD-7382",
        date: "2024-01-15",
        total: 125000,
        status: 'delivered',
        items: [
            { ...PRODUCTS[1], quantity: 1 }
        ]
    },
    {
        id: "ORD-9201",
        date: "2024-01-20",
        total: 89900,
        status: 'shipped',
        items: [
            { ...PRODUCTS[0], quantity: 1 }
        ]
    }
];

export const USER_REVIEWS = [
    {
        id: 1,
        user: "Carlos R.",
        rating: 5,
        comment: "Excelente atención y el producto llegó antes de lo esperado. Muy recomendable.",
        date: "2 días atrás"
    },
    {
        id: 2,
        user: "Marina P.",
        rating: 5,
        comment: "La calidad de los productos es increíble. Es mi tercera compra y siempre cumplen.",
        date: "1 semana atrás"
    },
    {
        id: 3,
        user: "Juan M.",
        rating: 4,
        comment: "Muy buena experiencia, el soporte técnico me ayudó con unas dudas rápidamente.",
        date: "2 semanas atrás"
    }
];
