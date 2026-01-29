import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WORDPRESS_URL!,
    consumerKey: process.env.WC_CONSUMER_KEY!,
    consumerSecret: process.env.WC_CONSUMER_SECRET!,
    version: "wc/v3",
    queryStringAuth: true,
    axiosConfig: {
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
    },
});

export const getProducts = async (params: any = {}) => {
    try {
        const response = await api.get("products", {
            ...params,
            per_page: params.per_page || 20,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const getProductById = async (id: number) => {
    try {
        const response = await api.get(`products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const response = await api.get("products/categories", {
            per_page: 100,
            hide_empty: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

export const createOrder = async (orderData: any) => {
    try {
        console.log("=== DATOS DEL PEDIDO ===");
        console.log(JSON.stringify(orderData, null, 2));
        console.log("========================");
        const response = await api.post("orders", orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};

export default api;
