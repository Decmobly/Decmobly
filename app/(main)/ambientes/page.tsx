import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowRight, LayoutTemplate } from 'lucide-react';
import { Metadata } from 'next';
import type { Category } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Ambientes Planejados',
  description: 'Conheça nossos ambientes planejados sob medida. Cozinhas, dormitórios, banheiros e muito mais.',
};

export default async function AmbientesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { projects: true } } // Opcional: para mostrar quantos projetos tem
    }
  });

  return (
    // pt-28 (mobile) e pt-36 (desktop) compensam a altura do Header Fixo
    <main className="min-h-screen bg-[#fdfbf7] animate-in fade-in duration-500 pt-28 pb-20 md:pt-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header da Página */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-xs font-bold tracking-widest text-[#c4a986] uppercase mb-3 block">
            Nossos Espaços
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#5c4d3c] font-bold mb-6">
            Ambientes Planejados
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Explore nossas soluções por ambiente e descubra como podemos transformar cada canto da sua casa com elegância, funcionalidade e exclusividade.
          </p>
        </div>

        {/* Grid de Categorias */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category: Category & { _count?: { projects: number } }) => (
              <Link 
                key={category.id} 
                href={`/ambientes/${category.slug}`}
                className="group relative h-80 md:h-96 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer block focus:outline-none focus:ring-2 focus:ring-[#5c4d3c] focus:ring-offset-2"
              >
                {/* Imagem de Fundo com Zoom Suave */}
                <div className="absolute inset-0 bg-gray-200">
                  <img 
                    src={category.imageUrl || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80'} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
                  />
                  
                  {/* Overlay Gradiente Corrigido */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                </div>

                {/* Conteúdo do Card */}
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex flex-col justify-end h-full">
                  <div className="mt-auto translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h2 className="text-3xl font-serif text-white font-bold mb-2 tracking-wide">
                      {category.name}
                    </h2>
                    
                    {/* Contador de projetos (opcional) */}
                    {category._count && category._count.projects > 0 && (
                       <p className="text-white/70 text-xs mb-3 font-medium">
                         {category._count.projects} projeto(s) em destaque
                       </p>
                    )}

                    <div className="flex items-center text-[#efe4cd] opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                      <span className="text-sm font-bold uppercase tracking-wider mr-3 border-b border-transparent group-hover:border-[#efe4cd] transition-all">
                        Ver Projetos
                      </span>
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // Estado Vazio (Caso não tenha categorias cadastradas)
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-[#efe4cd] rounded-xl bg-white/50">
            <div className="bg-[#f7f1e3] p-4 rounded-full mb-4 text-[#5c4d3c]">
               <LayoutTemplate size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#5c4d3c] mb-2">Nenhum ambiente encontrado</h3>
            <p className="text-gray-500 max-w-md">
              Estamos atualizando nosso catálogo. Por favor, volte em breve para conferir as novidades.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}