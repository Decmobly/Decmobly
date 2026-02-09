// components/portfolio-filters.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Category } from '@prisma/client';
import { useCallback } from 'react';

interface PortfolioFiltersProps {
  categories: Category[];
}

export function PortfolioFilters({ categories }: PortfolioFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pega valores atuais da URL
  const currentCategory = searchParams.get('category');
  const currentSearch = searchParams.get('q') || '';

  // Função para criar a Query String
  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (value === null || value === '') {
        params.delete(name);
      } else {
        params.set(name, value);
      }
 
      return params.toString();
    },
    [searchParams]
  );

  // Atualiza a URL ao selecionar categoria
  const handleCategoryChange = (slug: string | null) => {
    router.push(`?${createQueryString('category', slug)}`, { scroll: false });
  };

  // Atualiza a URL ao digitar (com debounce simples para não travar)
  const handleSearchChange = (term: string) => {
    router.push(`?${createQueryString('q', term)}`, { scroll: false });
  };

  return (
    <div className="w-full mb-12 space-y-6">
      
      {/* Barra de Busca e Filtros Container */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Barra de Busca */}
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar projetos..."
            defaultValue={currentSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-[#efe4cd]  leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#5c4d3c] focus:border-[#5c4d3c] sm:text-sm transition-all shadow-sm"
          />
        </div>

        {/* Lista de Categorias (Desktop: Lista / Mobile: Scroll Horizontal) */}
        <div className="w-full md:w-2/3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <div className="flex space-x-2 md:justify-end min-w-max px-1">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-4 py-2  text-sm font-medium transition-all duration-200 border ${
                !currentCategory
                  ? 'bg-[#5c4d3c] text-white border-[#5c4d3c]'
                  : 'bg-white text-gray-600 border-[#efe4cd] hover:border-[#5c4d3c] hover:text-[#5c4d3c]'
              }`}
            >
              Todos
            </button>
            
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2  text-sm font-medium transition-all duration-200 border ${
                  currentCategory === cat.slug
                    ? 'bg-[#5c4d3c] text-white border-[#5c4d3c]'
                    : 'bg-white text-gray-600 border-[#efe4cd] hover:border-[#5c4d3c] hover:text-[#5c4d3c]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Indicador de Filtros Ativos (Opcional - UX) */}
      {(currentCategory || currentSearch) && (
        <div className="text-sm text-gray-500 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span>Exibindo resultados para:</span>
          {currentSearch && <span className="font-bold">&quot;{currentSearch}&quot;</span>}
          {currentCategory && currentSearch && <span>em</span>}
          {currentCategory && (
            <span className="font-bold">
              {categories.find(c => c.slug === currentCategory)?.name || currentCategory}
            </span>
          )}
          <button 
            onClick={() => router.push('?', { scroll: false })}
            className="ml-2 text-xs underline text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <X size={12} /> Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}