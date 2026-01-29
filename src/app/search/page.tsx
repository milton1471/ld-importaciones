import { Suspense } from 'react';

function SearchContent() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Resultados de búsqueda
                </h1>
                <p className="text-gray-600">
                    Próximamente: Búsqueda de productos
                </p>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <SearchContent />
        </Suspense>
    );
}
