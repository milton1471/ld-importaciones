import { Skeleton } from "./Skeleton";

export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-[2.5rem] p-4 lg:p-6 shadow-xl shadow-slate-100 border border-slate-50 flex flex-col h-full">
            {/* Image Placeholder */}
            <Skeleton className="w-full aspect-square rounded-[2rem] mb-6" />

            {/* Content Placeholders */}
            <div className="space-y-4 flex-grow">
                <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-3 w-20 rounded-full" />
                    <Skeleton className="h-5 w-8 rounded-full" />
                </div>
                <Skeleton className="h-6 w-full rounded-lg" />
                <Skeleton className="h-6 w-2/3 rounded-lg" />

                <div className="mt-auto pt-6">
                    <div className="flex items-baseline gap-2 mb-4">
                        <Skeleton className="h-8 w-24 rounded-lg" />
                        <Skeleton className="h-4 w-16 rounded-lg" />
                    </div>
                    <Skeleton className="h-14 w-full rounded-2xl" />
                </div>
            </div>
        </div>
    );
}
