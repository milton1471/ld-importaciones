import { Skeleton } from "./Skeleton";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export function HomeSkeleton() {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Header />
            <main>
                {/* Hero Skeleton */}
                <section className="pt-40 pb-20 bg-primary">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="max-w-3xl space-y-8">
                            <Skeleton className="h-4 w-48 bg-white/20" />
                            <Skeleton className="h-20 w-full bg-white/20 rounded-2xl" />
                            <Skeleton className="h-10 w-2/3 bg-white/20 rounded-xl" />
                            <div className="flex gap-4 pt-4">
                                <Skeleton className="h-16 w-48 bg-white/20 rounded-2xl" />
                                <Skeleton className="h-16 w-48 border border-white/20 bg-transparent rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Products Skeleton */}
                <section className="py-24">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="flex justify-between items-end mb-16">
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-64 rounded-xl" />
                            </div>
                            <Skeleton className="h-6 w-32" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map((i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
