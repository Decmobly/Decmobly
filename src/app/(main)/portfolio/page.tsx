import Link from 'next/link';
import Image from 'next/image'; // 1. Importação adicionada
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { ArrowRight, MapPin, Search } from 'lucide-react';
import type { Project, Category, ProjectImage, Prisma } from '@prisma/client';
import { PortfolioFilters } from './_components/portfolio-filters'; 

export const metadata: Metadata = {
  title: 'Portfólio | Decmobly',
  description: 'Conheça nossos projetos exclusivos de móveis planejados.',
};

// Força a renderização dinâmica (essencial para filtros funcionarem)
export const dynamic = 'force-dynamic';

type ProjectWithRelations = Project & {
  category: Category;
  images: ProjectImage[];
};

// ATENÇÃO AQUI: searchParams agora é uma Promise
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PortfolioPage(props: PageProps) {
  // 1. AWAIT nos searchParams antes de usar
  const searchParams = await props.searchParams;

  console.log("🔍 Filtros recebidos:", searchParams);

  const categorySlug = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const searchQuery = typeof searchParams.q === 'string' ? searchParams.q : undefined;

  // 2. Construir a query do Prisma
  const whereClause: Prisma.ProjectWhereInput = {
    // Busca por Texto
    ...(searchQuery && {
      OR: [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { shortDesc: { contains: searchQuery, mode: 'insensitive' } },
        { location: { contains: searchQuery, mode: 'insensitive' } },
      ],
    }),
    // Filtro de Categoria
    ...(categorySlug && {
      category: {
        slug: categorySlug,
      },
    }),
  };

  // 3. Buscar Projetos e Categorias
  const [projects, categories] = await Promise.all([
    prisma.project.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: {
          take: 1,
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#fdfbf7] pt-32 pb-20 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Componente de Filtros */}
        <PortfolioFilters categories={categories} />

        {/* Grid de Projetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: ProjectWithRelations) => (
            <Link 
              key={project.id} 
              href={`/portfolio/${project.slug}`}
              className="group bg-white  overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#efe4cd] flex flex-col"
            >
              <div className="relative h-64 overflow-hidden bg-gray-200">
                {project.images[0] ? (
                  /* 2. Substituição por Next/Image */
                  <Image 
                    src={project.images[0].url} 
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#5c4d3c] opacity-50 bg-[#efe4cd]">
                    Sem imagem
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-[#fdfbf7]/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-[#5c4d3c] uppercase tracking-wide z-10">
                  {project.category.name}
                </div>
              </div>

              <div className="p-6 flex flex-col grow">
                <h3 className="text-xl font-serif font-bold text-[#5c4d3c] mb-2 group-hover:text-black transition-colors">
                  {project.title}
                </h3>
                {project.location && (
                  <div className="flex items-center text-xs text-gray-400 mb-3">
                    <MapPin size={12} className="mr-1" />
                    {project.location}
                  </div>
                )}
                <p className="text-sm text-gray-600 line-clamp-3 mb-6 grow">
                  {project.shortDesc}
                </p>
                <div className="flex items-center text-[#5c4d3c] font-bold text-sm mt-auto group/btn">
                  Ver Projeto Completo
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Estado Vazio */}
        {projects.length === 0 && (
          <div className="text-center py-20 bg-white  border border-dashed border-gray-300 mt-8">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <Search size={48} strokeWidth={1} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Nenhum projeto encontrado</h3>
            <p className="mt-2 text-gray-500 max-w-sm mx-auto">
              Não encontramos projetos nesta categoria.
            </p>
            <div className="mt-6">
               <Link href="/portfolio" className="text-[#5c4d3c] font-bold hover:underline">
                 Limpar todos os filtros
               </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}