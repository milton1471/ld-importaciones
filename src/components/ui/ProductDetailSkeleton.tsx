import { Skeleton } from "./Skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export function ProductDetailSkeleton() {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Header />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 mb-32">
                        {/* Gallery Skeleton */}
                        <div className="space-y-6">
                            <Skeleton className="w-full aspect-square rounded-[3rem]" />
                            <div className="grid grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="aspect-square rounded-2xl" />
                                ))}
                            </div>
                        </div>

                        {/* Info Skeleton */}
                        <div className="flex flex-col">
                            <Skeleton className="h-6 w-32 rounded-full mb-6" />
                            <Skeleton className="h-12 w-3/4 rounded-xl mb-4" />
                            <Skeleton className="h-10 w-48 rounded-xl mb-8" />

                            <div className="space-y-4 mb-10 pb-10 border-b border-slate-100">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>

                            <div className="space-y-6 mb-10">
                                <div className="flex items-center gap-6">
                                    <Skeleton className="h-14 w-32 rounded-2xl" />
                                    <Skeleton className="h-14 flex-grow rounded-2xl" />
                                </div>
                            </div>

                            <div className="mt-auto grid grid-cols-2 gap-4">
                                <Skeleton className="h-16 rounded-2xl" />
                                <Skeleton className="h-16 rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
