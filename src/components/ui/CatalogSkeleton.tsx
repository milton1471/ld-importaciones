import { Skeleton } from "./Skeleton";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export function CatalogSkeleton() {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Header />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-4 md:px-8">
                    {/* Header Skeleton */}
                    <div className="mb-12">
                        <Skeleton className="h-10 w-64 rounded-xl mb-4" />
                        <div className="flex gap-4">
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </div>

                    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-12">
                        {/* Sidebar Skeleton */}
                        <div className="hidden lg:block space-y-12">
                            <div className="space-y-6">
                                <Skeleton className="h-4 w-24" />
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Skeleton key={i} className="h-12 w-full rounded-xl" />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <Skeleton className="h-4 w-24" />
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <Skeleton key={i} className="h-8 w-full rounded-lg" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Grid Skeleton */}
                        <div className="lg:col-span-3">
                            <div className="flex justify-between mb-10 pb-6 border-b border-slate-50">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-10 w-48 rounded-xl" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
