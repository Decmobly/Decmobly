// src/app/gestor/(admin)/portfolio/categories/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { CategoriesClientPage } from './_components/CategoriesClientPage';

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/gestor/login');

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { projects: true } } // Conta quantos projetos tem na categoria
    }
  });

  return (
    // AJUSTE MOBILE: Adicionado 'pt-20' para o conteúdo descer e não ficar atrás do header fixo (h-16).
    // 'md:pt-0' garante que no desktop (onde não tem header fixo no topo) o espaçamento seja normal.
    <div className="pt-20 md:pt-0">
      <CategoriesClientPage initialCategories={categories} />
    </div>
  );
}