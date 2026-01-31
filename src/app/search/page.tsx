import { Suspense } from "react";
import { getProducts } from "@/lib/woocommerce";
import SearchClient from "./SearchClient";
import { Product } from "@/types";
import { CatalogSkeleton } from "@/components/ui/CatalogSkeleton";
import { Metadata } from "next";

interface PageProps {
    searchParams: Promise<{ q?: string; category?: string; filter?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams;
    const query = params.q;
    const category = params.category;

    if (query) {
        return {
            title: `Buscar: ${query}`,
            description: `Resultados de búsqueda para "${query}" en LD Importaciones. Encontrá los mejores productos importados.`,
        };
    }

    if (category) {
        return {
            title: category,
            description: `Explorá nuestra categoría de ${category}. Calidad importada en Argentina.`,
        };
    }

    return {
        title: "Catálogo de Productos",
        description: "Explorá nuestro catálogo completo con miles de productos importados de calidad.",
    };
}

export default async function SearchPage({ searchParams }: PageProps) {
    let products: Product[] = [];

    try {
        // Obtenemos hasta 100 productos del catálogo real
        const data = await getProducts({ per_page: 100 });

        products = data.map((wcProd: any) => ({
            id: wcProd.id,
            name: wcProd.name,
            price: parseFloat(wcProd.price),
            description: wcProd.short_description.replace(/<[^>]*>?/gm, ''),
            category: wcProd.categories[0]?.name || "General",
            brand: wcProd.attributes.find((a: any) => a.name.toLowerCase() === 'marca')?.options[0] || "LD",
            stock: wcProd.stock_quantity || 0,
            image: wcProd.images[0]?.src || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=800&auto=format&fit=crop",
            rating: parseFloat(wcProd.average_rating) || 5,
            reviewsCount: wcProd.rating_count || 0,
            isNew: wcProd.date_created > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            isOffer: wcProd.on_sale
        }));
    } catch (error) {
        console.error("Error fetching products for search:", error);
    }

    return (
        <Suspense fallback={<CatalogSkeleton />}>
            <SearchClient initialProducts={products} />
        </Suspense>
    );
}
