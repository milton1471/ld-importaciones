export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
    brand: string;
    stock: number;
    image: string;
    images?: string[];
    sku?: string;
    rating: number;
    reviewsCount: number;
    isNew?: boolean;
    isOffer?: boolean;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface Order {
    id: string;
    date: string;
    total: number;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    items: CartItem[];
}
